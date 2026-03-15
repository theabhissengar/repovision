const CONFIG = {
  NOT_FOUND: {
    icon: '🔍',
    title: 'Repository not found',
    style: 'bg-red-950/60 border-red-700/50 text-red-300',
    titleStyle: 'text-red-400',
  },
  RATE_LIMIT: {
    icon: '⏱',
    title: 'GitHub API rate limit reached',
    style: 'bg-yellow-950/60 border-yellow-700/50 text-yellow-300',
    titleStyle: 'text-yellow-400',
  },
  INVALID_URL: {
    icon: '⚠️',
    title: 'Invalid URL',
    style: 'bg-red-950/60 border-red-700/50 text-red-300',
    titleStyle: 'text-red-400',
  },
  NETWORK_ERROR: {
    icon: '📡',
    title: 'Cannot reach server',
    style: 'bg-orange-950/60 border-orange-700/50 text-orange-300',
    titleStyle: 'text-orange-400',
  },
  SERVER_ERROR: {
    icon: '💥',
    title: 'Server error',
    style: 'bg-red-950/60 border-red-700/50 text-red-300',
    titleStyle: 'text-red-400',
  },
};

const FALLBACK = CONFIG.SERVER_ERROR;

export default function ApiErrorBanner({ message, code }) {
  const { icon, title, style, titleStyle } = CONFIG[code] ?? FALLBACK;

  return (
    <div
      role="alert"
      className={`flex gap-3 rounded-lg border px-4 py-3 text-sm ${style}`}
    >
      <span className="mt-0.5 shrink-0 text-base leading-none">{icon}</span>
      <div className="min-w-0">
        <p className={`font-semibold leading-snug ${titleStyle}`}>{title}</p>
        <p className="mt-0.5 leading-relaxed opacity-90">{message}</p>
      </div>
    </div>
  );
}
