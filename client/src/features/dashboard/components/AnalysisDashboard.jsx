import { motion } from 'framer-motion';
import { useAnalysisResult } from '../hooks/useAnalysisResult';
import MetricBlock from '../../../components/insights/MetricBlock';
import RepoScoreCard from '../../../components/insights/RepoScoreCard';
import GlowBadge from '../../../components/ui/GlowBadge';
import SurfacePanel from '../../../components/ui/SurfacePanel';
import { staggerContainer, panelReveal } from '../../../design/animations';
import { formatNumber } from '../../../utils/formatters';

// ─── Icons ─────────────────────────────────────────────────────────────────

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function ForkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/>
      <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/><path d="M12 12v3"/>
    </svg>
  );
}

function IssueIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 1-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

// ─── Status labels ─────────────────────────────────────────────────────────

const STATUS = {
  pending:    { label: 'Queued',     color: 'gray' },
  processing: { label: 'Analyzing', color: 'blue' },
  done:       { label: 'Complete',  color: 'green' },
  failed:     { label: 'Failed',    color: 'rose' },
};

// ─── Loading state ─────────────────────────────────────────────────────────

function LoadingState({ status }) {
  const s = STATUS[status] ?? STATUS.pending;

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      <div className="relative">
        <div
          className="w-14 h-14 rounded-full border-2 animate-spin"
          style={{
            borderColor: 'var(--rv-border-2)',
            borderTopColor: 'var(--rv-blue)',
          }}
        />
        <div
          className="absolute inset-2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(74,158,255,0.1) 0%, transparent 70%)' }}
        />
      </div>
      <GlowBadge color={s.color} dot>{s.label}</GlowBadge>
      <p className="text-sm" style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
        This may take a few seconds…
      </p>
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function AnalysisDashboard({ jobId }) {
  const { data, status, error } = useAnalysisResult(jobId);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <GlowBadge color="rose">Error</GlowBadge>
        <p className="text-sm" style={{ color: 'var(--rv-rose)', fontFamily: 'var(--rv-font-mono)' }}>{error}</p>
      </div>
    );
  }

  if (status !== 'done') {
    return <LoadingState status={status} />;
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-5"
    >
      {/* Score */}
      <motion.div variants={panelReveal}>
        <RepoScoreCard
          score={data.score ?? 0}
          repoName={data.repoName}
          summary={data.summary}
        />
      </motion.div>

      {/* Metrics row */}
      <motion.div
        variants={panelReveal}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        <MetricBlock
          label="Stars"
          value={data.stars}
          icon={<StarIcon />}
          accent="amber"
        />
        <MetricBlock
          label="Forks"
          value={data.forks}
          icon={<ForkIcon />}
          accent="cyan"
        />
        <MetricBlock
          label="Open Issues"
          value={data.openIssues}
          icon={<IssueIcon />}
          accent="rose"
        />
        <MetricBlock
          label="Contributors"
          value={data.contributors}
          icon={<UsersIcon />}
          accent="green"
        />
      </motion.div>

      {/* AI Summary */}
      {data.summary && (
        <motion.div variants={panelReveal}>
          <SurfacePanel variant="default" padding="md">
            <p className="text-xs uppercase tracking-widest mb-3"
              style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
              AI Summary
            </p>
            <p className="text-sm leading-relaxed"
              style={{ color: 'var(--rv-text-2)', fontFamily: 'var(--rv-font-body)' }}>
              {data.summary}
            </p>
          </SurfacePanel>
        </motion.div>
      )}
    </motion.div>
  );
}
