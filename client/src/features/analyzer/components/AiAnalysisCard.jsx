import InsightPanel from '../../../components/insights/InsightPanel';
import RepoScoreCard from '../../../components/insights/RepoScoreCard';

// ─── Icons ─────────────────────────────────────────────────────────────────

function StrengthIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}

function ImprovementIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 8v4M12 16h.01"/>
    </svg>
  );
}

// ─── List item ─────────────────────────────────────────────────────────────

function InsightItem({ text, accent }) {
  const colors = {
    green:  { dot: 'var(--rv-green)',  text: 'var(--rv-text-2)' },
    amber:  { dot: 'var(--rv-amber)',  text: 'var(--rv-text-2)' },
    blue:   { dot: 'var(--rv-blue)',   text: 'var(--rv-text-2)' },
  };
  const c = colors[accent] ?? colors.blue;

  return (
    <li className="flex gap-3 text-sm leading-relaxed">
      <span
        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: c.dot }}
      />
      <span style={{ color: c.text, fontFamily: 'var(--rv-font-body)' }}>{text}</span>
    </li>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function AiAnalysisCard({ analysis }) {
  const { score, strengths = [], improvements = [] } = analysis;

  const summary = strengths.length > 0
    ? `${strengths[0].toLowerCase().replace(/\.$/, '')}.`
    : undefined;

  return (
    <div className="space-y-3">
      {/* Score hero */}
      <RepoScoreCard
        score={score}
        summary={summary}
      />

      {/* Strengths */}
      <InsightPanel
        title="Strengths"
        icon={<StrengthIcon />}
        count={strengths.length}
        accentColor="green"
        defaultOpen={strengths.length > 0}
      >
        {strengths.length > 0 ? (
          <ul className="space-y-2.5 mt-3">
            {strengths.map((item, i) => (
              <InsightItem key={i} text={item} accent="green" />
            ))}
          </ul>
        ) : (
          <p className="text-sm mt-3" style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-body)' }}>
            No notable strengths detected.
          </p>
        )}
      </InsightPanel>

      {/* Improvements */}
      <InsightPanel
        title="Suggestions"
        icon={<ImprovementIcon />}
        count={improvements.length}
        accentColor="amber"
        defaultOpen={improvements.length > 0}
      >
        {improvements.length > 0 ? (
          <ul className="space-y-2.5 mt-3">
            {improvements.map((item, i) => (
              <InsightItem key={i} text={item} accent="amber" />
            ))}
          </ul>
        ) : (
          <p className="text-sm mt-3" style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-body)' }}>
            No improvements needed.
          </p>
        )}
      </InsightPanel>
    </div>
  );
}
