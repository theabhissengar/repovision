const CONFIG = {
  NOT_FOUND: {
    icon: '🔍',
    title: 'Repository not found',
    style: 'bg-red-950/60 border-red-700/50 text-red-300',
    titleStyle: 'text-red-400',
    dismissStyle: 'text-red-400 hover:text-red-200',
  },
  RATE_LIMIT: {
    icon: '⏱',
    title: 'GitHub API rate limit reached',
    style: 'bg-yellow-950/60 border-yellow-700/50 text-yellow-300',
    titleStyle: 'text-yellow-400',
    dismissStyle: 'text-yellow-400 hover:text-yellow-200',
  },
  INVALID_URL: {
    icon: '⚠️',
    title: 'Invalid repository URL',
    style: 'bg-red-950/60 border-red-700/50 text-red-300',
    titleStyle: 'text-red-400',
    dismissStyle: 'text-red-400 hover:text-red-200',
  },
  NETWORK_ERROR: {
    icon: '📡',
    title: 'Cannot reach server',
    style: 'bg-orange-950/60 border-orange-700/50 text-orange-300',
    titleStyle: 'text-orange-400',
    dismissStyle: 'text-orange-400 hover:text-orange-200',
  },
  SERVER_ERROR: {
    icon: '💥',
    title: 'Server error',
    style: 'bg-red-950/60 border-red-700/50 text-red-300',
    titleStyle: 'text-red-400',
    dismissStyle: 'text-red-400 hover:text-red-200',
  },
};

const FALLBACK = CONFIG.SERVER_ERROR;

export default function ApiErrorBanner({ message, code, onDismiss }) {
  const { icon, title, style, titleStyle, dismissStyle } = CONFIG[code] ?? FALLBACK;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${style}`}
    >
      <span className="mt-0.5 shrink-0 text-base leading-none">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className={`font-semibold leading-snug ${titleStyle}`}>{title}</p>
        <p className="mt-0.5 leading-relaxed opacity-90">{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          className={`shrink-0 text-lg leading-none transition-colors cursor-pointer ${dismissStyle}`}
        >
          ×
        </button>
      )}
    </div>
  );
}
