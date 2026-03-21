const axios = require('axios');

const BASE = 'https://api.github.com';
const GITHUB_NETWORK_CODES = new Set(['ENOTFOUND', 'ECONNREFUSED', 'ETIMEDOUT', 'ECONNRESET', 'ECONNABORTED']);

/** @returns {Record<string, string>} */
function githubHeaders() {
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  };
}

/**
 * @param {import('axios').AxiosError} err
 * @param {string} owner
 * @param {string} repo
 */
function handleGitHubError(err, owner, repo) {
  const status = err.response?.status;

  if (status === 404) {
    const e = new Error(`Repository "${owner}/${repo}" not found on GitHub`);
    e.statusCode = 404;
    throw e;
  }

  if (status === 403 || status === 429) {
    const reset = err.response?.headers?.['x-ratelimit-reset'];
    const e = new Error(
      'GitHub API rate limit exceeded. Set GITHUB_TOKEN for a higher limit, or retry later.'
    );
    e.statusCode = 429;
    e.retryAfterSec = reset ? Math.max(0, Number(reset) - Math.floor(Date.now() / 1000)) : undefined;
    throw e;
  }

  if (status === 401) {
    const e = new Error('GitHub token is invalid or expired. Check GITHUB_TOKEN.');
    e.statusCode = 500;
    throw e;
  }

  if (!err.response && GITHUB_NETWORK_CODES.has(err.code)) {
    const e = new Error('Could not reach the GitHub API.');
    e.statusCode = 503;
    throw e;
  }

  throw err;
}

/**
 * @param {() => Promise<import('axios').AxiosResponse>} fn
 * @param {{ owner: string, repo: string }} ctx
 * @param {number} [maxAttempts]
 * @param {{ allow404?: boolean }} [options]
 */
async function withRetry(fn, ctx, maxAttempts = 3, options = {}) {
  const { allow404 = false } = options;
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const status = err.response?.status;
      const shouldRetry = status === 429 || status === 403 || (status >= 500 && status < 600);
      if (!shouldRetry || attempt === maxAttempts) {
        if (allow404 && status === 404) throw err;
        handleGitHubError(err, ctx.owner, ctx.repo);
      }
      const retryAfter = err.response?.headers?.['retry-after'];
      const waitMs = retryAfter
        ? Number(retryAfter) * 1000
        : Math.min(8000, 500 * 2 ** (attempt - 1));
      // eslint-disable-next-line no-console
      console.warn(
        `[github.service] Retry ${attempt}/${maxAttempts} after ${waitMs}ms (${ctx.owner}/${ctx.repo})`
      );
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
  if (allow404 && lastErr.response?.status === 404) throw lastErr;
  handleGitHubError(lastErr, ctx.owner, ctx.repo);
}

/**
 * @param {string} url
 * @param {import('axios').AxiosRequestConfig} [config]
 * @param {{ owner?: string, repo?: string }} [ctx]
 * @param {{ allow404?: boolean }} [opts]
 */
async function ghGet(url, config = {}, ctx = { owner: '', repo: '' }, opts = {}) {
  try {
    return await withRetry(
      () => axios.get(url, { ...config, headers: { ...githubHeaders(), ...config.headers } }),
      ctx,
      3,
      { allow404: opts.allow404 }
    );
  } catch (err) {
    if (opts.allow404 && err.response?.status === 404) return null;
    throw err;
  }
}

/** Simple TTL cache for aggregate responses */
const aggregateCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * @param {string} owner
 * @param {string} repo
 */
async function getRepoMeta(owner, repo) {
  const ctx = { owner, repo };
  const { data } = await ghGet(`${BASE}/repos/${owner}/${repo}`, {}, ctx);
  return {
    name: data.full_name,
    stars: data.stargazers_count ?? 0,
    forks: data.forks_count ?? 0,
    defaultBranch: data.default_branch ?? 'main',
    pushedAt: data.pushed_at,
    openIssuesCountRaw: data.open_issues_count ?? 0,
    updatedAt: data.updated_at,
  };
}

/**
 * Approximate commits in the last 7 days (paginated, capped for safety).
 * @param {string} owner
 * @param {string} repo
 */
async function getCommitFrequency(owner, repo) {
  const ctx = { owner, repo };
  const since = new Date();
  since.setDate(since.getDate() - 7);
  const sinceIso = since.toISOString();

  let count = 0;
  let page = 1;
  const perPage = 100;
  const maxPages = 10;

  while (page <= maxPages) {
    let res;
    try {
      res = await ghGet(`${BASE}/repos/${owner}/${repo}/commits`, {
        params: { since: sinceIso, per_page: perPage, page },
      }, ctx);
    } catch (err) {
      if (err.response?.status === 409) {
        return { commitsPerWeek: 0, lastCommitSha: null, lastCommitDate: null };
      }
      throw err;
    }

    const batch = Array.isArray(res.data) ? res.data : [];
    count += batch.length;
    if (batch.length < perPage) break;
    page += 1;
  }

  let lastCommitDate = null;
  try {
    const { data } = await ghGet(
      `${BASE}/repos/${owner}/${repo}/commits`,
      { params: { per_page: 1 } },
      ctx
    );
    if (Array.isArray(data) && data[0]?.commit?.author?.date) {
      lastCommitDate = data[0].commit.author.date;
    } else if (Array.isArray(data) && data[0]?.commit?.committer?.date) {
      lastCommitDate = data[0].commit.committer.date;
    }
  } catch {
    /* optional */
  }

  return { commitsPerWeek: count, lastCommitDate };
}

