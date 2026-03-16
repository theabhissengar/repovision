import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScoreGauge from '../components/charts/ScoreGauge';
import LanguageRadialChart from '../components/charts/LanguageRadialChart';
import { GradientDivider } from '../components/ui/GradientBorder';
import GlowBadge from '../components/ui/GlowBadge';
import { inViewReveal, staggerContainer, panelReveal } from '../design/animations';
import { isValidGithubUrl } from '../utils/validation';

// ─── Floating repo card mock ───────────────────────────────────────────────

function FloatingRepoCard({ delay, style, name, stars, lang, score }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="absolute rounded-xl border p-3 pointer-events-none select-none"
      style={{
        background: 'var(--rv-bg-2)',
        borderColor: 'var(--rv-border-1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(12px)',
        minWidth: 180,
        ...style,
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(74,158,255,0.1)' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--rv-blue)">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </div>
        <span className="text-xs font-semibold truncate" style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-mono)' }}>
          {name}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 mt-2">
        <span className="text-xs" style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
          ★ {stars}
        </span>
        <span className="text-xs" style={{ color: 'var(--rv-cyan)', fontFamily: 'var(--rv-font-mono)' }}>
          {lang}
        </span>
        <span
          className="text-xs font-bold"
          style={{
            color: score >= 8 ? 'var(--rv-green)' : 'var(--rv-blue)',
            fontFamily: 'var(--rv-font-mono)',
          }}
        >
          {score}/10
        </span>
      </div>
    </motion.div>
  );
}

// ─── Hero section ──────────────────────────────────────────────────────────

