import { useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useAuthStore } from '../store/authStore';
import { CheckCircle2, Clock, AlertTriangle, Plus, TrendingUp } from 'lucide-react';
import { isOverdue } from '../utils/constants';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function Dashboard() {
  const { tasks, fetchTasks } = useTaskStore();
  const { user } = useAuthStore();

  useEffect(() => { fetchTasks(); }, []);

  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const overdue = tasks.filter(t => isOverdue(t.dueDate, t.status)).length;
  const inprogress = tasks.filter(t => t.status === 'inprogress').length;
  const rate = total > 0 ? Math.round((done / total) * 100) : 0;

  const upcoming = tasks
    .filter(t => t.dueDate && t.status !== 'done')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const recent = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-sm text-[var(--muted)] mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
        <Link to="/tasks">
          <Button><Plus size={16} /> New Task</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks',   value: total,      icon: TrendingUp,   color: 'bg-indigo-500' },
          { label: 'Completed',     value: done,       icon: CheckCircle2, color: 'bg-green-500'  },
          { label: 'In Progress',   value: inprogress, icon: Clock,        color: 'bg-blue-500'   },
          { label: 'Overdue',       value: overdue,    icon: AlertTriangle,color: 'bg-red-500'    },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
              <Icon size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-[var(--text)]">{value}</p>
              <p className="text-xs text-[var(--muted)]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-[var(--text)]">Overall Completion</span>
          <span className="text-sm font-bold text-indigo-600">{rate}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
          <div className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700" style={{ width: `${rate}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[var(--text)] mb-4">Upcoming Deadlines</h2>
          {upcoming.length === 0
            ? <p className="text-sm text-[var(--muted)]">No upcoming tasks</p>
            : <div className="space-y-3">
                {upcoming.map(task => (
                  <div key={task._id} className="flex items-center justify-between">
                    <span className={`text-sm text-[var(--text)] truncate flex-1 ${isOverdue(task.dueDate, task.status) ? 'text-red-500' : ''}`}>{task.title}</span>
                    <span className="text-xs text-[var(--muted)] ml-2 shrink-0">{format(new Date(task.dueDate), 'MMM d')}</span>
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Recent */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[var(--text)] mb-4">Recently Added</h2>
          {recent.length === 0
            ? <p className="text-sm text-[var(--muted)]">No tasks yet</p>
            : <div className="space-y-3">
                {recent.map(task => (
                  <div key={task._id} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${task.status === 'done' ? 'bg-green-500' : task.status === 'inprogress' ? 'bg-blue-500' : 'bg-slate-400'}`} />
                    <span className={`text-sm text-[var(--text)] truncate ${task.status === 'done' ? 'line-through text-[var(--muted)]' : ''}`}>{task.title}</span>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
