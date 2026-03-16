// ─── Icons (Lucide-style, stroke-based) ───────────────────────────────────────

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function GitForkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/>
      <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/>
      <path d="M12 12v3"/>
    </svg>
  );
}

function CircleDotIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 1-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function TrendUpIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  );
}

function TrendDownIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
      <polyline points="17 18 23 18 23 12"/>
    </svg>
  );
}

// ─── Variant config ────────────────────────────────────────────────────────────
//  color      → used for the radial gradient glow (hex for inline style)
//  iconBg     → icon badge background
//  iconText   → icon badge foreground

const VARIANTS = {
  stars: {
    Icon: StarIcon,
    color: '#f59e0b',
    iconBg:   'bg-amber-500/10',
    iconText: 'text-amber-500',
  },
  forks: {
    Icon: GitForkIcon,
    color: '#8b5cf6',
    iconBg:   'bg-primary/10',
    iconText: 'text-primary',
  },
  issues: {
    Icon: CircleDotIcon,
    color: '#f43f5e',
    iconBg:   'bg-rose-500/10',
    iconText: 'text-rose-500 dark:text-rose-400',
  },
  language: {
    Icon: CodeIcon,
    color: '#38bdf8',
    iconBg:   'bg-accent/10',
    iconText: 'text-accent',
  },
  contributors: {
    Icon: UsersIcon,
    color: '#10b981',
    iconBg:   'bg-emerald-500/10',
    iconText: 'text-emerald-500 dark:text-emerald-400',
  },
};

const FALLBACK_VARIANT = {
  Icon: null,
  color: '#8b5cf6',
  iconBg:   'bg-primary/10',
  iconText: 'text-primary',
};

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * @param {{
 *   label:    string
 *   value:    string | number
 *   variant?: keyof VARIANTS
 *   icon?:    string        emoji fallback when no variant
 *   trend?:   number        positive = up, negative = down
 * }} props
 */
export default function StatCard({ label, value, variant, icon, trend }) {
  const { Icon, color, iconBg, iconText } = VARIANTS[variant] ?? FALLBACK_VARIANT;

  const hasTrend   = trend !== undefined && trend !== null;
  const trendUp    = hasTrend && trend > 0;
  const trendDown  = hasTrend && trend < 0;

  return (
    <div className="relative overflow-hidden bg-card border border-border rounded-xl p-5
      group cursor-default
      transition-all duration-200 ease-out
      hover:-translate-y-0.5 hover:border-border-strong
      hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]">

      {/* ── Radial gradient glow at top-right corner ── */}
      <div
        aria-hidden="true"
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none
          opacity-50 group-hover:opacity-90 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle, ${color}28 0%, transparent 68%)` }}
      />

      {/* ── Icon badge ── */}
      <div className={`relative inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4
        ${iconBg} ${iconText}
        transition-transform duration-200 group-hover:scale-110`}>
        {Icon
          ? <Icon />
          : <span className="text-xl leading-none">{icon}</span>
        }
      </div>

      {/* ── Label ── */}
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 truncate">
        {label}
      </p>

      {/* ── Value ── */}
      <p className="text-2xl font-bold text-foreground tracking-tight tabular-nums leading-none">
        {value ?? '—'}
      </p>

      {/* ── Trend indicator (optional) ── */}
      {hasTrend && (
        <div className="flex items-center gap-1.5 mt-3">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold
            px-1.5 py-0.5 rounded-full
            ${trendUp
              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
              : trendDown
                ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400'
                : 'bg-muted text-muted-foreground'
            }`}>
            {trendUp ? <TrendUpIcon /> : trendDown ? <TrendDownIcon /> : '→'}
            {Math.abs(trend).toFixed(1)}%
          </span>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      )}
    </div>
  );
}
