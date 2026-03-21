const axios = require('axios');

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * @param {number} score
 * @returns {'Poor' | 'Average' | 'Good'}
 */
function tierFromScore(score) {
  if (score >= 70) return 'Good';
  if (score >= 45) return 'Average';
  return 'Poor';
}

/**
 * @param {{
 *   maintenance: number,
 *   community: number,
 *   documentation: number,
 *   testing: number,
 *   popularity: number,
 *   overall: number
 * }} scores
 */
function buildFallbackReport(scores) {
  return buildDeterministicReport(scores, null, null);
}

/**
 * Deterministic report when AI is off or response is invalid.
 * @param {object} scores
 * @param {object|null} derivedMetrics
 * @param {number|null} confidence
 * @param {{ suggestionOverride?: string }} [opts]
 */
function buildDeterministicReport(scores, derivedMetrics, confidence, opts = {}) {
  const parts = [];
  if (derivedMetrics?.activityLevel) parts.push(`Activity: ${derivedMetrics.activityLevel}`);
  if (derivedMetrics?.maintenanceStatus) parts.push(`Maintenance: ${derivedMetrics.maintenanceStatus}`);
  if (confidence != null) parts.push(`Analysis confidence ~${confidence}%`);

  return {
    summary:
      parts.length > 0
        ? `Automated health view. ${parts.join('. ')}. Overall score ${Math.round(scores.overall)}/100.`
        : 'Narrative report unavailable (missing OPENAI_API_KEY or AI response could not be parsed). Numeric scores are still reliable.',
    health: {
      maintenance: tierFromScore(scores.maintenance),
      documentation: tierFromScore(scores.documentation),
      testing: tierFromScore(scores.testing),
      community: tierFromScore(scores.community),
      popularity: tierFromScore(scores.popularity),
    },
    insights: [
      `Overall computed health score is ${Math.round(scores.overall)}/100 based on GitHub signals.`,
      ...(derivedMetrics?.issueResolutionRate != null
        ? [`Issue resolution rate (closed / total issues): ~${Math.round(derivedMetrics.issueResolutionRate * 100)}%.`]
        : []),
      ...(derivedMetrics?.prMergeRate != null
        ? [`PR merge rate (merged / total PRs): ~${Math.round(derivedMetrics.prMergeRate * 100)}%.`]
        : []),
    ],
    suggestions: [
      opts.suggestionOverride
        ?? 'Set OPENAI_API_KEY in server/.env and restart the API (key must load from the server folder).',
    ],
  };
}

/**
 * @param {unknown} parsed
 * @returns {parsed is {
 *   summary: string,
 *   health: Record<string, string>,
 *   insights: string[],
 *   suggestions: string[]
 * }}
 */
function isStringArray(a) {
  return Array.isArray(a) && a.every((x) => typeof x === 'string');
}

function isValidReportShape(parsed) {
  if (!parsed || typeof parsed !== 'object') return false;
  const o = /** @type {Record<string, unknown>} */ (parsed);
  if (typeof o.summary !== 'string' || !o.summary.trim()) return false;
  if (!o.health || typeof o.health !== 'object') return false;
  if (!isStringArray(o.insights) || !isStringArray(o.suggestions)) return false;
  const h = /** @type {Record<string, unknown>} */ (o.health);
  const keys = ['maintenance', 'documentation', 'testing', 'community', 'popularity'];
  return keys.every((k) => typeof h[k] === 'string' && h[k].trim().length > 0);
}

/**
 * @param {string} text
 * @returns {unknown}
 */
function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * @param {{
 *   scores: object,
 *   signals: object,
 *   derivedMetrics: object,
 *   confidence: number
 * }} input
 */
async function generateHealthReport(input) {
  const {
    scores,
    signals,
    derivedMetrics = {},
    confidence = 80,
  } = input;
  const apiKey = typeof process.env.OPENAI_API_KEY === 'string'
    ? process.env.OPENAI_API_KEY.trim()
    : '';

  if (!apiKey) {
    // eslint-disable-next-line no-console
    console.info('[ai.service] OPENAI_API_KEY not set (empty or missing); using fallback report');
    return buildDeterministicReport(scores, derivedMetrics, confidence);
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const systemPrompt = `You are a senior software engineer writing a concise repository health report.
Reasoning: first infer maintenance/documentation/testing/community/popularity from the numeric scores and derived metrics; then write the summary and lists to match those conclusions.

You MUST respond with one JSON object only. No markdown, no prose outside JSON, no extra keys.

Schema (exact keys):
{
  "summary": string (2-4 sentences),
  "health": {
    "maintenance": "Poor" | "Average" | "Good",
    "documentation": "Poor" | "Average" | "Good",
    "testing": "Poor" | "Average" | "Good",
    "community": "Poor" | "Average" | "Good",
    "popularity": "Poor" | "Average" | "Good"
  },
  "insights": string[] (3-6 short bullet strings),
  "suggestions": string[] (3-6 actionable strings)
}

Rules:
- Numeric scores and derivedMetrics are authoritative; health labels must align (Good ≈ high score, Poor ≈ low).
- If confidence is low, acknowledge uncertainty briefly in 1 insight (still valid JSON strings only).
- insights and suggestions must be non-empty string arrays.`;

  const userPayload = JSON.stringify({ scores, signals, derivedMetrics, confidence });

  try {
    const { data } = await axios.post(
      OPENAI_URL,
      {
        model,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPayload },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60_000,
      }
    );

    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== 'string') {
      // eslint-disable-next-line no-console
      console.warn('[ai.service] Empty AI content; fallback');
      return buildDeterministicReport(scores, derivedMetrics, confidence, {
        suggestionOverride:
          'OpenAI returned an empty reply. Check OPENAI_MODEL and account limits in server logs.',
      });
    }

    const parsed = safeJsonParse(content);
    if (!isValidReportShape(parsed)) {
      // eslint-disable-next-line no-console
      console.warn('[ai.service] Invalid JSON shape from model; fallback');
      return buildDeterministicReport(scores, derivedMetrics, confidence, {
        suggestionOverride:
          'AI returned an unexpected format. Check server logs or try OPENAI_MODEL=gpt-4o-mini.',
      });
    }

    return parsed;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[ai.service] OpenAI request failed:', err.message);
    return buildDeterministicReport(scores, derivedMetrics, confidence, {
      suggestionOverride:
        'OpenAI request failed (invalid key, billing, or network). Verify OPENAI_API_KEY and check server logs.',
    });
  }
}

module.exports = { generateHealthReport, buildFallbackReport, buildDeterministicReport };
