import { motion } from 'framer-motion';

/**
 * Repo health indicator bars.
 * Derives 4 scores from raw repo stats.
 *
 * Props:
 *   stars             number
 *   forks             number
 *   openIssues        number
 *   commitsLast30Days number
 *   contributors      number
 *   updatedAt         string (ISO date)
 */

function deriveHealth({
  stars = 0,
  forks = 0,
  openIssues = 0,
  commitsLast30Days = 0,
  contributors = 0,
  updatedAt,
}) {
  // Activity: based on commits/month (0–100)
  const activity = Math.min(100, Math.round((commitsLast30Days / 60) * 100));

  // Popularity: logarithmic scale on stars (0–100)
  const starScore = Math.min(100, Math.round((Math.log10(stars + 1) / Math.log10(100000)) * 100));
  const forkBonus = Math.min(20, Math.round((Math.log10(forks + 1) / Math.log10(10000)) * 20));
  const popularity = Math.min(100, starScore + forkBonus);

  // Maintenance: recency of last update + open issues ratio
  let maintenance = 50;
  if (updatedAt) {
    const daysSince = (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24);
    maintenance = Math.max(0, Math.min(100, Math.round(100 - (daysSince / 365) * 80)));
  }
  if (openIssues > 0 && stars > 0) {
    const issueRatio = openIssues / (stars + 1);
    maintenance = Math.max(0, maintenance - Math.min(30, Math.round(issueRatio * 40)));
  }

  // Community: contributors + forks
  const community = Math.min(100, Math.round(
    (Math.log10(contributors + 1) / Math.log10(500)) * 60 +
    (Math.log10(forks + 1) / Math.log10(5000)) * 40
  ));

  return [
    { label: 'Activity',    value: activity,   color: 'var(--rv-cyan)',   glow: 'rgba(34,211,238,0.4)' },
    { label: 'Popularity',  value: popularity, color: 'var(--rv-amber)',  glow: 'rgba(251,191,36,0.4)' },
    { label: 'Maintenance', value: maintenance,color: 'var(--rv-blue)',   glow: 'rgba(74,158,255,0.4)' },
    { label: 'Community',   value: community,  color: 'var(--rv-green)',  glow: 'rgba(52,211,153,0.4)' },
  ];
}

function Bar({ label, value, color, glow, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--rv-text-2)', fontFamily: 'var(--rv-font-mono)' }}>
          {label}
        </span>
        <span className="text-xs font-bold tabular-nums" style={{ color, fontFamily: 'var(--rv-font-mono)' }}>
          {value}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: 'var(--rv-bg-3)' }}
      >
        <motion.div
          className="h-full rounded-full origin-left"
          style={{
            width: `${value}%`,
            background: color,
            boxShadow: `0 0 8px ${glow}`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: 0.7,
            delay: index * 0.07 + 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </div>
    </motion.div>
  );
}

export default function HealthIndicators(props) {
  const indicators = deriveHealth(props);

  return (
    <div className="space-y-3.5">
      {indicators.map((bar, i) => (
        <Bar key={bar.label} {...bar} index={i} />
      ))}
    </div>
  );
}
