import { motion } from 'framer-motion';
import ScoreGauge from '../charts/ScoreGauge';
import GlowBadge from '../ui/GlowBadge';

/**
 * Hero score card combining ScoreGauge + badge + summary.
 *
 * Props:
 *   score       number  0–10
 *   repoName    string
 *   summary     string  (AI-generated summary sentence)
 */

function scoreToColor(score) {
  if (score >= 8) return 'green';
  if (score >= 6) return 'blue';
  if (score >= 4) return 'amber';
  return 'rose';
}

function scoreToLabel(score) {
  if (score >= 8) return 'Excellent';
  if (score >= 6) return 'Good';
  if (score >= 4) return 'Fair';
  return 'Needs Work';
}

export default function RepoScoreCard({ score = 0, repoName, summary }) {
  const color = scoreToColor(score);
  const label = scoreToLabel(score);

  const glowColor = {
    green: 'rgba(52,211,153,0.1)',
    blue:  'rgba(74,158,255,0.1)',
    amber: 'rgba(251,191,36,0.1)',
    rose:  'rgba(248,113,113,0.1)',
  }[color];

  const borderColor = {
    green: 'rgba(52,211,153,0.2)',
    blue:  'rgba(74,158,255,0.2)',
    amber: 'rgba(251,191,36,0.2)',
    rose:  'rgba(248,113,113,0.2)',
  }[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 rounded-2xl border p-6 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, var(--rv-bg-2) 0%, var(--rv-bg-3) 100%)`,
        borderColor,
        boxShadow: `0 0 0 1px ${borderColor}, 0 8px 40px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 65%)` }}
      />

      {/* Gauge */}
      <div className="shrink-0">
        <ScoreGauge score={score} size="md" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-2 sm:pt-2">
        <div className="flex items-center gap-3 flex-wrap">
          <GlowBadge color={color} dot>
            {label}
          </GlowBadge>
          {repoName && (
            <span
              className="text-xs truncate"
              style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}
            >
              {repoName}
            </span>
          )}
        </div>

        <h2
          className="text-lg font-semibold leading-snug"
          style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-display)' }}
        >
          AI Repository Score
        </h2>

        {summary && (
          <p className="text-sm leading-relaxed line-clamp-3"
            style={{ color: 'var(--rv-text-2)', fontFamily: 'var(--rv-font-body)' }}>
            {summary}
          </p>
        )}
      </div>
    </motion.div>
  );
}
