const githubService = require('../services/github.service');
const scoringService = require('../services/scoring.service');
const aiService = require('../services/ai.service');

/**
 * @param {string} [value]
 */
function isValidSlug(value) {
  if (!value || typeof value !== 'string') return false;
  return /^[a-zA-Z0-9._-]{1,100}$/.test(value);
}

/**
 * Build compact signals for the model (no secrets).
 * @param {string} owner
 * @param {string} repo
 * @param {object} data
 */
function buildSignals(owner, repo, data) {
  return {
    repository: `${owner}/${repo}`,
    commitsPerWeek: data.commitsPerWeek,
    openIssues: data.openIssues,
    closedIssues: data.closedIssues,
    openPRs: data.openPRs,
    mergedPRs: data.mergedPRs,
    contributors: data.contributors,
    lastCommitDaysAgo: data.lastCommitDaysAgo,
    stars: data.stars,
    forks: data.forks,
    hasReadme: data.hasReadme,
    hasTests: data.hasTests,
  };
}

async function getRepoHealth(req, res) {
  const owner = req.query.owner;
  const repo = req.query.repo;

  if (!isValidSlug(owner) || !isValidSlug(repo)) {
    return res.status(400).json({
      error: 'Query params "owner" and "repo" are required (alphanumeric, dots, hyphens, underscores).',
    });
  }

  try {
    const aggregate = await githubService.aggregateRepoData(owner, repo);
    const { _collectionMeta, ...data } = aggregate;
    const scores = scoringService.generateScores(data);
    const derivedMetrics = scoringService.computeDerivedMetrics(data);
    const confidence = scoringService.computeConfidence(data, _collectionMeta);
    const overallStatus = scoringService.overallStatusFromScore(scores.overall);
    const signals = buildSignals(owner, repo, data);
    const report = await aiService.generateHealthReport({
      scores,
      signals,
      derivedMetrics,
      confidence,
    });

    return res.status(200).json({
      data,
      scores,
      confidence,
      overallStatus,
      report,
    });
  } catch (err) {
    const status = err.statusCode ?? 500;
    const message = err.statusCode ? err.message : 'Failed to build repository health report.';
    // eslint-disable-next-line no-console
    console.error('[repo.controller]', err.message);
    return res.status(status).json({ error: message });
  }
}

module.exports = { getRepoHealth };
