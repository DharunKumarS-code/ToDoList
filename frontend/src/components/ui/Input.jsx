export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-[var(--text)]">{label}</label>}
      <input
        className={`w-full px-3 py-2 rounded-lg border text-sm bg-[var(--surface)] text-[var(--text)] border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
