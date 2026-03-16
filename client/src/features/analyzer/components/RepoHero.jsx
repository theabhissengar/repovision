import { motion } from 'framer-motion';
import GlowBadge from '../../../components/ui/GlowBadge';
import { formatNumber, formatDate } from '../../../utils/formatters';
import { staggerContainer, panelReveal } from '../../../design/animations';

// GitHub Linguist language → colour mapping
const LANG_COLORS = {
  JavaScript:  '#f1e05a',
  TypeScript:  '#3178c6',
  Python:      '#3572a5',
  Rust:        '#dea584',
  Go:          '#00add8',
  Java:        '#b07219',
  'C#':        '#178600',
  'C++':       '#f34b7d',
  C:           '#555555',
  PHP:         '#4f5d95',
  Ruby:        '#701516',
  Swift:       '#f05138',
  Kotlin:      '#a97bff',
  Dart:        '#00b4ab',
  HTML:        '#e34c26',
  CSS:         '#563d7c',
  SCSS:        '#c6538c',
  Shell:       '#89e051',
  Bash:        '#89e051',
  Vue:         '#41b883',
  Svelte:      '#ff3e00',
  Scala:       '#c22d40',
  Elixir:      '#6e4a7e',
  Haskell:     '#5e5086',
  Lua:         '#000080',
  R:           '#198ce7',
};

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function ForkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/>
      <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/><path d="M12 12v3"/>
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}

export default function RepoHero({ data }) {
  const [owner, ...repoParts] = data.name.split('/');
  const repo = repoParts.join('/');
  const langColor = LANG_COLORS[data.language] ?? 'var(--rv-blue)';

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="relative overflow-hidden rounded-2xl border"
      style={{
        background: 'linear-gradient(135deg, var(--rv-bg-2) 0%, var(--rv-bg-3) 100%)',
        borderColor: 'var(--rv-border-1)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* Accent top line */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, var(--rv-blue), var(--rv-cyan), transparent)' }}
      />

      {/* Background glow */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-72 h-48 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 0% 0%, rgba(74,158,255,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative px-6 py-6 sm:px-8 sm:py-7">
        {/* Row 1: identity */}
        <motion.div
          variants={panelReveal}
          className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: 'rgba(74,158,255,0.1)',
                border: '1px solid rgba(74,158,255,0.2)',
                color: 'var(--rv-blue)',
              }}
            >
              <GitHubIcon />
            </div>
            <h1
              className="text-xl sm:text-2xl font-bold tracking-tight leading-tight min-w-0"
              style={{ fontFamily: 'var(--rv-font-mono)' }}
            >
              <span style={{ color: 'var(--rv-text-2)', fontWeight: 400 }}>{owner}</span>
              <span style={{ color: 'var(--rv-border-3)', margin: '0 4px' }}>/</span>
              <span style={{ color: 'var(--rv-text-1)' }}>{repo}</span>
            </h1>
          </div>

          <GlowBadge color="green" dot className="shrink-0 self-start">
            Analysis complete
          </GlowBadge>
        </motion.div>

        {/* Description */}
        {data.description && (
          <motion.p
            variants={panelReveal}
            className="text-sm leading-relaxed max-w-2xl mb-5"
            style={{ color: 'var(--rv-text-2)', fontFamily: 'var(--rv-font-body)' }}
          >
            {data.description}
          </motion.p>
        )}

        {/* Divider */}
        <motion.div
          variants={panelReveal}
          className="mb-4"
          style={{ height: 1, background: 'var(--rv-border-0)' }}
        />

        {/* Meta bar */}
        <motion.div
          variants={panelReveal}
          className="flex flex-wrap items-center justify-between gap-y-3 gap-x-5"
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {data.language && (
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: langColor }}
                />
                <span className="text-sm" style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-mono)' }}>
                  {data.language}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--rv-text-2)' }}>
              <span style={{ color: 'var(--rv-amber)' }}><StarIcon /></span>
              <span className="font-bold tabular-nums" style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-mono)' }}>
                {formatNumber(data.stars)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--rv-text-2)' }}>
              <span style={{ color: 'var(--rv-cyan)' }}><ForkIcon /></span>
              <span className="font-bold tabular-nums" style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-mono)' }}>
                {formatNumber(data.forks)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {data.lastUpdated && (
              <span className="text-xs" style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
                Updated {formatDate(data.lastUpdated)}
              </span>
            )}
            <a
              href={data.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: 'var(--rv-blue)' }}
            >
              View on GitHub
              <ExternalLinkIcon />
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
