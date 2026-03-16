import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Expandable/collapsible insight panel.
 *
 * Props:
 *   title        string
 *   icon         ReactNode
 *   count        number  — shown in header badge
 *   defaultOpen  bool    (default: false)
 *   accentColor  'blue' | 'green' | 'amber' | 'rose' | 'purple' | 'cyan'
 *   children
 */

const ACCENT = {
  blue:   { color: 'var(--rv-blue)',   bg: 'rgba(74,158,255,0.08)',   border: 'rgba(74,158,255,0.2)' },
  green:  { color: 'var(--rv-green)',  bg: 'rgba(52,211,153,0.08)',   border: 'rgba(52,211,153,0.2)' },
  amber:  { color: 'var(--rv-amber)',  bg: 'rgba(251,191,36,0.08)',   border: 'rgba(251,191,36,0.2)' },
  rose:   { color: 'var(--rv-rose)',   bg: 'rgba(248,113,113,0.08)',  border: 'rgba(248,113,113,0.2)' },
  purple: { color: 'var(--rv-purple)', bg: 'rgba(167,139,250,0.08)',  border: 'rgba(167,139,250,0.2)' },
  cyan:   { color: 'var(--rv-cyan)',   bg: 'rgba(34,211,238,0.08)',   border: 'rgba(34,211,238,0.2)' },
};

function ChevronIcon({ open }) {
  return (
    <motion.svg
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </motion.svg>
  );
}

export default function InsightPanel({
  title,
  icon,
  count,
  defaultOpen = false,
  accentColor = 'blue',
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const acc = ACCENT[accentColor] ?? ACCENT.blue;

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        background: 'var(--rv-bg-2)',
        borderColor: open ? acc.border : 'var(--rv-border-1)',
        transition: 'border-color 0.2s ease',
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left
          transition-colors duration-150 cursor-pointer"
        style={{
          background: open ? acc.bg : 'transparent',
        }}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <span style={{ color: acc.color }} className="shrink-0">
              {icon}
            </span>
          )}
          <span
            className="text-sm font-semibold"
            style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-body)' }}
          >
            {title}
          </span>
          {count !== undefined && (
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{
                background: acc.bg,
                color: acc.color,
                border: `1px solid ${acc.border}`,
                fontFamily: 'var(--rv-font-mono)',
              }}
            >
              {count}
            </span>
          )}
        </div>
        <span style={{ color: 'var(--rv-text-3)' }}>
          <ChevronIcon open={open} />
        </span>
      </button>

      {/* Body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="px-5 pb-5 pt-1"
              style={{ borderTop: `1px solid ${acc.border}` }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
