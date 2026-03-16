import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import PageTransition from '../components/ui/PageTransition';

const features = [
  { icon: '📊', title: 'Repository Analysis', desc: 'Deep-dive into any public GitHub repo — stars, forks, languages, activity, and more.' },
  { icon: '🤖', title: 'AI-Powered Insights', desc: 'Get an instant AI summary covering code quality, strengths, and areas for improvement.' },
  { icon: '⚖️', title: 'Side-by-Side Comparison', desc: 'Compare two repositories head-to-head across every key metric.' },
  { icon: '📈', title: 'Activity Timeline', desc: 'Visualize recent commit activity to gauge project health at a glance.' },
];

const steps = [
  { num: '1', text: 'Paste a public GitHub repository URL into the analyzer.' },
  { num: '2', text: 'RepoVision fetches metadata, languages, and recent activity from the GitHub API.' },
  { num: '3', text: 'An AI model summarizes the repository and highlights key takeaways.' },
  { num: '4', text: 'Browse the interactive dashboard or compare with a second repo.' },
];

export default function AboutPage() {
  return (
    <PageTransition>
    <main className="max-w-4xl mx-auto py-16 px-4 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
          About <span className="text-primary">RepoVision</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          A modern tool for exploring, analyzing, and comparing public GitHub repositories — powered by AI.
        </p>
      </section>

      <Card>
        <h2 className="text-2xl font-semibold text-foreground mb-3">What is RepoVision?</h2>
        <p className="text-muted-foreground leading-relaxed">
          RepoVision is a web application that lets you paste any public GitHub repository URL and
          instantly receive a comprehensive breakdown of the project. It combines live data from the
          GitHub API with AI-generated insights so you can quickly evaluate a repository's quality,
          activity, and tech stack — all without leaving your browser.
        </p>
      </Card>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Features</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <Card key={f.title}>
              <span className="text-2xl">{f.icon}</span>
              <h3 className="text-lg font-semibold text-foreground mt-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <Card>
        <h2 className="text-2xl font-semibold text-foreground mb-3">Repository Analysis</h2>
        <p className="text-muted-foreground leading-relaxed">
          When you analyze a repository, RepoVision retrieves key stats like stars, forks, open issues,
          primary language, and topic tags. It also fetches the full language breakdown and recent commit
          history, then visualizes them with interactive charts. On top of the raw data, an AI model
          generates a concise summary covering code quality, project maturity, and notable strengths
          or weaknesses.
        </p>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold text-foreground mb-3">Repository Comparison</h2>
        <p className="text-muted-foreground leading-relaxed">
          The comparison feature lets you enter two repository URLs and view their metrics side by side
          in a detailed table. Stars, forks, issues, languages, activity, and more are placed next to
          each other so you can make informed decisions about which library or framework best fits your
          needs.
        </p>
      </Card>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">How It Works</h2>
        <ol className="space-y-4">
          {steps.map((s) => (
            <li key={s.num} className="flex items-start gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                {s.num}
              </span>
              <p className="text-muted-foreground leading-relaxed pt-1">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="text-center pt-4">
        <Link
          to="/analyze"
          className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          Try It Now →
        </Link>
      </div>
    </main>
    </PageTransition>
  );
}
