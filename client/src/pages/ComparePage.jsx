import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApiErrorBanner from '../features/analyzer/components/ApiErrorBanner';
import ScoreGauge from '../components/charts/ScoreGauge';
import LanguageRadialChart from '../components/charts/LanguageRadialChart';
import GlowBadge from '../components/ui/GlowBadge';
import SurfacePanel from '../components/ui/SurfacePanel';
import { GradientDivider } from '../components/ui/GradientBorder';
import { staggerContainer, panelReveal } from '../design/animations';
import { repoService } from '../services/repoService';
import { isValidGithubUrl } from '../utils/validation';
import { formatNumber } from '../utils/formatters';

// ─── Icons ─────────────────────────────────────────────────────────────────

function BackIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );
}

function VsIcon() {
  return (
    <div
      className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border"
      style={{
        background: 'var(--rv-bg-3)',
        borderColor: 'var(--rv-border-2)',
        color: 'var(--rv-text-2)',
        fontFamily: 'var(--rv-font-mono)',
      }}
    >
      vs
    </div>
  );
}

// ─── Compact URL input ─────────────────────────────────────────────────────

function RepoInput({ label, value, onChange, error, disabled, index }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex-1 min-w-0">
      <label className="block text-xs uppercase tracking-widest mb-2"
        style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
        {label}
      </label>
      <div
        className="flex rounded-xl border overflow-hidden transition-all duration-200"
        style={{
          background: 'var(--rv-bg-2)',
          borderColor: error ? 'rgba(248,113,113,0.5)' : focused ? 'var(--rv-blue)' : 'var(--rv-border-1)',
          boxShadow: focused && !error ? '0 0 0 3px rgba(74,158,255,0.1)' : 'none',
        }}
      >
        <div
          className="flex items-center pl-3 shrink-0"
          style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)', fontSize: 12 }}
        >
          github.com/
        </div>
        <input
          type="text"
          value={value.replace(/^https?:\/\/github\.com\//i, '')}
          onChange={e => {
            const raw = e.target.value;
            const full = raw
              ? raw.startsWith('https://') ? raw : `https://github.com/${raw}`
              : '';
            onChange({ target: { value: full } });
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="owner/repo"
          disabled={disabled}
          className="flex-1 bg-transparent px-2.5 py-3 text-sm outline-none min-w-0"
          style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-mono)' }}
          spellCheck={false}
          autoComplete="off"
        />
      </div>
      {error && (
        <p className="text-xs mt-1.5" style={{ color: 'var(--rv-rose)', fontFamily: 'var(--rv-font-mono)' }}>
          ✗ {error}
        </p>
      )}
    </div>
  );
}

// ─── Empty state — compare form ────────────────────────────────────────────

function CompareForm({ onSuccess }) {
  const [url1, setUrl1] = useState('');
  const [url2, setUrl2] = useState('');
  const [errors, setErrors] = useState({ url1: '', url2: '' });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {
      url1: isValidGithubUrl(url1) ? '' : 'Enter a valid GitHub URL',
      url2: isValidGithubUrl(url2) ? '' : 'Enter a valid GitHub URL',
    };
    setErrors(newErrors);
    if (newErrors.url1 || newErrors.url2) return;

    // Normalize to owner/repo slug and prevent comparing the same repo
    const slug1 = url1
      .replace(/^https?:\/\/github\.com\//i, '')
      .replace(/\/+$/, '')
      .toLowerCase();
    const slug2 = url2
      .replace(/^https?:\/\/github\.com\//i, '')
      .replace(/\/+$/, '')
      .toLowerCase();

    if (slug1 && slug2 && slug1 === slug2) {
      setErrors({
        url1: '',
        url2: 'Choose two different repositories to compare.',
      });
      return;
    }

    setLoading(true);
    setApiError(null);
    try {
      const result = await repoService.compareRepos(url1, url2);
      onSuccess(result);
    } catch (err) {
      setApiError({ message: err.message, code: err.code });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-16">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <motion.div variants={panelReveal} className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border mb-6"
            style={{ background: 'var(--rv-bg-2)', borderColor: 'var(--rv-border-1)', fontFamily: 'var(--rv-font-mono)' }}
          >
            <span style={{ color: 'var(--rv-green)' }}>$</span>
            <span style={{ color: 'var(--rv-text-2)', fontSize: 13 }}>repovision compare</span>
            <span style={{ color: 'var(--rv-blue)', fontSize: 13 }}>&lt;repo1&gt;</span>
            <span style={{ color: 'var(--rv-text-3)', fontSize: 13 }}>vs</span>
            <span style={{ color: 'var(--rv-cyan)', fontSize: 13 }}>&lt;repo2&gt;</span>
            <span className="animate-blink" style={{ color: 'var(--rv-text-1)', fontSize: 13 }}>_</span>
          </div>
          <h1 className="text-2xl font-bold mb-2"
            style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-display)' }}>
            Compare Repositories
          </h1>
          <p className="text-sm" style={{ color: 'var(--rv-text-2)' }}>
            See how two repositories stack up against each other.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form variants={panelReveal} onSubmit={handleSubmit} className="space-y-5">
          {/* Split input row — stacks on mobile, side-by-side on sm+ */}
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <RepoInput
              label="Repository 1"
              value={url1}
              onChange={e => { setUrl1(e.target.value); setErrors(p => ({ ...p, url1: '' })); setApiError(null); }}
              error={errors.url1}
              disabled={loading}
            />
            <div className="sm:mt-7 self-center"><VsIcon /></div>
            <RepoInput
              label="Repository 2"
              value={url2}
              onChange={e => { setUrl2(e.target.value); setErrors(p => ({ ...p, url2: '' })); setApiError(null); }}
              error={errors.url2}
              disabled={loading}
            />
          </div>

          {apiError && <ApiErrorBanner message={apiError.message} code={apiError.code} onDismiss={() => setApiError(null)} />}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50"
            style={{
              background: loading ? 'var(--rv-bg-3)' : 'var(--rv-blue)',
              color: loading ? 'var(--rv-text-3)' : 'white',
              boxShadow: loading ? 'none' : '0 0 20px rgba(74,158,255,0.2)',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Comparing repositories…
              </span>
            ) : (
              'Compare Repositories'
            )}
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
}

// ─── Metric row item ───────────────────────────────────────────────────────

function CompareMetric({ label, v1, v2, format = 'number' }) {
  const n1 = typeof v1 === 'number' ? v1 : 0;
  const n2 = typeof v2 === 'number' ? v2 : 0;
  const winner = n1 > n2 ? 1 : n2 > n1 ? 2 : 0;

  const fmt = (v) => {
    if (typeof v !== 'number' && typeof v !== 'string') return '—';
    if (format === 'number') return formatNumber(v);
    return String(v);
  };

  return (
    <div className="grid grid-cols-3 gap-3 items-center py-2.5"
      style={{ borderBottom: '1px solid var(--rv-border-0)' }}>
      <div className={`text-sm tabular-nums font-bold text-right ${winner === 1 ? '' : ''}`}
        style={{
          color: winner === 1 ? 'var(--rv-green)' : 'var(--rv-text-1)',
          fontFamily: 'var(--rv-font-mono)',
        }}>
        {fmt(v1)}
        {winner === 1 && <span className="ml-1.5 text-xs">↑</span>}
      </div>
      <div className="text-center text-xs" style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
        {label}
      </div>
      <div className={`text-sm tabular-nums font-bold`}
        style={{
          color: winner === 2 ? 'var(--rv-green)' : 'var(--rv-text-1)',
          fontFamily: 'var(--rv-font-mono)',
        }}>
        {fmt(v2)}
        {winner === 2 && <span className="ml-1.5 text-xs">↑</span>}
      </div>
    </div>
  );
}

// ─── Repo column ───────────────────────────────────────────────────────────

function RepoColumn({ repo, accentColor }) {
  const analysis = repo.analysis ?? {};

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div
        className="rounded-xl border p-5"
        style={{
          background: 'var(--rv-bg-2)',
          borderColor: accentColor === 'blue' ? 'rgba(74,158,255,0.2)' : 'rgba(34,211,238,0.2)',
        }}
      >
        <GlowBadge color={accentColor} dot className="mb-3">
          {accentColor === 'blue' ? 'Repo 1' : 'Repo 2'}
        </GlowBadge>
        <h3 className="text-base font-bold mb-1"
          style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-mono)' }}>
          {repo.name}
        </h3>
        {repo.description && (
          <p className="text-xs leading-relaxed line-clamp-2"
            style={{ color: 'var(--rv-text-2)', fontFamily: 'var(--rv-font-body)' }}>
            {repo.description}
          </p>
        )}
        {repo.repoUrl && (
          <a href={repo.repoUrl} target="_blank" rel="noopener noreferrer"
            className="text-xs mt-2 inline-block transition-opacity hover:opacity-70"
            style={{ color: 'var(--rv-blue)' }}>
            View on GitHub ↗
          </a>
        )}
      </div>

      {/* Score */}
      {analysis.score !== undefined && (
        <SurfacePanel padding="md" className="flex flex-col items-center">
          <p className="text-xs uppercase tracking-widest mb-4 self-start"
            style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
            AI Score
          </p>
          <ScoreGauge score={analysis.score} size="sm" />
        </SurfacePanel>
      )}

      {/* Language chart */}
      {repo.languages && Object.keys(repo.languages).length > 0 && (
        <SurfacePanel padding="md">
          <p className="text-xs uppercase tracking-widest mb-4"
            style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
            Languages
          </p>
          <LanguageRadialChart languages={repo.languages} />
        </SurfacePanel>
      )}
    </div>
  );
}

// ─── Results view ──────────────────────────────────────────────────────────

function CompareResults({ result, onBack }) {
  const { repo1, repo2 } = result;

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="p-5 md:p-7 max-w-5xl mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div variants={panelReveal} className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm cursor-pointer transition-colors duration-150"
          style={{ color: 'var(--rv-text-3)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--rv-text-2)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--rv-text-3)'}
        >
          <BackIcon />
          New comparison
        </button>
        <GlowBadge color="green" dot>Comparison complete</GlowBadge>
      </motion.div>

      {/* Title */}
      <motion.div variants={panelReveal}>
        <h1 className="text-xl font-bold"
          style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-display)' }}>
          <span style={{ color: 'var(--rv-blue)' }}>{repo1.name?.split('/')[1] ?? repo1.name}</span>
          <span className="mx-2" style={{ color: 'var(--rv-text-3)' }}>vs</span>
          <span style={{ color: 'var(--rv-cyan)' }}>{repo2.name?.split('/')[1] ?? repo2.name}</span>
        </h1>
      </motion.div>

      {/* Stats comparison table */}
      <motion.div variants={panelReveal}>
        <SurfacePanel padding="md">
          <p className="text-xs uppercase tracking-widest mb-4"
            style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
            Head-to-head
          </p>
          <CompareMetric label="Stars"        v1={repo1.stars}        v2={repo2.stars} />
          <CompareMetric label="Forks"        v1={repo1.forks}        v2={repo2.forks} />
          <CompareMetric label="Open Issues"  v1={repo1.openIssues}   v2={repo2.openIssues} />
          <CompareMetric label="Language"     v1={repo1.language}     v2={repo2.language}   format="string" />
          {repo1.analysis?.score !== undefined && repo2.analysis?.score !== undefined && (
            <CompareMetric label="AI Score" v1={repo1.analysis.score} v2={repo2.analysis.score} />
          )}
        </SurfacePanel>
      </motion.div>

      {/* Split columns — single column on mobile, 2 columns on md+ */}
      <motion.div
        variants={panelReveal}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <RepoColumn repo={repo1} accentColor="blue" />
        <RepoColumn repo={repo2} accentColor="cyan" />
      </motion.div>

      <div className="h-8" />
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function ComparePage() {
  const [result, setResult] = useState(null);
  const [formKey, setFormKey] = useState(0);

  function handleBack() {
    setResult(null);
    setFormKey(k => k + 1); // force CompareForm to remount fresh (clears both inputs)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-(--rv-bg-0) text-(--rv-text-1)">
      <AnimatePresence mode="wait" initial={false}>
        {result ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <CompareResults result={result} onBack={handleBack} />
          </motion.div>
        ) : (
          <motion.div
            key={`form-${formKey}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <CompareForm onSuccess={setResult} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
