import Card from './ui/Card';
import InfoTooltip from './ui/InfoTooltip';
import { formatDate } from '../utils/formatters';

function activityLevel(count) {
  if (count === 0) return { label: 'Inactive', color: 'text-gray-400', bg: 'bg-gray-800' };
  if (count <= 5)  return { label: 'Low',      color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
  if (count <= 15) return { label: 'Moderate', color: 'text-violet-400', bg: 'bg-violet-400/10' };
  return             { label: 'Active',    color: 'text-green-400',  bg: 'bg-green-400/10' };
}

function relativeTime(dateString) {
  if (!dateString) return null;
  const diff = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30)  return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return '1 month ago';
  if (months < 12)  return `${months} months ago`;
  const years = Math.floor(months / 12);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}

function Metric({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      {children}
    </div>
  );
}

export default function ActivityCard({ activity }) {
  if (!activity) return null;

  const { commitsLast30Days, lastCommitDate } = activity;
  const level = activityLevel(commitsLast30Days);
  const relative = relativeTime(lastCommitDate);

  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center">
            Repository Activity
            <InfoTooltip text="Commit frequency and recency over the last 30 days, used to gauge how actively maintained the project is." />
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">Based on the last 30 commits</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${level.color} ${level.bg}`}>
          {level.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Metric label="Commits — last 30 days">
          <p className="text-3xl font-bold text-white tabular-nums">{commitsLast30Days}</p>
        </Metric>

        <Metric label="Last commit">
          <p className="text-xl font-semibold text-white">
            {lastCommitDate ? formatDate(lastCommitDate) : '—'}
          </p>
          {relative && (
            <p className="text-sm text-gray-500">{relative}</p>
          )}
        </Metric>
      </div>
    </Card>
  );
}
