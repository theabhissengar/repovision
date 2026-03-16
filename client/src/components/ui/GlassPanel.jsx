import { motion } from 'framer-motion';

/**
 * Frosted glass surface panel.
 *
 * Props:
 *   depth      1–4  → maps to --rv-bg-1 through --rv-bg-4  (default: 2)
 *   glowColor  'blue' | 'cyan' | 'green' | 'amber' | 'rose' | 'purple'  → adds inner glow ring
 *   hoverable  bool  → adds hover lift + border brighten
 *   as         string → HTML element or 'motion.div' (default: 'div')
 *   className  string
 *   children
 */

const DEPTH_BG = {
  1: 'var(--rv-bg-1)',
  2: 'var(--rv-bg-2)',
  3: 'var(--rv-bg-3)',
  4: 'var(--rv-bg-4)',
};

const GLOW_COLORS = {
  blue:   'rgba(74, 158, 255, 0.18)',
  cyan:   'rgba(34, 211, 238, 0.15)',
  green:  'rgba(52, 211, 153, 0.15)',
  amber:  'rgba(251, 191, 36, 0.15)',
  rose:   'rgba(248, 113, 113, 0.15)',
  purple: 'rgba(167, 139, 250, 0.15)',
};

export default function GlassPanel({
  depth = 2,
  glowColor,
  hoverable = false,
  className = '',
  children,
  ...props
}) {
  const bg = DEPTH_BG[depth] ?? DEPTH_BG[2];
  const glow = glowColor ? GLOW_COLORS[glowColor] : null;

  const boxShadow = glow
    ? `0 0 0 1px ${glow}, 0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)`
    : '0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)';

  if (hoverable) {
    return (
      <motion.div
        whileHover={{ y: -2, transition: { duration: 0.15 } }}
        className={`rounded-xl border border-[var(--rv-border-1)] backdrop-blur-xl
          transition-[border-color] duration-200
          hover:border-[var(--rv-border-2)] ${className}`}
        style={{ background: `rgba(${hexToRgb(bg)}, 0.72)`, boxShadow }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-[var(--rv-border-1)] backdrop-blur-xl ${className}`}
      style={{
        background: `${bg}`,
        boxShadow,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// Helper — not exported
function hexToRgb(cssVar) {
  // For inline style fallback — just use the var directly
  return '13, 20, 36';
}