function HeroSection() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const fullUrl = input.startsWith('https://') || input.startsWith('http://')
      ? input
      : `https://github.com/${input}`;

    if (!isValidGithubUrl(fullUrl)) {
      setError('Enter a valid GitHub URL, e.g. vercel/next.js');
      return;
    }
    setError('');
    navigate('/analyze', { state: { prefillUrl: fullUrl } });
  }

  const EXAMPLE_REPOS = ['vercel/next.js', 'facebook/react', 'microsoft/vscode'];

  return (
    <section className="relative min-h-[88vh] flex flex-col items-center justify-center overflow-hidden px-6 py-20">
      {/* Dot grid bg */}
      <div className="absolute inset-0 dot-grid opacity-30" aria-hidden="true" />

      {/* Radial glow center */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(74,158,255,0.05) 0%, transparent 65%)' }}
      />

      {/* Floating cards (decorative) */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        <FloatingRepoCard
          delay={0.8} name="vercel/next.js" stars="120k" lang="TypeScript" score={9.2}
          style={{ top: '22%', left: '6%', transform: 'rotate(-3deg)', opacity: 0.7 }}
        />
        <FloatingRepoCard
          delay={1.0} name="facebook/react" stars="225k" lang="JavaScript" score={8.8}
          style={{ top: '18%', right: '5%', transform: 'rotate(2.5deg)', opacity: 0.6 }}
        />
        <FloatingRepoCard
          delay={1.2} name="torvalds/linux" stars="180k" lang="C" score={9.5}
          style={{ bottom: '24%', left: '4%', transform: 'rotate(2deg)', opacity: 0.5 }}
        />
        <FloatingRepoCard
          delay={1.4} name="rust-lang/rust" stars="95k" lang="Rust" score={9.1}
          style={{ bottom: '20%', right: '4%', transform: 'rotate(-2.5deg)', opacity: 0.55 }}
        />
      </div>

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative flex flex-col items-center text-center max-w-3xl w-full z-10"
      >
        {/* Badge */}
        <motion.div variants={panelReveal}>
          <GlowBadge color="blue" dot className="mb-8">
            AI-powered repository analysis
          </GlowBadge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={panelReveal}
          className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.08] tracking-tight mb-6"
          style={{ fontFamily: 'var(--rv-font-display)' }}
        >
          <span style={{ color: 'var(--rv-text-1)' }}>Analyze any</span>
          <br />
          <span className="text-gradient-blue">GitHub repo.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          variants={panelReveal}
          className="text-lg max-w-xl mb-10 leading-relaxed"
          style={{ color: 'var(--rv-text-2)', fontFamily: 'var(--rv-font-body)' }}
        >
          Instant AI insights — repository score, language distribution,
          commit activity, health indicators, and side-by-side comparisons.
        </motion.p>

        {/* Search input */}
        <motion.form
          variants={panelReveal}
          onSubmit={handleSubmit}
          className="w-full max-w-lg"
        >
          <div
            className="flex rounded-xl border overflow-hidden transition-all duration-200"
            style={{
              background: 'var(--rv-bg-2)',
              borderColor: error ? 'rgba(248,113,113,0.5)' : focused ? 'var(--rv-blue)' : 'var(--rv-border-2)',
              boxShadow: focused && !error ? '0 0 0 4px rgba(74,158,255,0.1)' : 'none',
            }}
          >
            <div
              className="flex items-center pl-4 shrink-0"
              style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)', fontSize: 13 }}
            >
              github.com/
            </div>
            <input
              type="text"
              value={input}
              onChange={e => { setInput(e.target.value); setError(''); }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="owner/repo"
              className="flex-1 bg-transparent px-3 py-4 text-sm outline-none"
              style={{
                color: 'var(--rv-text-1)',
                fontFamily: 'var(--rv-font-mono)',
              }}
              spellCheck={false}
              autoComplete="off"
            />
            <button
              type="submit"
              className="px-5 text-sm font-semibold transition-all duration-150 shrink-0 cursor-pointer"
              style={{
                background: 'var(--rv-blue)',
                color: 'white',
                borderLeft: '1px solid rgba(74,158,255,0.3)',
              }}
            >
              Analyze
            </button>
          </div>

          {error && (
            <p className="text-xs mt-2 text-left" style={{ color: 'var(--rv-rose)', fontFamily: 'var(--rv-font-mono)' }}>
              ✗ {error}
            </p>
          )}
        </motion.form>

        {/* Quick examples */}
        <motion.div
          variants={panelReveal}
          className="flex flex-wrap items-center justify-center gap-2 mt-5"
        >
          <span className="text-xs" style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
            try:
          </span>
          {EXAMPLE_REPOS.map(repo => (
            <button
              key={repo}
              type="button"
              onClick={() => {
                setInput(repo);
                setError('');
              }}
              className="text-xs px-2.5 py-1 rounded-lg border transition-all duration-150 cursor-pointer"
              style={{
                color: 'var(--rv-text-2)',
                borderColor: 'var(--rv-border-1)',
                background: 'var(--rv-bg-2)',
                fontFamily: 'var(--rv-font-mono)',
              }}
            >
              {repo}
            </button>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Features section ──────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    color: 'var(--rv-blue)',
    title: 'AI Repository Score',
    desc: 'Get a 0–10 quality score powered by AI analysis of code structure, documentation, activity, and community health.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    color: 'var(--rv-cyan)',
    title: 'Commit Activity',
    desc: 'Visualize commit patterns, track recent activity, and understand repository maintenance cadence over time.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3"/><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"/><path d="M12 20V4"/>
      </svg>
    ),
    color: 'var(--rv-green)',
    title: 'Side-by-side Comparison',
    desc: 'Compare two repositories head-to-head. See which scores higher, has more activity, or a healthier community.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
    color: 'var(--rv-purple)',
    title: 'Language Distribution',
    desc: 'See an accurate breakdown of programming languages used in any repository, rendered as an interactive radial chart.',
  },
];

function FeaturesSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div {...inViewReveal} className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
            Capabilities
          </p>
          <h2 className="text-3xl md:text-4xl font-bold"
            style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-display)' }}>
            Everything a developer needs
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-px"
          style={{ background: 'var(--rv-border-0)', border: '1px solid var(--rv-border-0)', borderRadius: 16, overflow: 'hidden' }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              {...inViewReveal}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
              className="p-7 group cursor-default transition-colors duration-150"
              style={{ background: 'var(--rv-bg-1)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--rv-bg-2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--rv-bg-1)'; }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${f.color}18`, color: f.color }}
              >
                {f.icon}
              </div>
              <h3 className="text-base font-semibold mb-2"
                style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-display)' }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed"
                style={{ color: 'var(--rv-text-2)', fontFamily: 'var(--rv-font-body)' }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Preview section ───────────────────────────────────────────────────────

const DEMO_LANGUAGES = {
  TypeScript: 68,
  JavaScript: 14,
  CSS: 9,
  HTML: 5,
  Shell: 4,
};

function PreviewSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <GradientDivider className="mb-20" />

        <motion.div {...inViewReveal} className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
            Live Example
          </p>
          <h2 className="text-3xl font-bold"
            style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-display)' }}>
            What you&apos;ll see
          </h2>
        </motion.div>

        <motion.div
          {...inViewReveal}
          className="grid md:grid-cols-2 gap-5"
        >
          {/* Score gauge */}
          <div
            className="rounded-2xl border p-6 flex flex-col items-center"
            style={{ background: 'var(--rv-bg-2)', borderColor: 'var(--rv-border-1)' }}
          >
            <p className="text-xs uppercase tracking-widest mb-5"
              style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
              AI Score
            </p>
            <ScoreGauge score={8.7} size="lg" />
            <p className="text-xs mt-5 text-center"
              style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
              vercel/next.js
            </p>
          </div>

          {/* Language chart */}
          <div
            className="rounded-2xl border p-6"
            style={{ background: 'var(--rv-bg-2)', borderColor: 'var(--rv-border-1)' }}
          >
            <p className="text-xs uppercase tracking-widest mb-5"
              style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
              Language Distribution
            </p>
            <LanguageRadialChart languages={DEMO_LANGUAGES} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── CTA section ───────────────────────────────────────────────────────────

function CtaSection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6">
      <motion.div
        {...inViewReveal}
        className="max-w-2xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-5"
          style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-display)' }}>
          Ready to analyze?
        </h2>
        <p className="text-base mb-8"
          style={{ color: 'var(--rv-text-2)', fontFamily: 'var(--rv-font-body)' }}>
          Paste any public GitHub repository URL and get instant AI insights.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('/analyze')}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer"
            style={{
              background: 'var(--rv-blue)',
              color: 'white',
              boxShadow: '0 0 24px rgba(74,158,255,0.25)',
            }}
          >
            Analyze a Repository
          </button>
          <button
            onClick={() => navigate('/compare')}
            className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer border"
            style={{
              color: 'var(--rv-text-2)',
              borderColor: 'var(--rv-border-2)',
              background: 'var(--rv-bg-2)',
            }}
          >
            Compare Two Repos
          </button>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <PreviewSection />
      <CtaSection />
    </div>
  );
}
