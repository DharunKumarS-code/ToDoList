export default function ProgressBar({ value = 0, className = '' }) {
  return (
    <div className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 ${className}`}>
      <div
        className="h-1.5 rounded-full bg-indigo-500 transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
