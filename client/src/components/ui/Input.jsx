export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-300">{label}</label>
      )}
      <input
        className={`w-full bg-gray-800 border rounded-lg px-4 py-2.5 text-white placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors
          ${error ? 'border-red-500' : 'border-gray-700 hover:border-gray-600'}
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
