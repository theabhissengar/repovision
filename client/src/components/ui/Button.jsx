import { motion } from 'framer-motion';

/**
 * Terminal Depth button component.
 *
 * Variants:  primary | ghost | outline | dim | danger
 * Sizes:     xs | sm | md | lg
 */

const VARIANTS = {
  primary: `
    bg-[var(--rv-blue)] text-white border-transparent
    hover:bg-[#3d8fe8] active:bg-[#3280d6]
    shadow-[0_0_20px_rgba(74,158,255,0.2)]
    hover:shadow-[0_0_28px_rgba(74,158,255,0.3)]
    disabled:opacity-50 disabled:shadow-none disabled:hover:bg-[var(--rv-blue)]
  `,
  ghost: `
    bg-transparent text-[var(--rv-text-2)] border-transparent
    hover:text-[var(--rv-text-1)] hover:bg-[var(--rv-bg-3)]
    disabled:opacity-40
  `,
  outline: `
    bg-transparent text-[var(--rv-blue)] border-[var(--rv-blue-dim)]
    hover:border-[var(--rv-blue)] hover:bg-[rgba(74,158,255,0.06)]
    disabled:opacity-40
  `,
  dim: `
    bg-[var(--rv-bg-3)] text-[var(--rv-text-2)] border-[var(--rv-border-1)]
    hover:text-[var(--rv-text-1)] hover:bg-[var(--rv-bg-4)] hover:border-[var(--rv-border-2)]
    disabled:opacity-40
  `,
  danger: `
    bg-[rgba(248,113,113,0.1)] text-[var(--rv-rose)] border-[rgba(248,113,113,0.3)]
    hover:bg-[rgba(248,113,113,0.18)] hover:border-[rgba(248,113,113,0.5)]
    disabled:opacity-40
  `,
};

const SIZES = {
  xs: 'px-2.5 py-1 text-xs rounded-md gap-1.5',
  sm: 'px-3.5 py-1.5 text-sm rounded-lg gap-2',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-base rounded-xl gap-2.5',
};

function Spinner({ size }) {
  const dim = size === 'xs' || size === 'sm' ? 14 : 16;
  return (
    <svg
      width={dim} height={dim}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="animate-spin"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconRight,
  className = '',
  children,
  ...props
}) {
  const v = VARIANTS[variant] ?? VARIANTS.primary;
  const s = SIZES[size] ?? SIZES.md;

  return (
    <motion.button
      whileTap={{ scale: 0.97, transition: { duration: 0.08 } }}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium border
        transition-all duration-150 cursor-pointer select-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rv-blue)] focus-visible:ring-offset-1
        focus-visible:ring-offset-[var(--rv-bg-0)]
        disabled:cursor-not-allowed
        ${v} ${s} ${className}
      `}
      style={{ fontFamily: 'var(--rv-font-body)' }}
      {...props}
    >
      {loading ? (
        <Spinner size={size} />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
      {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
    </motion.button>
  );
}
