import { useState, useEffect } from 'react';
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

const EXAMPLE_REPOS = [
  { url: 'https://github.com/facebook/react', name: 'facebook/react' },
  { url: 'https://github.com/vuejs/core', name: 'vuejs/core' },
  { url: 'https://github.com/vercel/next.js', name: 'vercel/next.js' },
  { url: 'https://github.com/tailwindlabs/tailwindcss', name: 'tailwindlabs/tailwindcss' },
];

export default function AnalyzePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const data = state?.data;

  useEffect(() => {
    if (!data) setCurrentUrl('');
  }, [data]);

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
            defaultUrl={currentUrl}
            onUrlChange={setCurrentUrl}
          />
        </div>
        {analyzing && <AnalysisSkeleton />}

        {!analyzing && (
          <section className="mt-10">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Try Example Repositories
            </h3>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_REPOS.map((repo) => (
                <button
                  key={repo.url}
                  type="button"
                  onClick={() => setCurrentUrl(repo.url)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer
                    ${currentUrl === repo.url
                      ? 'border-violet-500 bg-violet-500/10 text-violet-400'
                      : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600 hover:text-white'
                    }`}
                >
                  {repo.name}
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-16 px-4 space-y-8">
      <button
        onClick={() => navigate('/analyze', { replace: true })}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer group"
      >
        <span className="inline-block transition-transform group-hover:-translate-x-0.5">←</span>
        Analyze another repository
      </button>

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
    </main>
  );
}