/**
 * Count items from GET /repos/{owner}/{repo}/issues with pagination (no Search API).
 * @param {'open'|'closed'} state
 * @param {(item: object) => boolean} predicate
 * @param {number} [maxPages] per_page=100 each
 * @returns {{ count: number, truncated: boolean }}
 */
async function countIssueListItems(owner, repo, state, predicate, maxPages = 10) {
  const ctx = { owner, repo };
  let page = 1;
  const perPage = 100;
  let count = 0;
  let truncated = false;

  while (page <= maxPages) {
    const { data } = await ghGet(
      `${BASE}/repos/${owner}/${repo}/issues`,
      {
        params: {
          state,
          per_page: perPage,
          page,
          sort: 'created',
          direction: 'desc',
        },
      },
      ctx
    );
    if (!Array.isArray(data) || data.length === 0) break;
    count += data.filter(predicate).length;
    if (data.length < perPage) break;
    if (page === maxPages) {
      truncated = true;
      break;
    }
    page += 1;
  }

  return { count, truncated };
}

/**
 * Count pulls from GET /repos/{owner}/{repo}/pulls (merged = closed + merged_at set).
 * @param {'open'|'closed'} state
 * @param {boolean} mergedOnly only when state==='closed'
 */
async function countPullListItems(owner, repo, state, mergedOnly, maxPages = 10) {
  const ctx = { owner, repo };
  let page = 1;
  const perPage = 100;
  let count = 0;
  let truncated = false;

  while (page <= maxPages) {
    const { data } = await ghGet(
      `${BASE}/repos/${owner}/${repo}/pulls`,
      {
        params: {
          state,
          per_page: perPage,
          page,
          sort: 'updated',
          direction: 'desc',
        },
      },
      ctx
    );
    if (!Array.isArray(data) || data.length === 0) break;
    const batch = mergedOnly ? data.filter((p) => Boolean(p.merged_at)) : data;
    count += batch.length;
    if (data.length < perPage) break;
    if (page === maxPages) {
      truncated = true;
      break;
    }
    page += 1;
  }

  return { count, truncated };
}

/**
 * @param {object} item
 */
function isPureIssue(item) {
  return !item.pull_request;
}

/**
 * @param {string} owner
 * @param {string} repo
 */
async function getIssues(owner, repo) {
  const [openR, closedR] = await Promise.all([
    countIssueListItems(owner, repo, 'open', isPureIssue),
    countIssueListItems(owner, repo, 'closed', isPureIssue),
  ]);
  return {
    openIssues: openR.count,
    closedIssues: closedR.count,
    _issuesTruncated: openR.truncated || closedR.truncated,
  };
}

/**
 * Open + merged PR counts via Pulls API (avoids Search; merged uses merged_at on closed PRs).
 * @param {string} owner
 * @param {string} repo
 */
async function getPullRequests(owner, repo) {
  const isOpenPr = (item) => Boolean(item.pull_request);
  const [openR, mergedR] = await Promise.all([
    countIssueListItems(owner, repo, 'open', isOpenPr),
    countPullListItems(owner, repo, 'closed', true),
  ]);
  return {
    openPRs: openR.count,
    mergedPRs: mergedR.count,
    _prsTruncated: openR.truncated || mergedR.truncated,
  };
}

/**
 * @param {string} owner
 * @param {string} repo
 */
async function getContributors(owner, repo) {
  const ctx = { owner, repo };
  let page = 1;
  const perPage = 100;
  const maxPages = 20;
  const all = [];

  let truncated = false;
  while (page <= maxPages) {
    const { data } = await ghGet(
      `${BASE}/repos/${owner}/${repo}/contributors`,
      { params: { per_page: perPage, page, anon: 'false' } },
      ctx
    );
    if (!Array.isArray(data) || data.length === 0) break;
    all.push(...data);
    if (data.length < perPage) break;
    if (page === maxPages) {
      truncated = true;
      break;
    }
    page += 1;
  }

  return { contributors: all.length, contributorSample: all.slice(0, 5), _contributorsTruncated: truncated };
}

/**
 * @param {string} owner
 * @param {string} repo
 * @param {string} defaultBranch
 */
