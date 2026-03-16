import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Card from './ui/Card';
import InfoTooltip from './ui/InfoTooltip';

const COLORS = [
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#34d399', // emerald-400
  '#f59e0b', // amber-400
  '#f87171', // red-400
  '#60a5fa', // blue-400
  '#fb923c', // orange-400
  '#e879f9', // fuchsia-400
  '#a3e635', // lime-400
  '#2dd4bf', // teal-400
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm shadow-lg">
      <span className="text-white font-medium">{name}</span>
      <span className="text-gray-400 ml-2">{value}%</span>
    </div>
  );
}

function LegendItem({ name, value, color }) {
  return (
    <div className="flex items-center justify-between gap-3 min-w-0">
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm text-gray-300 truncate">{name}</span>
      </div>
      <span className="text-sm font-medium text-gray-400 shrink-0 tabular-nums">
        {value}%
      </span>
    </div>
  );
}

export default function LanguageChart({ languages }) {
  if (!languages || Object.keys(languages).length === 0) return null;

  const data = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({ name, value }));

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-1 flex items-center">
        Language Distribution
        <InfoTooltip text="The percentage of each programming language in the repository, calculated by bytes of code from the GitHub API." />
      </h3>
      <p className="text-sm text-gray-500 mb-6">Breakdown by bytes of code</p>

      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
        <div className="w-full sm:w-48 h-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="80%"
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 w-full grid grid-cols-1 xs:grid-cols-2 gap-x-8 gap-y-2.5">
          {data.map((entry, index) => (
            <LegendItem
              key={entry.name}
              name={entry.name}
              value={entry.value}
              color={COLORS[index % COLORS.length]}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
