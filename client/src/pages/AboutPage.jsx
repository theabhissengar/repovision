import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GradientDivider } from '../components/ui/GradientBorder';
import GlowBadge from '../components/ui/GlowBadge';
import { inViewReveal, staggerContainer, panelReveal } from '../design/animations';

// ─── Numbered step ─────────────────────────────────────────────────────────

function Step({ number, title, desc }) {
  return (
    <motion.div
      {...inViewReveal}
      transition={{ duration: 0.45, delay: number * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-6 items-start"
    >
      <span
        className="text-5xl font-bold shrink-0 leading-none select-none"
        style={{
          color: 'var(--rv-border-2)',
          fontFamily: 'var(--rv-font-mono)',
          lineHeight: 1,
        }}
      >
        {String(number).padStart(2, '0')}
      </span>
      <div>
        <h3 className="text-lg font-semibold mb-2"
          style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-display)' }}>
          {title}
        </h3>
        <p className="text-sm leading-relaxed"
          style={{ color: 'var(--rv-text-2)', fontFamily: 'var(--rv-font-body)' }}>
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Feature item ──────────────────────────────────────────────────────────

function FeatureItem({ icon, title, desc, color }) {
  return (
    <motion.div {...inViewReveal} className="flex gap-4 items-start">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: `${color}18`, color }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold mb-1"
          style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-body)' }}>
          {title}
        </p>
        <p className="text-sm leading-relaxed"
          style={{ color: 'var(--rv-text-2)', fontFamily: 'var(--rv-font-body)' }}>
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 space-y-20">

      {/* Hero text */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={panelReveal} className="mb-6">
          <GlowBadge color="cyan" dot>About RepoVision</GlowBadge>
        </motion.div>

        <motion.h1
          variants={panelReveal}
          className="text-4xl md:text-5xl font-bold leading-[1.1] mb-6"
          style={{ fontFamily: 'var(--rv-font-display)', color: 'var(--rv-text-1)' }}
        >
          Built for developers
          <br />
          <span className="text-gradient-blue">who care about quality.</span>
        </motion.h1>

        <motion.p
          variants={panelReveal}
          className="text-lg leading-relaxed"
          style={{ color: 'var(--rv-text-2)', fontFamily: 'var(--rv-font-body)' }}
        >
          RepoVision is an AI-powered GitHub repository analyzer. It combines
          real data from the GitHub API with machine learning to surface
          actionable insights about any public repository — instantly.
        </motion.p>
      </motion.section>

      <GradientDivider color="dim" />

      {/* Philosophy */}
      <section>
        <motion.div {...inViewReveal} className="mb-8">
          <p className="text-xs uppercase tracking-widest mb-3"
            style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
            Philosophy
          </p>
          <h2 className="text-2xl font-bold"
            style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-display)' }}>
            Clarity over complexity
          </h2>
        </motion.div>

        <motion.p {...inViewReveal} className="text-base leading-relaxed mb-5"
          style={{ color: 'var(--rv-text-2)', fontFamily: 'var(--rv-font-body)' }}>
          Most developer tools throw data at you. We distill that data into
          a single score, a handful of strengths, and concrete improvements.
          No jargon. No noise. Just the signal.
        </motion.p>
        <motion.p {...inViewReveal} className="text-base leading-relaxed"
          style={{ color: 'var(--rv-text-2)', fontFamily: 'var(--rv-font-body)' }}>
          Whether you&apos;re evaluating a dependency, researching a project, or
          measuring the health of your own repository — RepoVision gives you
          a developer-grade view in seconds.
        </motion.p>
      </section>

      <GradientDivider color="dim" />

      {/* Features */}
      <section>
        <motion.div {...inViewReveal} className="mb-8">
          <p className="text-xs uppercase tracking-widest mb-3"
            style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
            Capabilities
          </p>
          <h2 className="text-2xl font-bold"
            style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-display)' }}>
            What RepoVision measures
          </h2>
        </motion.div>

        <div className="space-y-7">
          <FeatureItem
            color="var(--rv-blue)"
            title="AI Repository Score (0–10)"
            desc="A composite quality score derived from code structure, documentation coverage, commit frequency, community size, and issue management."
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            }
          />
          <FeatureItem
            color="var(--rv-cyan)"
            title="Language Distribution"
            desc="Precise breakdown of programming languages weighted by bytes of code, rendered as an interactive radial bar chart."
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
              </svg>
            }
          />
          <FeatureItem
            color="var(--rv-green)"
            title="Commit Activity"
            desc="30-day commit frequency chart showing maintenance cadence and development momentum over time."
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            }
          />
          <FeatureItem
            color="var(--rv-purple)"
            title="Repository Health Indicators"
            desc="Four derived health scores: Activity, Popularity, Maintenance, and Community — each scored 0–100 based on real data."
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            }
          />
          <FeatureItem
            color="var(--rv-amber)"
            title="Side-by-side Comparison"
            desc="Compare any two public repositories head-to-head: stars, forks, issues, language, AI score, and full language breakdown."
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3"/><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"/><path d="M12 20V4"/>
              </svg>
            }
          />
        </div>
      </section>

      <GradientDivider color="dim" />

      {/* How it works */}
      <section>
        <motion.div {...inViewReveal} className="mb-10">
          <p className="text-xs uppercase tracking-widest mb-3"
            style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
            How it works
          </p>
          <h2 className="text-2xl font-bold"
            style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-display)' }}>
            From URL to insight in seconds
          </h2>
        </motion.div>

        <div className="space-y-10">
          <Step
            number={1}
            title="Enter a GitHub repository URL"
            desc="Paste any public GitHub repository URL into the analyzer. RepoVision validates and normalizes the URL before processing."
          />
          <Step
            number={2}
            title="GitHub API fetches real data"
            desc="The Node.js backend queries the GitHub REST API for repository metadata, language breakdown, commit history, and contributor data."
          />
          <Step
            number={3}
            title="AI generates a quality score"
            desc="A language model evaluates the raw data and produces a 0–10 score along with specific strengths and improvement suggestions."
          />
          <Step
            number={4}
            title="Results render instantly"
            desc="Charts, health indicators, and insights render in your browser with smooth animations. No page reload, no waiting."
          />
        </div>
      </section>

      <GradientDivider color="dim" />

      {/* CTA */}
      <motion.section {...inViewReveal} className="text-center py-6">
        <h2 className="text-2xl font-bold mb-3"
          style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-display)' }}>
          Try it now
        </h2>
        <p className="text-sm mb-7" style={{ color: 'var(--rv-text-2)' }}>
          Any public GitHub repository, analyzed in under 5 seconds.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/analyze"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
            style={{
              background: 'var(--rv-blue)',
              color: 'white',
              boxShadow: '0 0 20px rgba(74,158,255,0.2)',
            }}
          >
            Analyze a Repository
          </Link>
          <Link
            to="/compare"
            className="px-6 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150"
            style={{
              color: 'var(--rv-text-2)',
              borderColor: 'var(--rv-border-2)',
              background: 'var(--rv-bg-2)',
            }}
          >
            Compare Repos
          </Link>
        </div>
      </motion.section>

    </div>
  );
}
