import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { staggerContainer, panelReveal } from '../design/animations';

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: 'var(--rv-bg-0)' }}
    >
      {/* Faint dot grid */}
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" aria-hidden="true" />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative flex flex-col items-start max-w-lg w-full"
      >
        {/* Terminal window chrome */}
        <motion.div
          variants={panelReveal}
          className="w-full rounded-2xl border overflow-hidden"
          style={{
            background: 'var(--rv-bg-1)',
            borderColor: 'var(--rv-border-1)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-2 px-4 py-3 border-b"
            style={{ borderColor: 'var(--rv-border-0)', background: 'var(--rv-bg-2)' }}
          >
            <span className="w-3 h-3 rounded-full" style={{ background: 'var(--rv-rose)' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: 'var(--rv-amber)' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: 'var(--rv-green)' }} />
            <span
              className="ml-2 text-xs"
              style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}
            >
              repovision — bash
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-6 space-y-2" style={{ fontFamily: 'var(--rv-font-mono)', fontSize: 13 }}>
            {/* Command */}
            <motion.div
              variants={panelReveal}
              className="flex items-center gap-2"
            >
              <span style={{ color: 'var(--rv-green)' }}>~</span>
              <span style={{ color: 'var(--rv-blue)' }}>$</span>
              <span style={{ color: 'var(--rv-text-2)' }}>
                repovision --find
              </span>
              <span style={{ color: 'var(--rv-amber)' }}>
                &quot;{location.pathname}&quot;
              </span>
            </motion.div>

            {/* Output */}
            <motion.div variants={panelReveal} className="pl-4 space-y-1.5 pt-1">
              <p style={{ color: 'var(--rv-rose)' }}>
                Error: path not found (404)
              </p>
              <p style={{ color: 'var(--rv-text-3)' }}>
                &gt; The requested route does not exist.
              </p>
              <p style={{ color: 'var(--rv-text-3)' }}>
                &gt; Try navigating to a valid endpoint.
              </p>
            </motion.div>

            {/* New prompt with blinking cursor */}
            <motion.div
              variants={panelReveal}
              className="flex items-center gap-2 pt-2"
            >
              <span style={{ color: 'var(--rv-green)' }}>~</span>
              <span style={{ color: 'var(--rv-blue)' }}>$</span>
              <span className="animate-blink w-2 h-[1em] inline-block"
                style={{ background: 'var(--rv-text-2)', verticalAlign: 'text-bottom' }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          variants={panelReveal}
          className="flex items-center gap-3 mt-6 self-center"
        >
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
            style={{
              background: 'var(--rv-blue)',
              color: 'white',
              boxShadow: '0 0 20px rgba(74,158,255,0.2)',
            }}
          >
            ← Return home
          </Link>
          <Link
            to="/analyze"
            className="px-5 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150"
            style={{
              color: 'var(--rv-text-2)',
              borderColor: 'var(--rv-border-2)',
              background: 'var(--rv-bg-2)',
            }}
          >
            Analyze a repo
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
