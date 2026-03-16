import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/ui/PageTransition';
import RepoForm from '../features/analyzer/components/RepoForm';
import RepoHero from '../features/analyzer/components/RepoHero';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import StatCard from '../features/dashboard/components/StatCard';
import AiAnalysisCard from '../features/analyzer/components/AiAnalysisCard';
import LanguageChart from '../components/LanguageChart';
import ActivityCard from '../components/ActivityCard';
import AnalysisSkeleton from '../components/AnalysisSkeleton';

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
      <PageTransition>
      <main className={`mx-auto py-16 px-4 transition-all ${analyzing ? 'max-w-4xl space-y-8' : 'max-w-2xl'}`}>
        <div>
          {!analyzing && (
            <h2 className="text-3xl font-bold text-foreground mb-8">Analyze a Repository</h2>
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
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
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
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground'
                    }`}
                >
                  {repo.name}
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
    <main className="max-w-4xl mx-auto py-12 px-4 space-y-6">

      {/* Back navigation */}
      <button
        onClick={() => navigate('/analyze', { replace: true })}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
      >
        <span className="inline-block transition-transform group-hover:-translate-x-0.5">←</span>
        Analyze another repository
      </button>

      {/* Hero header */}
      <RepoHero data={data} />

      {/* Stat cards — visible immediately, no extra motion needed */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Stars"       value={data.stars?.toLocaleString()}       variant="stars" />
        <StatCard label="Forks"       value={data.forks?.toLocaleString()}       variant="forks" />
        <StatCard label="Open Issues" value={data.openIssues?.toLocaleString()}  variant="issues" />
        <StatCard label="Language"    value={data.language ?? '—'}               variant="language" />
      </div>

      {/* Sections below the fold reveal on scroll */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <ActivityCard activity={data.activity} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <LanguageChart languages={data.languages} />
      </motion.div>

      {data.topics?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Card hoverable>
            <h3 className="text-lg font-semibold text-foreground mb-3">Topics</h3>
            <div className="flex flex-wrap gap-2">
              {data.topics.map((topic) => (
                <Badge key={topic} color="violet">{topic}</Badge>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {data.aiAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <AiAnalysisCard analysis={data.aiAnalysis} />
        </motion.div>
      )}

    </main>
    </PageTransition>
  );
}
