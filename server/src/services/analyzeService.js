const axios = require('axios');

function parseGitHubUrl(repoUrl) {
  try {
    const url = new URL(repoUrl);
    const parts = url.pathname.replace(/^\//, '').replace(/\/$/, '').split('/');
    if (url.hostname !== 'github.com' || parts.length < 2) {
      return null;
    }
    return { owner: parts[0], repo: parts[1] };
  } catch {
    return null;
  }
}

const githubHeaders = () => ({
  Accept: 'application/vnd.github+json',
  ...(process.env.GITHUB_TOKEN && {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  }),
});

const GITHUB_NETWORK_CODES = new Set(['ENOTFOUND', 'ECONNREFUSED', 'ETIMEDOUT', 'ECONNRESET', 'ECONNABORTED']);

function handleGitHubError(err, owner, repo) {
  const status = err.response?.status;

  if (status === 404) {
    const e = new Error(`Repository "${owner}/${repo}" not found on GitHub`);
    e.statusCode = 404;
    throw e;
  }

  if (status === 403 || status === 429) {
    const e = new Error('GitHub API rate limit exceeded. Set GITHUB_TOKEN to increase the limit.');
    e.statusCode = 429;
    throw e;
  }

  if (status === 401) {
    const e = new Error('GitHub token is invalid or expired. Check the GITHUB_TOKEN environment variable.');
    e.statusCode = 500;
    throw e;
  }

  if (!err.response && GITHUB_NETWORK_CODES.has(err.code)) {
    const e = new Error('Could not reach the GitHub API. Check the server\'s internet connection.');
    e.statusCode = 503;
    throw e;
  }

  throw err;
}

async function fetchLanguages(owner, repo) {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      { headers: githubHeaders() }
    );
    const total = Object.values(data).reduce((sum, bytes) => sum + bytes, 0);
    if (total === 0) return {};
    return Object.fromEntries(
      Object.entries(data).map(([lang, bytes]) => [
        lang,
        Math.round((bytes / total) * 1000) / 10,
      ])
    );
  } catch {
    return {};
  }
}

async function fetchActivity(owner, repo) {
  try {
    const { data: commits } = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/commits`,
      { headers: githubHeaders(), params: { per_page: 30 } }
    );
    if (!Array.isArray(commits) || commits.length === 0) {
      return { commitsLast30Days: 0, lastCommitDate: null };
    }
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const commitsLast30Days = commits.filter((c) => {
      const date = new Date(c.commit?.author?.date ?? c.commit?.committer?.date);
      return date >= cutoff;
    }).length;
    const lastCommitDate = commits[0].commit?.author?.date
      ?? commits[0].commit?.committer?.date
      ?? null;
    return { commitsLast30Days, lastCommitDate };
  } catch {
    return { commitsLast30Days: 0, lastCommitDate: null };
  }
}

async function fetchRepoData(repoUrl) {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) {
    const err = new Error('Invalid GitHub URL. Expected format: https://github.com/owner/repo');
    err.statusCode = 400;
    throw err;
  }

  const { owner, repo } = parsed;

  let response;
  try {
    response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: githubHeaders(),
    });
  } catch (err) {
    handleGitHubError(err, owner, repo);
  }

  const data = response.data;
  const [languages, activity] = await Promise.all([
    fetchLanguages(owner, repo),
    fetchActivity(owner, repo),
  ]);

  return {
    repoUrl,
    name: data.full_name,
    description: data.description ?? null,
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    language: data.language ?? null,
    languages,
    activity,
    topics: data.topics ?? [],
    lastUpdated: data.updated_at,
  };
}

module.exports = { fetchRepoData };
