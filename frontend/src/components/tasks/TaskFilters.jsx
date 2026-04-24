import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import Select from '../ui/Select';
import Button from '../ui/Button';

const PRIORITY_OPTS = [{ value: '', label: 'All Priorities' }, { value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'critical', label: 'Critical' }];
const STATUS_OPTS = [{ value: '', label: 'All Statuses' }, { value: 'todo', label: 'To Do' }, { value: 'inprogress', label: 'In Progress' }, { value: 'done', label: 'Done' }];

export default function TaskFilters() {
  const { filters, setFilters, clearFilters } = useTaskStore();
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
        <input
          value={filters.search}
          onChange={e => setFilters({ search: e.target.value })}
          placeholder="Search tasks..."
          className="pl-8 pr-3 py-2 rounded-lg border text-sm bg-[var(--surface)] text-[var(--text)] border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-indigo-500 w-52"
        />
      </div>
      <Select options={STATUS_OPTS} value={filters.status} onChange={e => setFilters({ status: e.target.value })} className="w-36" />
      <Select options={PRIORITY_OPTS} value={filters.priority} onChange={e => setFilters({ priority: e.target.value })} className="w-36" />
      <input
        value={filters.category}
        onChange={e => setFilters({ category: e.target.value })}
        placeholder="Category..."
        className="px-3 py-2 rounded-lg border text-sm bg-[var(--surface)] text-[var(--text)] border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-indigo-500 w-32"
      />
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X size={14} /> Clear
        </Button>
      )}
    </div>
  );
}
