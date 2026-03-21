/**
 * @param {number} value
 * @param {number} [min]
 * @param {number} [max]
 * @returns {number}
 */
function clamp(value, min = 0, max = 100) {
  if (Number.isNaN(value) || !Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/**
 * Map linear segments: at x=minX score=minY, at x=maxX score=maxY (clamped).
 * @param {number} x
 * @param {number} minX
 * @param {number} maxX
 * @param {number} minY
 * @param {number} maxY
 */
function linearScore(x, minX, maxX, minY, maxY) {
  if (maxX === minX) return clamp(maxY);
  const t = (x - minX) / (maxX - minX);
  return clamp(minY + t * (maxY - minY));
}

/**
 * @param {number} n
 * @param {number} [base]
 */
function log1pNorm(n, base = 5) {
  return Math.log1p(Math.max(0, n)) / Math.log1p(base);
}

/**
 * log10(value + 1) / log10(max + 1), scaled to 0–100.
 * @param {number} value
 * @param {number} max reference ceiling (min 1)
 */
function log10NormalizedScore(value, max) {
  const v = Math.max(0, value);
  const m = Math.max(1, max);
  const ratio = Math.log10(v + 1) / Math.log10(m + 1);
  return clamp(ratio * 100);
}

module.exports = { clamp, linearScore, log1pNorm, log10NormalizedScore };
