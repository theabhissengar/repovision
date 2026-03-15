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
      headers: {
        Accept: 'application/vnd.github+json',
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
    });
  } catch (err) {
    if (err.response?.status === 404) {
      const notFound = new Error(`Repository "${owner}/${repo}" not found on GitHub`);
      notFound.statusCode = 404;
      throw notFound;
    }
    if (err.response?.status === 403) {
      const forbidden = new Error('GitHub API rate limit exceeded. Set GITHUB_TOKEN to increase the limit.');
      forbidden.statusCode = 429;
      throw forbidden;
    }
    throw err;
  }

  const data = response.data;

  return {
    repoUrl,
    name: data.full_name,
    description: data.description ?? null,
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    language: data.language ?? null,
    topics: data.topics ?? [],
    lastUpdated: data.updated_at,
  };
}

module.exports = { fetchRepoData };
