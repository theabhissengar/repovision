/**
 * Pill badge with neon border + soft glow background.
 *
 * Props:
 *   color   'blue' | 'green' | 'amber' | 'rose' | 'cyan' | 'purple' | 'gray'
 *   size    'sm' | 'md'
 *   dot     bool  → shows a small filled dot before label
 *   className string
 *   children
 */

const COLORS = {
  blue: {
    bg:     'rgba(74, 158, 255, 0.1)',
    border: 'rgba(74, 158, 255, 0.3)',
    text:   'var(--rv-blue)',
    dot:    'var(--rv-blue)',
  },
  cyan: {
    bg:     'rgba(34, 211, 238, 0.08)',
    border: 'rgba(34, 211, 238, 0.28)',
    text:   'var(--rv-cyan)',
    dot:    'var(--rv-cyan)',
  },
  green: {
    bg:     'rgba(52, 211, 153, 0.08)',
    border: 'rgba(52, 211, 153, 0.28)',
    text:   'var(--rv-green)',
    dot:    'var(--rv-green)',
  },
  amber: {
    bg:     'rgba(251, 191, 36, 0.08)',
    border: 'rgba(251, 191, 36, 0.28)',
    text:   'var(--rv-amber)',
    dot:    'var(--rv-amber)',
  },
  rose: {
    bg:     'rgba(248, 113, 113, 0.08)',
    border: 'rgba(248, 113, 113, 0.28)',
    text:   'var(--rv-rose)',
    dot:    'var(--rv-rose)',
  },
  purple: {
    bg:     'rgba(167, 139, 250, 0.08)',
    border: 'rgba(167, 139, 250, 0.28)',
    text:   'var(--rv-purple)',
    dot:    'var(--rv-purple)',
  },
  gray: {
    bg:     'var(--rv-bg-3)',
    border: 'var(--rv-border-1)',
    text:   'var(--rv-text-2)',
    dot:    'var(--rv-text-3)',
  },
};

const SIZES = {
  sm: 'px-2 py-0.5 text-[11px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
};

export default function GlowBadge({
  color = 'blue',
  size = 'md',
  dot = false,
  className = '',
  children,
}) {
  const c = COLORS[color] ?? COLORS.gray;
  const s = SIZES[size] ?? SIZES.md;

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium font-mono tracking-wide ${s} ${className}`}
      style={{
        backgroundColor: c.bg,
        borderColor: c.border,
        color: c.text,
      }}
    >
      {dot && (
        <span
          className="rounded-full shrink-0"
          style={{
            width: size === 'sm' ? '5px' : '6px',
            height: size === 'sm' ? '5px' : '6px',
            backgroundColor: c.dot,
          }}
        />
      )}
      {children}
    </span>
  );
}
