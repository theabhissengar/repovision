export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <input
        className={`w-full bg-card border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-primary transition-colors
          ${error ? 'border-red-500' : 'border-border hover:border-border-strong'}
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
}
