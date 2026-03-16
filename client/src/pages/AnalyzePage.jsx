import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RepoForm from '../features/analyzer/components/RepoForm';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import StatCard from '../features/dashboard/components/StatCard';
import AiAnalysisCard from '../features/analyzer/components/AiAnalysisCard';
import LanguageChart from '../components/LanguageChart';
import ActivityCard from '../components/ActivityCard';
import AnalysisSkeleton from '../components/AnalysisSkeleton';
import { formatDate } from '../utils/formatters';

export default function AnalyzePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const data = state?.data;

  if (!data) {
    return (
      <main className={`mx-auto py-16 px-4 transition-all ${analyzing ? 'max-w-4xl space-y-8' : 'max-w-2xl'}`}>
        <div>
          {!analyzing && (
            <h2 className="text-3xl font-bold text-white mb-8">Analyze a Repository</h2>
          )}
          <RepoForm
            onSuccess={(result) => navigate('/analyze', { state: { data: result } })}
            onLoadingChange={setAnalyzing}
          />
        </div>
        {analyzing && <AnalysisSkeleton />}
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-16 px-4 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold text-white">{data.name}</h2>
          {data.description && (
            <p className="text-gray-400 mt-1 max-w-2xl">{data.description}</p>
          )}
        </div>
        <Badge color="green">Analysis Complete</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Stars" value={data.stars?.toLocaleString()} icon="⭐" />
        <StatCard label="Forks" value={data.forks?.toLocaleString()} icon="🍴" />
        <StatCard label="Open Issues" value={data.openIssues?.toLocaleString()} icon="🐛" />
        <StatCard label="Language" value={data.language ?? '—'} icon="💻" />
      </div>

      <ActivityCard activity={data.activity} />

      <LanguageChart languages={data.languages} />

      {data.topics?.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-white mb-3">Topics</h3>
          <div className="flex flex-wrap gap-2">
            {data.topics.map((topic) => (
              <Badge key={topic} color="violet">{topic}</Badge>
            ))}
          </div>
        </Card>
      )}

      {data.aiAnalysis && <AiAnalysisCard analysis={data.aiAnalysis} />}

      {data.lastUpdated && (
        <p className="text-sm text-gray-500">
          Last updated {formatDate(data.lastUpdated)}
        </p>
      )}

      <button
        onClick={() => navigate('/')}
        className="text-sm text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors cursor-pointer"
      >
        ← Analyze another repository
      </button>
    </main>
  );
}
