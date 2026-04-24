export default function Select({ label, options = [], className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-[var(--text)]">{label}</label>}
      <select
        className={`w-full px-3 py-2 rounded-lg border text-sm bg-[var(--surface)] text-[var(--text)] border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
