const colors = {
  violet: 'bg-primary/10 text-primary border-primary/25',
  green:  'bg-green-500/10 text-green-600 border-green-500/25 dark:text-green-400',
  yellow: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/25 dark:text-yellow-400',
  red:    'bg-red-500/10 text-red-600 border-red-500/25 dark:text-red-400',
  gray:   'bg-muted text-muted-foreground border-border',
};

export default function Badge({ children, color = 'gray', className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}