async function detectRepoStructure(owner, repo, defaultBranch) {
  const ctx = { owner, repo };

  const readmeRes = await ghGet(`${BASE}/repos/${owner}/${repo}/readme`, {}, ctx, {
    allow404: true,
  });
  const hasReadme = readmeRes !== null;

  const testPaths = [
    'test',
    'tests',
    '__tests__',
    'spec',
    'specs',
    '.github/workflows',
  ];

  const [pkgRes, ...checks] = await Promise.all([
    ghGet(
      `${BASE}/repos/${owner}/${repo}/contents/package.json`,
      { params: { ref: defaultBranch } },
      ctx,
      { allow404: true }
    ),
    ...testPaths.map((path) =>
      ghGet(
        `${BASE}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`,
        { params: { ref: defaultBranch } },
        ctx,
        { allow404: true }
      )
    ),
  ]);

  let hasTests = checks.some((res) => Boolean(res?.data));

  /** @param {string} n */
  const looksLikeTestFile = (n) =>
    /\.(test|spec)\.(m?js|m?ts|jsx|tsx|cjs|mjs)$/.test(n.toLowerCase());

  if (!hasTests && pkgRes?.data?.content && pkgRes.data.encoding === 'base64') {
    try {
      const raw = Buffer.from(pkgRes.data.content, 'base64').toString('utf8');
      const pkg = JSON.parse(raw);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
      if (deps && typeof deps === 'object') {
        const keys = Object.keys(deps).map((k) => k.toLowerCase());
        hasTests = ['jest', 'mocha', 'vitest'].some((name) => keys.includes(name));
      }
    } catch {
      /* ignore malformed package.json */
    }
  }

  if (!hasTests) {
    const rootRes = await ghGet(
      `${BASE}/repos/${owner}/${repo}/contents`,
      { params: { ref: defaultBranch } },
      ctx,
      { allow404: true }
    );
    const data = rootRes?.data;
    if (Array.isArray(data)) {
      const names = data.map((f) => (f.name || '').toLowerCase());
      hasTests = names.some(
        (n) =>
          n === 'test' ||
          n === 'tests' ||
          n.includes('test') ||
          n.includes('spec') ||
          looksLikeTestFile(n) ||
          n.endsWith('.test.ts') ||
          n.endsWith('.spec.ts') ||
          n === 'pytest.ini' ||
          n === 'jest.config.js' ||
          n === 'jest.config.cjs' ||
          n === 'vitest.config.ts' ||
          n === 'vitest.config.mts'
      );
    }
  }

  return { hasReadme, hasTests };
}

/**
 * @param {string|null|undefined} isoDate
 * @returns {number|null}
 */
function daysSince(isoDate) {
  if (!isoDate) return null;
  const t = new Date(isoDate).getTime();
  if (Number.isNaN(t)) return null;
  return Math.floor((Date.now() - t) / (1000 * 60 * 60 * 24));
}

/**
 * @param {string} owner
 * @param {string} repo
 * @param {{ bypassCache?: boolean }} [opts]
 */
async function aggregateRepoData(owner, repo, opts = {}) {
  const key = `${owner.toLowerCase()}/${repo.toLowerCase()}`;
  if (!opts.bypassCache) {
    const hit = aggregateCache.get(key);
    if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
      // eslint-disable-next-line no-console
      console.info(`[github.service] cache hit ${key}`);
      return hit.value;
    }
  }

  const meta = await getRepoMeta(owner, repo);

  const [freq, issues, prs, contributors, structure] = await Promise.all([
    getCommitFrequency(owner, repo),
    getIssues(owner, repo),
    getPullRequests(owner, repo),
    getContributors(owner, repo),
    detectRepoStructure(owner, repo, meta.defaultBranch),
  ]);

  const lastCommitDaysAgoRaw = daysSince(freq.lastCommitDate) ?? daysSince(meta.pushedAt);

  const normalized = {
    commitsPerWeek: freq.commitsPerWeek,
    openIssues: issues.openIssues,
    closedIssues: issues.closedIssues,
    openPRs: prs.openPRs,
    mergedPRs: prs.mergedPRs,
    contributors: contributors.contributors,
    lastCommitDaysAgo: lastCommitDaysAgoRaw ?? 9999,
    stars: meta.stars,
    forks: meta.forks,
    hasReadme: structure.hasReadme,
    hasTests: structure.hasTests,
    _collectionMeta: {
      issuesTruncated: Boolean(issues._issuesTruncated),
      prsTruncated: Boolean(prs._prsTruncated),
      lastCommitUnknown: lastCommitDaysAgoRaw == null,
      contributorsTruncated: Boolean(contributors._contributorsTruncated),
    },
  };

  aggregateCache.set(key, { at: Date.now(), value: normalized });
  return normalized;
}

module.exports = {
  getRepoMeta,
  getCommitFrequency,
  getIssues,
  getPullRequests,
  getContributors,
  detectRepoStructure,
  aggregateRepoData,
};
