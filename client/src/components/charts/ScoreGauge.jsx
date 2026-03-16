import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Animated SVG arc gauge (180° half-ring), score 0–10.
 * Color-coded: green ≥8, blue ≥6, amber ≥4, rose <4.
 *
 * Props:
 *   score   number  0–10
 *   size    'sm' | 'md' | 'lg'  (default: 'md')
 *   label   string  — shown below the score (default: auto from score)
 */

const SCORE_COLOR = (score) => {
  if (score >= 8) return 'var(--rv-green)';
  if (score >= 6) return 'var(--rv-blue)';
  if (score >= 4) return 'var(--rv-amber)';
  return 'var(--rv-rose)';
};

const SCORE_LABEL = (score) => {
  if (score >= 8) return 'Excellent';
  if (score >= 6) return 'Good';
  if (score >= 4) return 'Fair';
  return 'Needs Work';
};

const SIZES = {
  sm: { w: 120, r: 44, sw: 7, fontSize: 20, subSize: 10 },
  md: { w: 160, r: 60, sw: 9, fontSize: 28, subSize: 11 },
  lg: { w: 200, r: 76, sw: 11, fontSize: 36, subSize: 13 },
};

function CountUp({ value, fontSize }) {
  const displayRef = useRef(null);
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { damping: 40, stiffness: 150 });

  useEffect(() => { mv.set(value); }, [value, mv]);

  useEffect(() => {
    const unsub = spring.on('change', (v) => {
      if (displayRef.current) {
        displayRef.current.textContent = v.toFixed(1);
      }
    });
    return unsub;
  }, [spring]);

  return (
    <text
      ref={displayRef}
      textAnchor="middle"
      dominantBaseline="central"
      fill="var(--rv-text-1)"
      fontSize={fontSize}
      fontWeight={700}
      fontFamily="var(--rv-font-display)"
    >
      {value.toFixed(1)}
    </text>
  );
}

export default function ScoreGauge({ score = 0, size = 'md', label }) {
  const { w, r, sw, fontSize } = SIZES[size] ?? SIZES.md;
  const h = w * 0.62; // Half ring needs a bit less height
  const cx = w / 2;
  const cy = h * 0.88; // push arc center down

  // Half circle arc
  const circumference = Math.PI * r; // half circle
  const filled = (score / 10) * circumference;
  const empty = circumference - filled;

  const color = SCORE_COLOR(score);
  const autoLabel = label ?? SCORE_LABEL(score);
  const filterId = `gauge-glow-${size}`;

  return (
    <div className="flex flex-col items-center" role="img" aria-label={`Score: ${score}/10 — ${autoLabel}`}>
      <motion.svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        overflow="visible"
      >
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="coloredBlur"
            />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track arc */}
        <path
          d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
          fill="none"
          stroke="var(--rv-border-1)"
          strokeWidth={sw}
          strokeLinecap="round"
        />

        {/* Filled arc */}
        <motion.path
          d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: empty }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          filter={`url(#${filterId})`}
          style={{ stroke: color }}
        />

        {/* Score number (no "/10" suffix to avoid overlap artifacts) */}
        <g transform={`translate(${cx}, ${cy - sw * 0.5 - 10})`}>
          <CountUp value={score} fontSize={fontSize} />
        </g>
      </motion.svg>

      {/* Label */}
      <motion.span
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="text-xs font-medium tracking-wide uppercase"
        style={{
          color,
          fontFamily: 'var(--rv-font-mono)',
          letterSpacing: '0.08em',
          marginTop: `-${sw}px`,
        }}
      >
        {autoLabel}
      </motion.span>
    </div>
  );
}
