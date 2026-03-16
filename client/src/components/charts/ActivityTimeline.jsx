import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { motion } from 'framer-motion';

/**
 * Commit activity area chart.
 * Accepts either a raw scalar (commitsLast30Days) and renders a synthetic
 * sparkline, or a detailed commitsByDay array for a real timeline.
 *
 * Props:
 *   commitsLast30Days   number  — total commits in last 30 days (scalar)
 *   commitsByDay        array   — [{ date, count }] optional, overrides scalar
 *   lastCommitDate      string  — ISO date string
 */

function buildSyntheticData(total, days = 30) {
  // Synthesize a plausible commit distribution for visualization purposes.
  // Weights toward the recent end, with random variation.
  const seed = total * 1.3;
  const weights = Array.from({ length: days }, (_, i) => {
    const recency = (i / days) * 0.6 + 0.4;
    return recency + Math.sin(i * 0.7) * 0.2 + Math.cos(i * 1.3) * 0.1;
  });
  const sum = weights.reduce((a, b) => a + b, 0);
  const normalized = weights.map(w => Math.max(0, Math.round((w / sum) * seed)));

  return normalized.map((count, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return {
      day: i + 1,
      count,
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  });
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { label, count } = payload[0].payload;

  return (
    <div
      className="rounded-lg border px-2.5 py-2 pointer-events-none"
      style={{
        background: 'var(--rv-bg-3)',
        borderColor: 'var(--rv-border-2)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
      }}
    >
      <p className="text-xs mb-1" style={{ color: 'var(--rv-text-2)', fontFamily: 'var(--rv-font-mono)' }}>{label}</p>
      <p className="text-sm font-bold" style={{ color: 'var(--rv-blue)', fontFamily: 'var(--rv-font-mono)' }}>
        {count} commit{count !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

export default function ActivityTimeline({ commitsLast30Days = 0, commitsByDay, lastCommitDate }) {
  const data = commitsByDay ?? buildSyntheticData(commitsLast30Days);
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div style={{ width: '100%', height: 120 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
            <defs>
              <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--rv-blue)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--rv-blue)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={false}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: 'var(--rv-border-2)', strokeWidth: 1 }}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--rv-blue)"
              strokeWidth={1.5}
              fill="url(#commitGradient)"
              isAnimationActive
              animationDuration={800}
              animationEasing="ease-out"
              dot={false}
              activeDot={{
                r: 3,
                fill: 'var(--rv-blue)',
                stroke: 'var(--rv-bg-0)',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between mt-3 pt-3"
        style={{ borderTop: '1px solid var(--rv-border-0)' }}>
        <div>
          <span className="text-xs" style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
            30d total
          </span>
          <p className="text-xl font-bold mt-0.5" style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-display)' }}>
            {commitsLast30Days}
          </p>
        </div>
        {lastCommitDate && (
          <div className="text-right">
            <span className="text-xs" style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
              last commit
            </span>
            <p className="text-sm mt-0.5" style={{ color: 'var(--rv-text-2)', fontFamily: 'var(--rv-font-mono)' }}>
              {new Date(lastCommitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
