import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './ui/Card';
import InfoTooltip from './ui/InfoTooltip';

// Theme-aligned palette — violet primary first, then complementary brand colors
const COLORS = [
  '#8b5cf6', // violet-500   — primary brand
  '#38bdf8', // sky-400      — accent
  '#34d399', // emerald-400
  '#f59e0b', // amber-400
  '#f472b6', // pink-400
  '#60a5fa', // blue-400
  '#fb923c', // orange-400
  '#c084fc', // purple-400
  '#2dd4bf', // teal-400
  '#a3e635', // lime-400
];

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value, color } = payload[0].payload;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-card/95 backdrop-blur-sm border border-border rounded-xl px-4 py-3
        shadow-xl shadow-black/10 dark:shadow-black/40 min-w-[140px] pointer-events-none"
    >
      <div className="flex items-center gap-2 mb-2.5">
        <span
          className="w-3 h-3 rounded-sm shrink-0 ring-1 ring-black/5"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm font-semibold text-foreground leading-none">{name}</span>
      </div>
      <div className="tabular-nums leading-none">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        <span className="text-sm font-medium text-muted-foreground ml-0.5">%</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1.5">of total codebase</p>
    </motion.div>
  );
}

// ─── Legend item ──────────────────────────────────────────────────────────────

function LegendItem({ name, value, color, index, isActive }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 14 }}
      animate={{
        opacity: isActive ? 1 : 0.3,
        x: 0,
      }}
      transition={{
        x:       { duration: 0.35, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] },
        opacity: { duration: 0.18 },
      }}
      className="group space-y-1.5"
    >
      {/* Name + percentage row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-3 h-3 rounded-sm shrink-0 transition-transform duration-200 group-hover:scale-110"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-medium text-foreground truncate">{name}</span>
        </div>
        <span className="text-xs font-bold text-foreground tabular-nums shrink-0">
          {value}%
        </span>
      </div>

      {/* Animated progress bar */}
      <div className="h-[3px] bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full origin-left"
          style={{ backgroundColor: color, width: `${value}%` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: 0.65,
            delay: index * 0.05 + 0.18,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LanguageChart({ languages }) {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!languages || Object.keys(languages).length === 0) return null;

  const data = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length],
    }));

  // Center label shows the hovered slice, or the top language by default
  const centerItem = activeIndex !== null ? data[activeIndex] : data[0];

  return (
    <Card hoverable>
      <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center">
        Language Distribution
        <InfoTooltip text="The percentage of each programming language in the repository, calculated by bytes of code from the GitHub API." />
      </h3>
      <p className="text-sm text-muted-foreground mb-6">Breakdown by bytes of code</p>

      <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">

        {/* ── Donut chart + center label ── */}
        <div className="relative w-44 h-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="58%"
                outerRadius="82%"
                paddingAngle={data.length > 1 ? 2 : 0}
                dataKey="value"
                strokeWidth={0}
                isAnimationActive
                animationBegin={0}
                animationDuration={900}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                style={{ cursor: 'pointer', outline: 'none' }}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.35}
                  />
                ))}
              </Pie>
              <Tooltip
                content={<CustomTooltip />}
                cursor={false}
                isAnimationActive={false}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* ── Animated center label ── */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={centerItem?.name}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-xl font-bold text-foreground tabular-nums leading-none">
                  {centerItem?.value}%
                </span>
                <span
                  className="text-[11px] text-muted-foreground text-center max-w-[72px]
                    truncate leading-tight"
                >
                  {centerItem?.name}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Legend list ── */}
        <div className="flex-1 w-full space-y-3.5">
          {data.map((entry, index) => (
            <LegendItem
              key={entry.name}
              name={entry.name}
              value={entry.value}
              color={entry.color}
              index={index}
              isActive={activeIndex === null || activeIndex === index}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
