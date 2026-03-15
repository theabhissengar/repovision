const { fetchRepoData } = require('../services/analyzeService');
const { analyzeRepo: runAiAnalysis } = require('../services/aiService');

function handleError(err, res, fallback) {
  const status = err.statusCode ?? 500;
  const message = err.statusCode ? err.message : fallback;
  console.error(err.message);
  return res.status(status).json({ error: message });
}

async function previewRepo(req, res) {
  const { repoUrl } = req.body;
  if (!repoUrl) return res.status(400).json({ error: 'repoUrl is required' });

  try {
    const data = await fetchRepoData(repoUrl);
    return res.status(200).json(data);
  } catch (err) {
    return handleError(err, res, 'Failed to fetch repository preview');
  }
}

async function analyzeRepo(req, res) {
  const { repoUrl } = req.body;
  if (!repoUrl) return res.status(400).json({ error: 'repoUrl is required' });

  try {
    const data = await fetchRepoData(repoUrl);
    const aiAnalysis = runAiAnalysis(data);
    return res.status(200).json({ ...data, aiAnalysis });
  } catch (err) {
    return handleError(err, res, 'Failed to analyze repository');
  }
}

module.exports = { previewRepo, analyzeRepo };
