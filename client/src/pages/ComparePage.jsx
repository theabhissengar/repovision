import { useState } from 'react';
import RepoCompareForm from '../components/RepoCompareForm';
import ComparisonTable from '../components/ComparisonTable';
import Badge from '../components/ui/Badge';

export default function ComparePage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!result) {
    return (
      <main className={`mx-auto py-16 px-4 transition-all ${loading ? 'max-w-2xl' : 'max-w-2xl'}`}>
        {!loading && (
          <h2 className="text-3xl font-bold text-white mb-8">Compare Repositories</h2>
        )}
        <RepoCompareForm
          onSuccess={setResult}
          onLoadingChange={setLoading}
        />
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-16 px-4 space-y-8">
      <button
        onClick={() => setResult(null)}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer group"
      >
        <span className="inline-block transition-transform group-hover:-translate-x-0.5">←</span>
        Compare different repositories
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold text-white">Comparison Results</h2>
          <p className="text-gray-400 mt-1">
            {result.repo1.name} vs {result.repo2.name}
          </p>
        </div>
        <Badge color="green">Comparison Complete</Badge>
      </div>

      <ComparisonTable repo1={result.repo1} repo2={result.repo2} />
    </main>
  );
}
