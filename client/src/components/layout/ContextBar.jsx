import { useLocation, Link } from 'react-router-dom';

// ─── Icons ─────────────────────────────────────────────────────────────────

function ChevronRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function RepoIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

// ─── Route to breadcrumb mapping ───────────────────────────────────────────

function useBreadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);

  if (parts.length === 0) return [];

  const crumbs = [{ label: 'Home', to: '/' }];

  parts.forEach((part, i) => {
    const to = '/' + parts.slice(0, i + 1).join('/');
    const label = part.charAt(0).toUpperCase() + part.slice(1);
    crumbs.push({ label, to });
  });

  return crumbs;
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function ContextBar({ repoSlug }) {
  const breadcrumbs = useBreadcrumbs();

  return (
    <div
      className="hidden md:flex items-center gap-2 px-5 border-b border-[var(--rv-border-0)]
        bg-[var(--rv-bg-1)] shrink-0"
      style={{ height: 'var(--rv-context-bar)' }}
    >
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.to} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-[var(--rv-text-3)]"><ChevronRight /></span>}
            {i < breadcrumbs.length - 1 ? (
              <Link
                to={crumb.to}
                className="text-[var(--rv-text-3)] hover:text-[var(--rv-text-2)] transition-colors font-mono"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-[var(--rv-text-2)] font-mono">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Repo slug pill (if provided) */}
      {repoSlug && (
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-md
          bg-[var(--rv-bg-2)] border border-[var(--rv-border-1)] text-[var(--rv-text-2)]">
          <span className="text-[var(--rv-blue)]"><RepoIcon /></span>
          <span className="text-xs font-mono text-[var(--rv-text-1)]">{repoSlug}</span>
        </div>
      )}
    </div>
  );
}
