import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion';
import { formatNumber } from '../../utils/formatters';

/**
 * Count-up animated number using framer-motion springs.
 *
 * Props:
 *   value       number  — target value
 *   format      'number' | 'decimal' | 'raw'  (default: 'number' — uses formatNumber)
 *   decimals    number  — decimal places for 'decimal' format (default: 1)
 *   duration    number  — spring duration hint (default: 1.2)
 *   className   string
 */

export default function AnimatedNumber({
  value = 0,
  format = 'number',
  decimals = 1,
  duration = 1.2,
  className = '',
}) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 200,
    duration,
  });
  const displayRef = useRef(null);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (displayRef.current) {
        let display;
        if (format === 'number') {
          display = formatNumber(Math.round(latest));
        } else if (format === 'decimal') {
          display = latest.toFixed(decimals);
        } else {
          display = String(Math.round(latest));
        }
        displayRef.current.textContent = display;
      }
    });
    return unsubscribe;
  }, [springValue, format, decimals]);

  const initialDisplay =
    format === 'number'
      ? formatNumber(value)
      : format === 'decimal'
      ? value.toFixed(decimals)
      : String(value);

  return (
    <span ref={displayRef} className={className}>
      {initialDisplay}
    </span>
  );
}
