import { useState } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

// ─── Icons ─────────────────────────────────────────────────────────────────

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

// ─── Nav links config ──────────────────────────────────────────────────────

const NAV_LINKS = [
  { to: '/',        label: 'Home',    exact: true },
  { to: '/analyze', label: 'Analyze' },
  { to: '/compare', label: 'Compare' },
  { to: '/about',   label: 'About' },
];

// ─── TopBar ────────────────────────────────────────────────────────────────

function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14
          border-b border-[var(--rv-border-0)] glass"
      >
        {/* Logo — text only on landing TopBar */}
        <Link to="/" className="flex items-center group">
          <span
            className="font-bold text-sm text-[var(--rv-text-1)] tracking-tight"
            style={{ fontFamily: 'var(--rv-font-display)' }}
          >
            RepoVision
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-lg text-sm transition-all duration-150
                ${isActive
                  ? 'text-[var(--rv-text-1)] bg-[var(--rv-bg-3)]'
                  : 'text-[var(--rv-text-2)] hover:text-[var(--rv-text-1)] hover:bg-[var(--rv-bg-2)]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[var(--rv-text-2)] hover:text-[var(--rv-text-1)]
              hover:bg-[var(--rv-bg-2)] transition-all duration-150"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg text-[var(--rv-text-2)] hover:bg-[var(--rv-bg-2)] transition-colors"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 bottom-0 w-64 bg-[var(--rv-bg-1)] border-l border-[var(--rv-border-1)] z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--rv-border-0)]">
                <span className="text-sm font-medium text-[var(--rv-text-2)]">Navigation</span>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg text-[var(--rv-text-2)] hover:bg-[var(--rv-bg-3)]">
                  <XIcon />
                </button>
              </div>
              <nav className="flex flex-col gap-1 p-3">
                {NAV_LINKS.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.exact}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-2.5 rounded-lg text-sm transition-colors
                      ${isActive
                        ? 'text-[var(--rv-blue)] bg-[rgba(74,158,255,0.1)]'
                        : 'text-[var(--rv-text-2)] hover:text-[var(--rv-text-1)] hover:bg-[var(--rv-bg-3)]'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-[var(--rv-border-0)] py-8 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <span className="text-xs text-[var(--rv-text-3)]" style={{ fontFamily: 'var(--rv-font-mono)' }}>
            RepoVision <span className="opacity-50">v1.3</span>
          </span>
        </div>
        <nav className="flex items-center gap-5">
          <Link to="/about" className="text-xs text-[var(--rv-text-3)] hover:text-[var(--rv-text-2)] transition-colors">
            About
          </Link>
          <Link to="/analyze" className="text-xs text-[var(--rv-text-3)] hover:text-[var(--rv-text-2)] transition-colors">
            Analyze
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--rv-text-3)] hover:text-[var(--rv-text-2)] transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}

// ─── Layout ────────────────────────────────────────────────────────────────

export default function LandingLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--rv-bg-0)] text-[var(--rv-text-1)]">
      <TopBar />

      {/* Content area — offset for fixed topbar */}
      <main className="flex-1 pt-14">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
