export default function Card({ children, className = '', hoverable = false }) {
  return (
    <div
      className={`bg-card border border-border rounded-xl p-6
        ${hoverable
          ? 'transition-all duration-200 ease-out cursor-default ' +
            'hover:-translate-y-0.5 hover:border-border-strong ' +
            'hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] ' +
            'dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.28)]'
          : ''}
        ${className}`}
    >
      {children}
    </div>
  );
}
