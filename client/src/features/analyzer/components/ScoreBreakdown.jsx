import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import SurfacePanel from '../../../components/ui/SurfacePanel';

const LABELS = [
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'community', label: 'Community' },
  { key: 'documentation', label: 'Docs' },
  { key: 'testing', label: 'Testing' },
  { key: 'popularity', label: 'Popularity' },
];

function buildChartRows(scores) {
  return LABELS.map(({ key, label }) => ({
    subject: label,
    value: typeof scores[key] === 'number' ? scores[key] : 0,
    fullMark: 100,
  }));
}

export default function ScoreBreakdown({ scores, loading, error }) {
  if (error || !scores) {
    return null;
  }

  if (loading) {
    return (
      <SurfacePanel padding="md">
        <p
          className="text-xs uppercase tracking-widest mb-4"
          style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}
        >
          Score breakdown
        </p>
        <Skeleton height={280} baseColor="var(--rv-bg-3)" highlightColor="var(--rv-border-2)" />
      </SurfacePanel>
    );
  }

  const data = buildChartRows(scores);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
    >
      <SurfacePanel padding="md">
        <p
          className="text-xs uppercase tracking-widest mb-2"
          style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}
        >
          Score breakdown
        </p>
        <p className="text-xs mb-4" style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-body)' }}>
          Dimensions scored 0–100
        </p>
        <div className="w-full" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid stroke="var(--rv-border-1)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: 'var(--rv-text-3)', fontSize: 11, fontFamily: 'var(--rv-font-mono)' }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tickCount={5}
                tick={{ fill: 'var(--rv-text-3)', fontSize: 10, fontFamily: 'var(--rv-font-mono)' }}
                stroke="var(--rv-border-1)"
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke="var(--rv-blue)"
                fill="var(--rv-blue)"
                fillOpacity={0.35}
                strokeWidth={2}
                isAnimationActive
                animationDuration={800}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </SurfacePanel>
    </motion.div>
  );
}
