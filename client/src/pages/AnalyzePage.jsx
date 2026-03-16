import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import RepoForm from '../features/analyzer/components/RepoForm';
import RepoHero from '../features/analyzer/components/RepoHero';
import AiAnalysisCard from '../features/analyzer/components/AiAnalysisCard';
import MetricBlock from '../components/insights/MetricBlock';
import LanguageRadialChart from '../components/charts/LanguageRadialChart';
import ActivityTimeline from '../components/charts/ActivityTimeline';
import HealthIndicators from '../components/charts/HealthIndicators';
import GlowBadge from '../components/ui/GlowBadge';
import SurfacePanel from '../components/ui/SurfacePanel';
import { GradientDivider } from '../components/ui/GradientBorder';
import { staggerContainer, panelReveal, inViewReveal } from '../design/animations';
import { formatNumber } from '../utils/formatters';

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

function CodeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────

const EXAMPLE_REPOS = [
  'https://github.com/vercel/next.js',
  'https://github.com/facebook/react',
  'https://github.com/microsoft/vscode',
  'https://github.com/rust-lang/rust',
];

function EmptyState({ onSuccess, prefillUrl: initialPrefill }) {
  const [prefillUrl, setPrefillUrl] = useState(initialPrefill || '');

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-16">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="w-full max-w-lg"
      >
        {/* Terminal prompt */}
        <motion.div
          variants={panelReveal}
          className="mb-8 text-center"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border mb-6"
            style={{
              background: 'var(--rv-bg-2)',
              borderColor: 'var(--rv-border-1)',
              fontFamily: 'var(--rv-font-mono)',
            }}
          >
            <span style={{ color: 'var(--rv-green)' }}>$</span>
            <span style={{ color: 'var(--rv-text-2)', fontSize: 13 }}>
              repovision analyze
            </span>
            <span style={{ color: 'var(--rv-blue)', fontSize: 13 }}>
              &lt;repo-url&gt;
            </span>
            <span className="animate-blink" style={{ color: 'var(--rv-text-1)', fontSize: 13 }}>_</span>
          </div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-display)' }}
          >
            Analyze a Repository
          </h1>
          <p className="text-sm" style={{ color: 'var(--rv-text-2)' }}>
            Paste any public GitHub repository URL to get started.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div variants={panelReveal}>
          <RepoForm onSuccess={onSuccess} defaultUrl={prefillUrl} onUrlChange={setPrefillUrl} />
        </motion.div>

        {/* Example repos */}
        <motion.div variants={panelReveal} className="mt-8">
          <p className="text-xs uppercase tracking-widest mb-3 text-center"
            style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
            Or try an example
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {EXAMPLE_REPOS.map(url => {
              const slug = url.replace('https://github.com/', '');
              const isActive = prefillUrl === url;
              return (
                <button
                  key={url}
                  onClick={() =>
                    setPrefillUrl(current => (current === url ? '' : url))
                  }
                  className="text-left px-3 py-2.5 rounded-lg border text-xs transition-all duration-150 cursor-pointer"
                  style={{
                    color: isActive ? 'var(--rv-text-1)' : 'var(--rv-text-2)',
                    borderColor: isActive ? 'var(--rv-blue)' : 'var(--rv-border-1)',
                    background: isActive ? 'var(--rv-bg-3)' : 'var(--rv-bg-2)',
                    boxShadow: isActive ? '0 0 0 1px rgba(74,158,255,0.3)' : 'none',
                    fontFamily: 'var(--rv-font-mono)',
                  }}
                >
                  {slug}
                </button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Results ───────────────────────────────────────────────────────────────

function ResultsCanvas({ data, onBack }) {
  const activity = data.activityData ?? {};
  const analysis = data.analysis ?? {};

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="p-5 md:p-7 space-y-5 max-w-5xl mx-auto"
    >
      {/* Back + repo header */}
      <motion.div variants={panelReveal} className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm transition-colors duration-150 cursor-pointer"
          style={{ color: 'var(--rv-text-3)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--rv-text-2)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--rv-text-3)'}
        >
          <BackIcon />
          New analysis
        </button>
      </motion.div>

      {/* Repo hero */}
      <motion.div variants={panelReveal}>
        <RepoHero data={data} />
      </motion.div>

      {/* Metrics row */}
      <motion.div
        variants={panelReveal}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        <MetricBlock label="Open Issues"  value={data.openIssues}   icon={<IssueIcon />} accent="rose" />
        <MetricBlock label="Contributors" value={data.contributors} icon={<UsersIcon />} accent="green" />
        <MetricBlock label="Language"     value={data.language ?? '—'} icon={<CodeIcon />} accent="blue" animate={false} />
      </motion.div>

      {/* Charts row */}
      <motion.div
        variants={panelReveal}
        className="grid md:grid-cols-2 gap-5"
      >
        {/* Language chart */}
        {data.languages && Object.keys(data.languages).length > 0 && (
          <SurfacePanel padding="md">
            <p className="text-xs uppercase tracking-widest mb-4"
              style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
              Language Distribution
            </p>
            <LanguageRadialChart languages={data.languages} />
          </SurfacePanel>
        )}

        {/* Activity timeline */}
        <SurfacePanel padding="md">
          <p className="text-xs uppercase tracking-widest mb-4"
            style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
            Commit Activity
          </p>
          <ActivityTimeline
            commitsLast30Days={activity.commitsLast30Days ?? 0}
            lastCommitDate={activity.lastCommitDate ?? data.lastUpdated}
          />
        </SurfacePanel>
      </motion.div>

      {/* Health indicators */}
      <motion.div variants={panelReveal}>
        <SurfacePanel padding="md">
          <p className="text-xs uppercase tracking-widest mb-5"
            style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
            Repository Health
          </p>
          <HealthIndicators
            stars={data.stars}
            forks={data.forks}
            openIssues={data.openIssues}
            commitsLast30Days={activity.commitsLast30Days ?? 0}
            contributors={data.contributors ?? 0}
            updatedAt={data.lastUpdated}
          />
        </SurfacePanel>
      </motion.div>

      {/* AI Analysis */}
      {analysis.score !== undefined && (
        <motion.div variants={panelReveal}>
          <AiAnalysisCard analysis={analysis} />
        </motion.div>
      )}

      {/* Topics */}
      {data.topics?.length > 0 && (
        <motion.div variants={panelReveal}>
          <SurfacePanel padding="md">
            <p className="text-xs uppercase tracking-widest mb-3"
              style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
              Topics
            </p>
            <div className="flex flex-wrap gap-2">
              {data.topics.map(t => (
                <GlowBadge key={t} color="blue" size="sm">{t}</GlowBadge>
              ))}
            </div>
          </SurfacePanel>
        </motion.div>
      )}

      {/* Bottom spacer */}
      <div className="h-8" />
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function AnalyzePage() {
  const location = useLocation();
  const [data, setData] = useState(location.state?.data ?? null);
  const [formKey, setFormKey] = useState(0);
  const prefillUrl = location.state?.prefillUrl ?? '';

  function handleBack() {
    setData(null);
    setFormKey(k => k + 1); // force EmptyState + RepoForm to remount fresh (clears inputs)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-(--rv-bg-0) text-(--rv-text-1)">
      <AnimatePresence mode="wait" initial={false}>
        {data ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <ResultsCanvas data={data} onBack={handleBack} />
          </motion.div>
        ) : (
          <motion.div
            key={`empty-${formKey}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <EmptyState
              onSuccess={setData}
              prefillUrl={formKey === 0 ? prefillUrl : ''}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
