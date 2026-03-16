import { motion } from 'framer-motion';
import Badge from '../../../components/ui/Badge';
import { formatNumber, formatDate } from '../../../utils/formatters';

// GitHub Linguist language → colour mapping (most common languages)
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

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function ForkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/>
      <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/>
      <path d="M12 12v3"/>
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}

// ─── Animation variants ────────────────────────────────────────────────────────

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] } },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function RepoHero({ data }) {
  const [owner, ...repoParts] = data.name.split('/');
  const repo = repoParts.join('/');
  const langColor = LANG_COLORS[data.language] ?? '#8b5cf6';

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden bg-card border border-border rounded-2xl"
    >
      {/* ── Accent top bar ── */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-primary via-accent to-transparent"
      />

      {/* ── Background gradient ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-br from-primary/6 via-transparent to-transparent pointer-events-none"
      />

      <div className="relative px-6 py-7 sm:px-8 sm:py-8">

        {/* ── Row 1: repo identity + status badge ── */}
        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4"
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* GitHub icon badge */}
            <div className="w-10 h-10 rounded-xl bg-foreground/6 border border-border
              flex items-center justify-center shrink-0 text-foreground">
              <GitHubIcon />
            </div>

            {/* owner / repo in monospace */}
            <h1 className="font-mono text-xl sm:text-2xl font-bold tracking-tight leading-tight min-w-0">
              <span className="text-muted-foreground font-normal">{owner}</span>
              <span className="text-border-strong mx-1">/</span>
              <span className="text-foreground">{repo}</span>
            </h1>
          </div>

          <div className="shrink-0 self-start">
            <Badge color="green">Analysis Complete</Badge>
          </div>
        </motion.div>

        {/* ── Row 2: description ── */}
        {data.description && (
          <motion.p
            variants={item}
            className="text-muted-foreground leading-relaxed max-w-2xl text-[15px] mb-6"
          >
            {data.description}
          </motion.p>
        )}

        {/* ── Divider ── */}
        <motion.div variants={item} className="border-t border-border mb-5" />

        {/* ── Row 3: meta bar ── */}
        <motion.div
          variants={item}
          className="flex flex-wrap items-center justify-between gap-y-3 gap-x-4"
        >
          {/* Left cluster — language · stars · forks */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">

            {data.language && (
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full ring-1 ring-black/10 dark:ring-white/10 shrink-0"
                  style={{ backgroundColor: langColor }}
                />
                <span className="text-sm font-medium text-foreground">{data.language}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <StarIcon />
              <span className="font-semibold text-foreground tabular-nums">
                {formatNumber(data.stars)}
              </span>
              <span>stars</span>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <ForkIcon />
              <span className="font-semibold text-foreground tabular-nums">
                {formatNumber(data.forks)}
              </span>
              <span>forks</span>
            </div>
          </div>

          {/* Right cluster — updated date · GitHub link */}
          <div className="flex items-center gap-5">
            {data.lastUpdated && (
              <span className="text-xs text-muted-foreground tabular-nums">
                Updated {formatDate(data.lastUpdated)}
              </span>
            )}

            <a
              href={data.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium
                text-primary hover:text-primary/70 transition-colors"
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
