import { motion } from 'framer-motion';

const CONFIG = {
  NOT_FOUND: {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v4M11 16h.01"/>
      </svg>
    ),
    title: 'Repository not found',
    color: 'var(--rv-rose)',
    bg: 'rgba(248,113,113,0.06)',
    border: 'rgba(248,113,113,0.25)',
  },
  RATE_LIMIT: {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'GitHub API rate limit reached',
    color: 'var(--rv-amber)',
    bg: 'rgba(251,191,36,0.06)',
    border: 'rgba(251,191,36,0.25)',
  },
  INVALID_URL: {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    title: 'Invalid repository URL',
    color: 'var(--rv-rose)',
    bg: 'rgba(248,113,113,0.06)',
    border: 'rgba(248,113,113,0.25)',
  },
  NETWORK_ERROR: {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
      </svg>
    ),
    title: 'Cannot reach server',
    color: 'var(--rv-amber)',
    bg: 'rgba(251,191,36,0.06)',
    border: 'rgba(251,191,36,0.25)',
  },
  SERVER_ERROR: {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
    title: 'Server error',
    color: 'var(--rv-rose)',
    bg: 'rgba(248,113,113,0.06)',
    border: 'rgba(248,113,113,0.25)',
  },
};

const FALLBACK = CONFIG.SERVER_ERROR;

export default function ApiErrorBanner({ message, code, onDismiss }) {
  const { icon, title, color, bg, border } = CONFIG[code] ?? FALLBACK;

  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-3 rounded-xl border px-4 py-3 text-sm"
      style={{ background: bg, borderColor: border }}
    >
      <span className="mt-0.5 shrink-0" style={{ color }}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-snug" style={{ color, fontFamily: 'var(--rv-font-body)' }}>
          {title}
        </p>
        <p className="mt-0.5 leading-relaxed text-xs" style={{ color: 'var(--rv-text-2)' }}>
          {message}
        </p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="shrink-0 text-lg leading-none transition-opacity hover:opacity-60 cursor-pointer"
          style={{ color }}
        >
          ×
        </button>
      )}
    </motion.div>
  );
}
