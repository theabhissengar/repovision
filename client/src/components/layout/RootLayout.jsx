import { Outlet, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';

export default function RootLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/*
        AnimatePresence must own the keyed container so it can intercept
        unmounts and let PageTransition's exit animation finish before the
        old page is removed from the DOM.
      */}
      <AnimatePresence mode="wait" initial={false}>
        <div key={location.pathname} className="flex-1 flex flex-col">
          <Outlet />
        </div>
      </AnimatePresence>

      <footer className="border-t border-border py-5 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            RepoVision
            <span className="mx-1.5 text-border-strong">·</span>
            <span className="font-mono text-muted-foreground/60">v1.3</span>
          </p>
          <nav className="flex items-center gap-4">
            <Link
              to="/about"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <span className="text-border-strong">·</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
