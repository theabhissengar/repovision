import { motion } from 'framer-motion';

/**
 * Opaque layered surface card.
 *
 * Props:
 *   variant    'default' | 'active' | 'highlight' | 'ghost'
 *   depth      1–4
 *   hoverable  bool
 *   padding    'none' | 'sm' | 'md' | 'lg'  (default: 'md')
 *   className  string
 *   children
 */

const VARIANTS = {
  default: {
    bg:     'var(--rv-bg-2)',
    border: 'var(--rv-border-1)',
    shadow: '0 2px 12px rgba(0,0,0,0.4)',
  },
  active: {
    bg:     'var(--rv-bg-3)',
    border: 'var(--rv-blue)',
    shadow: '0 0 0 1px rgba(74,158,255,0.2), 0 4px 20px rgba(74,158,255,0.08)',
  },
  highlight: {
    bg:     'var(--rv-bg-3)',
    border: 'var(--rv-border-2)',
    shadow: '0 4px 20px rgba(0,0,0,0.5)',
  },
  ghost: {
    bg:     'transparent',
    border: 'var(--rv-border-1)',
    shadow: 'none',
  },
};

const PADDING = {
  none: 'p-0',
  sm:   'p-3',
  md:   'p-5',
  lg:   'p-7',
};

export default function SurfacePanel({
  variant = 'default',
  hoverable = false,
  padding = 'md',
  className = '',
  children,
  ...props
}) {
  const v = VARIANTS[variant] ?? VARIANTS.default;
  const pad = PADDING[padding] ?? PADDING.md;

  if (hoverable) {
    return (
      <motion.div
        whileHover={{ y: -2, borderColor: 'var(--rv-border-2)', transition: { duration: 0.15 } }}
        className={`rounded-xl border ${pad} transition-shadow duration-200 ${className}`}
        style={{
          backgroundColor: v.bg,
          borderColor: v.border,
          boxShadow: v.shadow,
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`rounded-xl border ${pad} ${className}`}
      style={{
        backgroundColor: v.bg,
        borderColor: v.border,
        boxShadow: v.shadow,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
