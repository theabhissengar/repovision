export default function InfoTooltip({ text }) {
  return (
    <span className="relative group inline-flex items-center ml-1.5">
      <span className="w-4 h-4 rounded-full border border-gray-600 text-gray-500 text-[10px] font-bold flex items-center justify-center cursor-help transition-colors group-hover:border-violet-400 group-hover:text-violet-400">
        ?
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-xs text-gray-300 leading-relaxed shadow-lg opacity-0 scale-95 transition-all group-hover:opacity-100 group-hover:scale-100">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-700" />
      </span>
    </span>
  );
}
