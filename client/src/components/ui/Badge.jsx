const colors = {
  violet: 'bg-violet-600/20 text-violet-400 border-violet-600/30',
  green: 'bg-green-600/20 text-green-400 border-green-600/30',
  yellow: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  red: 'bg-red-600/20 text-red-400 border-red-600/30',
  gray: 'bg-gray-700/50 text-gray-400 border-gray-600/30',
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
