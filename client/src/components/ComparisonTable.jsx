import Card from './ui/Card';
import Badge from './ui/Badge';

const METRICS = [
  {
    key: 'stars',
    label: 'Stars',
    icon: '⭐',
    format: (v) => (v != null ? v.toLocaleString() : '—'),
    better: 'higher',
  },
  {
    key: 'forks',
    label: 'Forks',
    icon: '🍴',
    format: (v) => (v != null ? v.toLocaleString() : '—'),
    better: 'higher',
  },
  {
    key: 'openIssues',
    label: 'Open Issues',
    icon: '🐛',
    format: (v) => (v != null ? v.toLocaleString() : '—'),
    better: 'lower',
  },
  {
    key: 'language',
    label: 'Language',
    icon: '💻',
    format: (v) => v ?? '—',
    better: null,
  },
];

function getWinner(metric, repo1, repo2) {
  const v1 = repo1[metric.key];
  const v2 = repo2[metric.key];
  if (metric.better === null || v1 == null || v2 == null || typeof v1 !== 'number') return 0;
  if (metric.better === 'higher') return v1 > v2 ? 1 : v1 < v2 ? 2 : 0;
  if (metric.better === 'lower') return v1 < v2 ? 1 : v1 > v2 ? 2 : 0;
  return 0;
}

function RepoHeader({ label, name }) {
  return (
    <div className="p-4 text-center">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="font-semibold text-white truncate" title={name}>{name}</p>
    </div>
  );
}

function MetricCell({ value, isWinner }) {
  return (
    <div className={`p-4 flex items-center justify-center gap-2 ${isWinner ? 'bg-violet-950/30' : ''}`}>
      <span className={`text-lg font-bold ${isWinner ? 'text-violet-300' : 'text-white'}`}>
        {value}
      </span>
      {isWinner && <Badge color="violet">Best</Badge>}
    </div>
  );
}

export default function ComparisonTable({ repo1, repo2 }) {
  return (
    <Card className="overflow-hidden p-0!">
      <div className="grid grid-cols-3 divide-x divide-gray-800 border-b border-gray-800">
        <div className="p-4 bg-gray-800/20" />
        <RepoHeader label="Repo 1" name={repo1.name} />
        <RepoHeader label="Repo 2" name={repo2.name} />
      </div>

      {METRICS.map((metric, i) => {
        const winner = getWinner(metric, repo1, repo2);
        const isLast = i === METRICS.length - 1;

        return (
          <div
            key={metric.key}
            className={`grid grid-cols-3 divide-x divide-gray-800 ${!isLast ? 'border-b border-gray-800' : ''}`}
          >
            <div className="p-4 flex items-center gap-2.5 bg-gray-800/20">
              <span className="text-xl leading-none">{metric.icon}</span>
              <span className="text-sm font-medium text-gray-300">{metric.label}</span>
            </div>
            <MetricCell value={metric.format(repo1[metric.key])} isWinner={winner === 1} />
            <MetricCell value={metric.format(repo2[metric.key])} isWinner={winner === 2} />
          </div>
        );
      })}
    </Card>
  );
}
