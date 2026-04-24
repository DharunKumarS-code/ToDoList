export const PRIORITY_CONFIG = {
  low:      { label: 'Low',      color: 'text-green-600',  bg: 'bg-green-100 dark:bg-green-900/30',  dot: 'bg-green-500'  },
  medium:   { label: 'Medium',   color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', dot: 'bg-yellow-500' },
  high:     { label: 'High',     color: 'text-red-600',    bg: 'bg-red-100 dark:bg-red-900/30',      dot: 'bg-red-500'    },
  critical: { label: 'Critical', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30', dot: 'bg-purple-500' },
};

export const STATUS_CONFIG = {
  todo:       { label: 'To Do',       color: 'text-slate-600',  bg: 'bg-slate-100 dark:bg-slate-700' },
  inprogress: { label: 'In Progress', color: 'text-blue-600',   bg: 'bg-blue-100 dark:bg-blue-900/30' },
  done:       { label: 'Done',        color: 'text-green-600',  bg: 'bg-green-100 dark:bg-green-900/30' },
};

export const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

export const isOverdue = (dueDate, status) =>
  dueDate && status !== 'done' && new Date(dueDate) < new Date();
