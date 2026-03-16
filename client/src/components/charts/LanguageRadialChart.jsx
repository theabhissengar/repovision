import { useState } from 'react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { motion } from 'framer-motion';

/**
 * Radial bar chart for language distribution.
 * Replaces the old donut PieChart.
 *
 * Props:
 *   languages   object  { [name]: percentage }
 */

// Dev-tool inspired palette — distinct, readable on dark
const PALETTE = [
  '#4a9eff', // electric blue
  '#22d3ee', // cyan
  '#34d399', // emerald
  '#fbbf24', // amber
  '#f87171', // rose
  '#a78bfa', // purple
  '#fb923c', // orange
  '#2dd4bf', // teal
  '#60a5fa', // sky
  '#c084fc', // violet
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value, fill } = payload[0].payload;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.12 }}
      className="rounded-lg border px-3 py-2.5 pointer-events-none"
      style={{
        background: 'var(--rv-bg-3)',
        borderColor: 'var(--rv-border-2)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        minWidth: 130,
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: fill }} />
        <span className="text-sm font-medium" style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-body)' }}>
          {name}
        </span>
      </div>
      <div style={{ fontFamily: 'var(--rv-font-mono)', color: fill }}>
        <span className="text-xl font-bold">{value}</span>
        <span className="text-sm ml-0.5" style={{ color: 'var(--rv-text-2)' }}>%</span>
      </div>
    </motion.div>
  );
}

function LegendRow({ name, value, color, index, isActive }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: isActive ? 1 : 0.3, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-2.5"
    >
      <span
        className="w-2.5 h-2.5 rounded-sm shrink-0"
        style={{ background: color }}
      />
      <span
        className="text-sm flex-1 truncate"
        style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-body)' }}
      >
        {name}
      </span>
      <span
        className="text-xs font-bold tabular-nums shrink-0"
        style={{ color, fontFamily: 'var(--rv-font-mono)' }}
      >
        {value}%
      </span>
    </motion.div>
  );
}

export default function LanguageRadialChart({ languages }) {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!languages || Object.keys(languages).length === 0) return null;

  const data = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, value], index) => ({
      name,
      value,
      fill: PALETTE[index % PALETTE.length],
    }));

  return (
    <div className="flex flex-col gap-5">
      {/* Radial chart */}
      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="25%"
            outerRadius="95%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={4}
              background={{ fill: 'var(--rv-bg-3)' }}
              isAnimationActive
              animationBegin={100}
              animationDuration={900}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={false}
              isAnimationActive={false}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="space-y-2.5">
        {data.map((entry, index) => (
          <LegendRow
            key={entry.name}
            name={entry.name}
            value={entry.value}
            color={entry.fill}
            index={index}
            isActive={activeIndex === null || activeIndex === index}
          />
        ))}
      </div>
    </div>
  );
}
