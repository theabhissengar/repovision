import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ScoreGauge from '../../../components/charts/ScoreGauge';
import GlowBadge from '../../../components/ui/GlowBadge';
import SurfacePanel from '../../../components/ui/SurfacePanel';

function statusToBadgeColor(status) {
  if (!status) return 'blue';
  const s = String(status).toLowerCase();
  if (s.includes('excellent')) return 'green';
  if (s.includes('healthy')) return 'blue';
  if (s.includes('moderate')) return 'amber';
  if (s.includes('risk')) return 'rose';
  return 'blue';
}

/**
 * AI health headline: score /100, overall status, summary.
 */
export default function RepoHealthPanel({
  scores,
  report,
  overallStatus,
  confidence,
  loading,
  error,
  repoName,
}) {
  const overall = scores?.overall;
  const gaugeScore = typeof overall === 'number' ? Math.min(10, Math.max(0, overall / 10)) : 0;
  const summary = report?.summary;

  if (error) {
    return (
      <SurfacePanel padding="md">
        <p className="text-sm" style={{ color: 'var(--rv-amber)', fontFamily: 'var(--rv-font-body)' }}>
          Unable to generate AI insights
        </p>
      </SurfacePanel>
    );
  }

  if (loading) {
    return (
      <SurfacePanel padding="md">
        <p
          className="text-xs uppercase tracking-widest mb-4"
          style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}
        >
          Generating AI insights…
        </p>
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <Skeleton width={160} height={120} baseColor="var(--rv-bg-3)" highlightColor="var(--rv-border-2)" />
          <div className="flex-1 w-full space-y-3">
            <Skeleton height={24} width="40%" baseColor="var(--rv-bg-3)" highlightColor="var(--rv-border-2)" />
            <Skeleton count={3} baseColor="var(--rv-bg-3)" highlightColor="var(--rv-border-2)" />
          </div>
        </div>
      </SurfacePanel>
    );
  }

  if (overall == null || !report) {
    return null;
  }

  const badgeColor = statusToBadgeColor(overallStatus);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SurfacePanel padding="md">
        <p
          className="text-xs uppercase tracking-widest mb-4"
          style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}
        >
          AI health overview
        </p>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="shrink-0 flex flex-col items-center gap-1">
            <ScoreGauge score={gaugeScore} size="md" />
            <span
              className="text-[10px] uppercase tracking-wider tabular-nums"
              style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}
            >
              {Math.round(overall)}/100
            </span>
          </div>
          <div className="flex-1 min-w-0 space-y-3 sm:pt-1">
            <div className="flex flex-wrap items-center gap-2">
              {overallStatus && (
                <GlowBadge color={badgeColor} dot>
                  {overallStatus}
                </GlowBadge>
              )}
              {repoName && (
                <span
                  className="text-xs truncate"
                  style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}
                >
                  {repoName}
                </span>
              )}
            </div>
            {confidence != null && (
              <p className="text-xs tabular-nums" style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
                Confidence ~{Math.round(confidence)}%
              </p>
            )}
            {summary && (
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--rv-text-2)', fontFamily: 'var(--rv-font-body)' }}
              >
                {summary}
              </p>
            )}
          </div>
        </div>
      </SurfacePanel>
    </motion.div>
  );
}
