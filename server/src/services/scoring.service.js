const { clamp, linearScore, log1pNorm, log10NormalizedScore } = require('../utils/scoring.utils');

/** Reference ceilings for popularity log scaling */
const STAR_SCALE_MAX = 50_000;
const FORK_SCALE_MAX = 10_000;

/** @type {Record<string, number>} */
const DEFAULT_WEIGHTS = {
  maintenance: 0.28,
  community: 0.22,
  documentation: 0.12,
  testing: 0.13,
  popularity: 0.25,
};

/**
 * @param {{ commitsPerWeek: number, lastCommitDaysAgo: number, openIssues: number, closedIssues: number }} d
 */
function scoreMaintenanceFromSignals(d) {
  const commitScore = linearScore(d.commitsPerWeek, 0, 14, 15, 100);
  const recencyScore = linearScore(d.lastCommitDaysAgo, 0, 365, 100, 5);
  const totalIssues = d.openIssues + d.closedIssues;
  const resolution =
    totalIssues === 0 ? 70 : clamp((d.closedIssues / totalIssues) * 100);
  return clamp((commitScore * 0.4 + recencyScore * 0.35 + resolution * 0.25));
}

/**
 * @param {{ contributors: number, openPRs: number, mergedPRs: number }} d
 */
function scoreCommunityFromSignals(d) {
  const contribScore = clamp(log1pNorm(d.contributors, 40) * 100);
  const prTotal = d.openPRs + d.mergedPRs;
  const mergeRatio = prTotal === 0 ? 55 : clamp((d.mergedPRs / prTotal) * 100);
  return clamp(contribScore * 0.55 + mergeRatio * 0.45);
}

/**
 * @param {{ hasReadme: boolean }} d
 */
function scoreDocumentationFromSignals(d) {
  return d.hasReadme ? 92 : 28;
}

/**
 * @param {{ hasTests: boolean }} d
 */
function scoreTestingFromSignals(d) {
  return d.hasTests ? 88 : 22;
}

/**
 * @param {{ stars: number, forks: number }} d
 */
function scorePopularityFromSignals(d) {
  const starPart = log10NormalizedScore(d.stars, STAR_SCALE_MAX);
  const forkPart = log10NormalizedScore(d.forks, FORK_SCALE_MAX);
  return clamp(starPart * 0.65 + forkPart * 0.35);
}

/**
 * @param {typeof DEFAULT_WEIGHTS} weights
 */
function normalizeWeights(weights) {
  const entries = Object.entries(weights).filter(([, v]) => typeof v === 'number' && v > 0);
  const sum = entries.reduce((s, [, v]) => s + v, 0);
  if (sum <= 0) return { ...DEFAULT_WEIGHTS };
  return Object.fromEntries(entries.map(([k, v]) => [k, v / sum]));
}

/**
 * Normalized repo metrics -> 0–100 dimension scores + overall.
 * @param {{
 *   commitsPerWeek: number,
 *   lastCommitDaysAgo: number,
 *   openIssues: number,
 *   closedIssues: number,
 *   openPRs: number,
 *   mergedPRs: number,
 *   contributors: number,
 *   stars: number,
 *   forks: number,
 *   hasReadme: boolean,
 *   hasTests: boolean
 * }} repoData
 * @param {{ weights?: Partial<typeof DEFAULT_WEIGHTS> }} [options]
 */
function generateScores(repoData, options = {}) {
  const weights = normalizeWeights({ ...DEFAULT_WEIGHTS, ...options.weights });

  const maintenance = scoreMaintenanceFromSignals(repoData);
  const community = scoreCommunityFromSignals(repoData);
  const documentation = scoreDocumentationFromSignals(repoData);
  const testing = scoreTestingFromSignals(repoData);
  const popularity = scorePopularityFromSignals(repoData);

  const overall = clamp(
    maintenance * weights.maintenance +
      community * weights.community +
      documentation * weights.documentation +
      testing * weights.testing +
      popularity * weights.popularity
  );

  return {
    maintenance: Math.round(maintenance),
    community: Math.round(community),
    documentation: Math.round(documentation),
    testing: Math.round(testing),
    popularity: Math.round(popularity),
    overall: Math.round(overall),
  };
}

/**
 * @param {{
 *   openIssues: number,
 *   closedIssues: number,
 *   openPRs: number,
 *   mergedPRs: number,
 *   commitsPerWeek: number,
 *   lastCommitDaysAgo: number
 * }} repoData
 */
function computeDerivedMetrics(repoData) {
  const totalIssues = repoData.openIssues + repoData.closedIssues;
  const issueResolutionRate =
    totalIssues === 0 ? null : Math.round((repoData.closedIssues / totalIssues) * 1000) / 1000;

  const totalPRs = repoData.openPRs + repoData.mergedPRs;
  const prMergeRate =
    totalPRs === 0 ? null : Math.round((repoData.mergedPRs / totalPRs) * 1000) / 1000;

  let activityLevel = 'low';
  if (repoData.commitsPerWeek >= 10) activityLevel = 'high';
  else if (repoData.commitsPerWeek >= 3) activityLevel = 'medium';

  let maintenanceStatus = 'stale';
  if (repoData.lastCommitDaysAgo <= 30) maintenanceStatus = 'active';
  else if (repoData.lastCommitDaysAgo <= 180) maintenanceStatus = 'declining';

  return {
    issueResolutionRate,
    prMergeRate,
    activityLevel,
    maintenanceStatus,
  };
}

/**
 * @param {{
 *   issuesTruncated?: boolean,
 *   prsTruncated?: boolean,
 *   lastCommitUnknown?: boolean,
 *   contributorsTruncated?: boolean
 * }} collectionMeta
 */
function computeConfidence(repoData, collectionMeta = {}) {
  let c = 95;
  if (collectionMeta.lastCommitUnknown) c -= 12;
  if (collectionMeta.issuesTruncated) c -= 18;
  if (collectionMeta.prsTruncated) c -= 14;
  if (collectionMeta.contributorsTruncated) c -= 8;
  if (repoData.lastCommitDaysAgo >= 9000) c -= 10;
  return clamp(Math.round(c), 0, 100);
}

/**
 * @param {number} overall
 * @returns {'Excellent' | 'Healthy' | 'Moderate' | 'At Risk'}
 */
function overallStatusFromScore(overall) {
  if (overall >= 80) return 'Excellent';
  if (overall >= 60) return 'Healthy';
  if (overall >= 40) return 'Moderate';
  return 'At Risk';
}

module.exports = {
  generateScores,
  DEFAULT_WEIGHTS,
  computeDerivedMetrics,
  computeConfidence,
  overallStatusFromScore,
};
