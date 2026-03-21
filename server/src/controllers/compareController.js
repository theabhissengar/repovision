const { fetchRepoData } = require('../services/analyzeService');

function handleError(err, res, fallback) {
  const status = err.statusCode ?? 500;
  const message = err.statusCode ? err.message : fallback;
  console.error(err.message);
  return res.status(status).json({ error: message });
}

async function compareRepos(req, res) {
  const { repo1, repo2 } = req.body;

  if (!repo1 || !repo2) {
    return res.status(400).json({ error: 'repo1 and repo2 are required' });
  }

  try {
    const [repo1Data, repo2Data] = await Promise.all([
      fetchRepoData(repo1),
      fetchRepoData(repo2),
    ]);

    return res.status(200).json({ repo1: repo1Data, repo2: repo2Data });
  } catch (err) {
    return handleError(err, res, 'Failed to compare repositories');
  }
}

module.exports = { compareRepos };
