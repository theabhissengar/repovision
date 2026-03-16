import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import SideNav from './SideNav';
import ContextBar from './ContextBar';

export default function WorkspaceLayout() {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--rv-bg-0)]" style={{ fontFamily: 'var(--rv-font-body)' }}>
      {/* Sidebar — desktop only, mobile uses the mobile drawer inside SideNav */}
      <SideNav expanded={expanded} onToggle={() => setExpanded(v => !v)} />

      {/* Main pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ContextBar />

        {/* Analytics canvas — scrollable */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
