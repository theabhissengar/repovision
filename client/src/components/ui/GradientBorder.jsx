/**
 * Renders a conic/linear gradient border around children.
 * Uses CSS mask-image technique so the interior remains transparent.
 *
 * Props:
 *   gradient   string  — CSS gradient value (default: blue → cyan)
 *   radius     string  — border radius (default: '12px')
 *   thickness  number  — border thickness in px (default: 1)
 *   className  string
 *   children
 */

export default function GradientBorder({
  gradient = 'linear-gradient(135deg, var(--rv-blue), var(--rv-cyan))',
  radius = '12px',
  thickness = 1,
  className = '',
  children,
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{ borderRadius: radius }}
    >
      {/* Gradient border ring */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius,
          padding: `${thickness}px`,
          background: gradient,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          pointerEvents: 'none',
        }}
      />
      {children}
    </div>
  );
}

/**
 * Horizontal gradient divider line.
 */
export function GradientDivider({ color = 'blue', className = '' }) {
  const gradients = {
    blue:  'linear-gradient(90deg, transparent, var(--rv-blue), transparent)',
    cyan:  'linear-gradient(90deg, transparent, var(--rv-cyan), transparent)',
    dim:   'linear-gradient(90deg, transparent, var(--rv-border-2), transparent)',
  };

  return (
    <div
      className={`h-px opacity-50 ${className}`}
      style={{ background: gradients[color] ?? gradients.blue }}
    />
  );
}
