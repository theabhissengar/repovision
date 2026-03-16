import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

// ─── Icons ─────────────────────────────────────────────────────────────────

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect width="28" height="28" rx="7" fill="var(--rv-blue)" fillOpacity="0.12" />
      <path d="M7 9h14M7 14h10M7 19h7" stroke="var(--rv-blue)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="21" cy="19" r="3" fill="var(--rv-cyan)" fillOpacity="0.9" />
    </svg>
  );
}

function AnalyzeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <path d="M11 8v6M8 11h6" />
    </svg>
  );
}

function CompareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3" />
      <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
      <path d="M12 20V4" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

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

// ─── Nav items config ──────────────────────────────────────────────────────

const NAV_ITEMS = [
  { to: '/',        label: 'Home',    Icon: HomeIcon },
  { to: '/analyze', label: 'Analyze', Icon: AnalyzeIcon },
  { to: '/compare', label: 'Compare', Icon: CompareIcon },
];

const BOTTOM_ITEMS = [
  { to: '/about', label: 'About', Icon: AboutIcon },
];

// ─── NavItem ───────────────────────────────────────────────────────────────

function NavItem({ to, label, Icon, expanded, exact = false }) {
  return (
    <NavLink
      to={to}
      end={exact}
      title={label}
      className={({ isActive }) =>
        `relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group
        ${isActive
          ? 'bg-[rgba(74,158,255,0.12)] text-[var(--rv-blue)]'
          : 'text-[var(--rv-text-2)] hover:text-[var(--rv-text-1)] hover:bg-[var(--rv-bg-3)]'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="nav-indicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-[var(--rv-blue)]"
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
          <span className="shrink-0 w-5 flex items-center justify-center">
            <Icon />
          </span>
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="text-[0.95rem] font-medium whitespace-nowrap overflow-hidden font-body"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </>
      )}
    </NavLink>
  );
}

// ─── Desktop Sidebar ───────────────────────────────────────────────────────

function DesktopSideNav({ expanded, onToggle }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.nav
      animate={{ width: expanded ? 220 : 60 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="hidden md:flex flex-col h-screen sticky top-0 shrink-0 overflow-hidden
        border-r border-[var(--rv-border-1)] bg-[var(--rv-bg-1)] z-40"
    >
      {/* Logo row: icon toggles collapse */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-[var(--rv-border-0)] shrink-0">
        <button
          type="button"
          onClick={onToggle}
          className="shrink-0 p-1 rounded-lg hover:bg-[var(--rv-bg-2)] transition-colors"
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          title={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <LogoMark />
        </button>
      </div>

      {/* Main nav */}
      <div className="flex-1 flex flex-col gap-1 p-2 pt-3 overflow-hidden">
        {NAV_ITEMS.map(item => (
          <NavItem key={item.to} {...item} expanded={expanded} exact={item.to === '/'} />
        ))}
      </div>

      {/* Bottom items */}
      <div className="flex flex-col gap-1 p-2 border-t border-[var(--rv-border-0)]">
        {BOTTOM_ITEMS.map(item => (
          <NavItem key={item.to} {...item} expanded={expanded} />
        ))}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--rv-text-2)]
            hover:text-[var(--rv-text-1)] hover:bg-[var(--rv-bg-3)] transition-all duration-150"
          aria-label="Toggle theme"
        >
          <span
            className="shrink-0 w-5 flex items-center justify-center"
            style={{
              transition: 'transform 0.35s ease',
              transform: theme === 'dark' ? 'rotate(0deg)' : 'rotate(180deg)',
            }}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </span>
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                className="text-[0.95rem] font-medium whitespace-nowrap overflow-hidden font-body"
              >
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

      </div>
    </motion.nav>
  );
}

// ─── Mobile top bar + drawer ───────────────────────────────────────────────

function MobileNav() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 h-14 border-b border-[var(--rv-border-0)] bg-[var(--rv-bg-1)] sticky top-0 z-50">
        <Link to="/analyze" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-display font-bold text-base text-[var(--rv-text-1)]"
            style={{ fontFamily: 'var(--rv-font-display)' }}>
            RepoVision
          </span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg text-[var(--rv-text-2)] hover:bg-[var(--rv-bg-3)] transition-colors"
          aria-label="Open navigation"
        >
          <MenuIcon />
        </button>
      </div>

      {/* Drawer overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-[var(--rv-bg-1)] border-r border-[var(--rv-border-1)] z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--rv-border-0)]">
                <Link to="/analyze" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
                  <LogoMark />
                  <span className="font-bold text-base text-[var(--rv-text-1)]"
                    style={{ fontFamily: 'var(--rv-font-display)' }}>
                    RepoVision
                  </span>
                </Link>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-[var(--rv-text-2)] hover:bg-[var(--rv-bg-3)]">
                  <XIcon />
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-1 p-3">
                {NAV_ITEMS.map(item => (
                  <div key={item.to} onClick={() => setOpen(false)}>
                    <NavItem {...item} expanded exact={item.to === '/'} />
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1 p-3 border-t border-[var(--rv-border-0)]">
                {BOTTOM_ITEMS.map(item => (
                  <div key={item.to} onClick={() => setOpen(false)}>
                    <NavItem {...item} expanded />
                  </div>
                ))}
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--rv-text-2)]
                    hover:text-[var(--rv-text-1)] hover:bg-[var(--rv-bg-3)] transition-all duration-150 w-full"
                >
                  <span
                    className="w-5 flex items-center justify-center"
                    style={{
                      transition: 'transform 0.35s ease',
                      transform: theme === 'dark' ? 'rotate(0deg)' : 'rotate(180deg)',
                    }}
                  >
                    {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                  </span>
                  <span className="text-[0.95rem] font-medium">
                    {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                  </span>
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Export ────────────────────────────────────────────────────────────────

export default function SideNav({ expanded, onToggle }) {
  return (
    <>
      <DesktopSideNav expanded={expanded} onToggle={onToggle} />
      <MobileNav />
    </>
  );
}
