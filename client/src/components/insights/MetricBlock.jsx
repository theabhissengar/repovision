import { motion } from 'framer-motion';
import AnimatedNumber from '../ui/AnimatedNumber';

/**
 * Animated stat metric block.
 * Horizontal layout: icon-left, value+label-center, trend-right.
 *
 * Props:
 *   label      string
 *   value      number | string
 *   icon       ReactNode
 *   accent     'blue' | 'cyan' | 'green' | 'amber' | 'rose' | 'purple' | 'gray'
 *   trend      number   — positive = up, negative = down (optional)
 *   suffix     string   — appended to value (e.g. '%', 'MB')
 *   animate    bool     — animate number count-up (default: true, only for numbers)
 *   className  string
 */

const ACCENT = {
  blue:   { color: 'var(--rv-blue)',   bg: 'rgba(74,158,255,0.08)',  glow: 'rgba(74,158,255,0.2)' },
  cyan:   { color: 'var(--rv-cyan)',   bg: 'rgba(34,211,238,0.06)',  glow: 'rgba(34,211,238,0.18)' },
  green:  { color: 'var(--rv-green)',  bg: 'rgba(52,211,153,0.06)',  glow: 'rgba(52,211,153,0.18)' },
  amber:  { color: 'var(--rv-amber)',  bg: 'rgba(251,191,36,0.06)',  glow: 'rgba(251,191,36,0.18)' },
  rose:   { color: 'var(--rv-rose)',   bg: 'rgba(248,113,113,0.06)', glow: 'rgba(248,113,113,0.18)' },
  purple: { color: 'var(--rv-purple)', bg: 'rgba(167,139,250,0.06)', glow: 'rgba(167,139,250,0.18)' },
  gray:   { color: 'var(--rv-text-2)', bg: 'var(--rv-bg-3)',         glow: 'transparent' },
};

function TrendBadge({ trend }) {
  const up = trend > 0;
  const color = up ? 'var(--rv-green)' : 'var(--rv-rose)';
  const bg = up ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)';

  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ color, background: bg, fontFamily: 'var(--rv-font-mono)' }}
    >
      {up ? '↑' : '↓'}
      {Math.abs(trend).toFixed(1)}%
    </span>
  );
}

export default function MetricBlock({
  label,
  value,
  icon,
  accent = 'blue',
  trend,
  suffix = '',
  animate = true,
  className = '',
}) {
  const acc = ACCENT[accent] ?? ACCENT.gray;
  const isNumeric = typeof value === 'number';

  return (
    <motion.div
      whileHover={{
        y: -2,
        boxShadow: `0 0 0 1px ${acc.glow}, 0 8px 24px rgba(0,0,0,0.4)`,
        transition: { duration: 0.15 },
      }}
      className={`relative flex items-center gap-4 rounded-xl border px-4 py-4 sm:px-5 sm:py-4 overflow-hidden cursor-default min-w-[220px] ${className}`}
      style={{
        background: 'var(--rv-bg-2)',
        borderColor: 'var(--rv-border-1)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}
    >
      {/* Corner glow */}
      <div
        aria-hidden="true"
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${acc.glow} 0%, transparent 70%)` }}
      />

      {/* Icon */}
      {icon && (
        <div
          className="shrink-0 flex items-center justify-center rounded-xl w-10 h-10"
          style={{ background: acc.bg, color: acc.color }}
        >
          {icon}
        </div>
      )}

      {/* Label + Value */}
      <div className="flex flex-col flex-1 min-w-0">
        <p className="text-[0.65rem] sm:text-xs font-medium uppercase tracking-widest mb-1 leading-tight"
          style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)', letterSpacing: '0.1em' }}>
          {label}
        </p>
        <p className="text-2xl font-semibold leading-tight tabular-nums whitespace-nowrap overflow-hidden text-ellipsis"
          style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-display)' }}>
          {isNumeric && animate ? (
            <>
              <AnimatedNumber value={value} />
              {suffix}
            </>
          ) : (
            `${value}${suffix}`
          )}
        </p>
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <div className="shrink-0">
          <TrendBadge trend={trend} />
        </div>
      )}
    </motion.div>
  );
}
