import { useAnalysisResult } from '../hooks/useAnalysisResult';
import StatCard from './StatCard';
import Spinner from '../../../components/ui/Spinner';
import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';

const STATUS_LABELS = {
  pending: { label: 'Queued', color: 'gray' },
  processing: { label: 'Analyzing…', color: 'yellow' },
  done: { label: 'Complete', color: 'green' },
  failed: { label: 'Failed', color: 'red' },
};

export default function AnalysisDashboard({ jobId }) {
  const { data, status, error } = useAnalysisResult(jobId);

  if (error) {
    return (
      <div className="text-center py-20 text-red-400">
        <p className="text-lg font-medium">{error}</p>
      </div>
    );
  }

  if (status !== 'done') {
    const { label, color } = STATUS_LABELS[status] || STATUS_LABELS.pending;
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <Spinner size="lg" />
        <Badge color={color}>{label}</Badge>
        <p className="text-gray-400">This may take a few seconds…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{data.repoName}</h2>
        <Badge color="green">Analysis Complete</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Stars" value={data.stars} icon="⭐" />
        <StatCard label="Forks" value={data.forks} icon="🍴" />
        <StatCard label="Open Issues" value={data.openIssues} icon="🐛" />
        <StatCard label="Contributors" value={data.contributors} icon="👥" />
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-white mb-3">AI Summary</h3>
        <p className="text-gray-300 leading-relaxed">{data.summary}</p>
      </Card>
    </div>
  );
}
