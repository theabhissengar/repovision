import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SurfacePanel from '../../../components/ui/SurfacePanel';

function BulletItem({ text, dotColor }) {
  return (
    <li className="flex gap-3 text-sm leading-relaxed">
      <span
        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: dotColor }}
      />
      <span style={{ color: 'var(--rv-text-2)', fontFamily: 'var(--rv-font-body)' }}>{text}</span>
    </li>
  );
}

export default function InsightList({ report, loading, error }) {
  if (error) {
    return null;
  }

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-5">
        <SurfacePanel padding="md">
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}
          >
            Key insights
          </p>
          <Skeleton count={4} baseColor="var(--rv-bg-3)" highlightColor="var(--rv-border-2)" />
        </SurfacePanel>
        <SurfacePanel padding="md">
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}
          >
            Suggestions
          </p>
          <Skeleton count={4} baseColor="var(--rv-bg-3)" highlightColor="var(--rv-border-2)" />
        </SurfacePanel>
      </div>
    );
  }

  if (!report) return null;

  const insights = Array.isArray(report.insights) ? report.insights : [];
  const suggestions = Array.isArray(report.suggestions) ? report.suggestions : [];

  if (insights.length === 0 && suggestions.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="grid md:grid-cols-2 gap-5"
    >
      <SurfacePanel padding="md">
        <p
          className="text-xs uppercase tracking-widest mb-3"
          style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}
        >
          Key insights
        </p>
        {insights.length > 0 ? (
          <ul className="space-y-2.5">
            {insights.map((item, i) => (
              <BulletItem key={i} text={item} dotColor="var(--rv-cyan)" />
            ))}
          </ul>
        ) : (
          <p className="text-sm" style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-body)' }}>
            No insights returned.
          </p>
        )}
      </SurfacePanel>

      <SurfacePanel padding="md">
        <p
          className="text-xs uppercase tracking-widest mb-3"
          style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}
        >
          Suggestions
        </p>
        {suggestions.length > 0 ? (
          <ul className="space-y-2.5">
            {suggestions.map((item, i) => (
              <BulletItem key={i} text={item} dotColor="var(--rv-amber)" />
            ))}
          </ul>
        ) : (
          <p className="text-sm" style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-body)' }}>
            No suggestions returned.
          </p>
        )}
      </SurfacePanel>
    </motion.div>
  );
}
