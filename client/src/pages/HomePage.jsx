import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '📊',
    title: 'Repository Analysis',
    desc: 'Analyze GitHub repositories and view metrics such as stars, forks, issues, language, and update activity.',
  },
  {
    icon: '🤖',
    title: 'AI Insights',
    desc: 'Receive AI-generated strengths, improvement suggestions, and a repository quality score.',
  },
  {
    icon: '⚖️',
    title: 'Repository Comparison',
    desc: 'Compare two repositories side-by-side to evaluate popularity, activity, and technology stack.',
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-col items-center px-4">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center min-h-[70vh] space-y-6 max-w-3xl w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-medium tracking-wide">
          AI-powered · GitHub API · Open Source
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
          Repo<span className="text-violet-500">Vision</span>
        </h1>

        <p className="text-gray-400 text-lg sm:text-xl max-w-xl leading-relaxed">
          Analyze GitHub repositories with AI-powered insights, activity metrics, and language analytics.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            to="/analyze"
            className="px-6 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors"
          >
            Start Analyzing →
          </Link>
          <Link
            to="/about"
            className="px-6 py-3 rounded-lg border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white font-medium text-sm transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-4xl pb-24">
        <div className="grid sm:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3 hover:border-gray-700 transition-colors"
            >
              <span className="text-2xl">{f.icon}</span>
              <h3 className="text-base font-semibold text-white">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
