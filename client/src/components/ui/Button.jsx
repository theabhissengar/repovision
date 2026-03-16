const variants = {
  primary:   'bg-primary hover:bg-primary/90 text-primary-foreground ' +
             'hover:shadow-[0_4px_14px_rgba(139,92,246,0.35)] active:scale-[0.97]',
  secondary: 'bg-secondary hover:bg-border text-secondary-foreground active:scale-[0.97]',
  ghost:     'bg-transparent hover:bg-secondary text-muted-foreground hover:text-foreground active:scale-[0.97]',
  danger:    'bg-red-600 hover:bg-red-700 text-white active:scale-[0.97]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3 text-lg',
};

/**
 * @param {{ variant?: keyof variants, size?: keyof sizes, loading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>} props
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
        cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
