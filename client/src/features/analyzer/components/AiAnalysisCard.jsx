import Card from '../../../components/ui/Card';
import InfoTooltip from '../../../components/ui/InfoTooltip';

function ScoreRing({ score }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 10) * circumference;
  const color =
    score >= 8 ? '#34d399' : score >= 5 ? '#a78bfa' : '#f87171';

  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="#1f2937"
          strokeWidth="8"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <span className="text-3xl font-bold text-white -mt-[68px] mb-[36px]">
        {score}
      </span>
      <span className="text-xs text-gray-500 tracking-wide uppercase">/ 10</span>
    </div>
  );
}

function List({ items, icon, emptyText }) {
  if (!items?.length) {
    return <p className="text-sm text-gray-500 italic">{emptyText}</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-gray-300 leading-relaxed">
          <span className="mt-0.5 shrink-0">{icon}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function AiAnalysisCard({ analysis }) {
  const { score, strengths, improvements } = analysis;

  const label =
    score >= 8 ? 'Excellent' : score >= 6 ? 'Good' : score >= 4 ? 'Fair' : 'Needs Work';
  const labelColor =
    score >= 8 ? 'text-green-400' : score >= 6 ? 'text-violet-400' : score >= 4 ? 'text-yellow-400' : 'text-red-400';

  return (
    <Card>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center">
            AI Analysis
            <InfoTooltip text="An AI-generated quality score from 1–10 based on code structure, documentation, activity, and community engagement." />
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Quality score &amp; actionable insights
          </p>
        </div>
        <span className={`text-sm font-semibold ${labelColor}`}>{label}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-8">
        <ScoreRing score={score} />

        <div className="flex-1 grid sm:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-1.5">
              <span>✓</span> Strengths
            </h4>
            <List
              items={strengths}
              icon="✦"
              emptyText="No notable strengths detected."
            />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-1.5">
              <span>↑</span> Suggestions
            </h4>
            <List
              items={improvements}
              icon="→"
              emptyText="No improvements needed."
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
