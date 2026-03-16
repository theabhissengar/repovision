export default function InfoTooltip({ text }) {
  return (
    <span className="relative group inline-flex items-center ml-1.5">
      <span className="w-4 h-4 rounded-full border border-border-strong text-muted-foreground text-[10px] font-bold flex items-center justify-center cursor-help transition-colors group-hover:border-primary group-hover:text-primary">
        ?
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg bg-card border border-border px-3 py-2 text-xs text-card-foreground leading-relaxed shadow-lg opacity-0 scale-95 transition-all group-hover:opacity-100 group-hover:scale-100">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-border" />
      </span>
    </span>
  );
}
