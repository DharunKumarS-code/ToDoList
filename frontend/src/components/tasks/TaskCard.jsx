import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Tag, Trash2, Edit2, Play, Square, ChevronDown, ChevronUp, CheckCircle2, Circle } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { tasksAPI } from '../../api';
import { PRIORITY_CONFIG, STATUS_CONFIG, formatDuration, isOverdue } from '../../utils/constants';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';
import toast from 'react-hot-toast';

export default function TaskCard({ task, onEdit, selected, onSelect }) {
  const { deleteTask, updateTask, fetchTasks } = useTaskStore();
  const [expanded, setExpanded] = useState(false);
  const [timerRunning, setTimerRunning] = useState(task.isTimerRunning);
  const [timeSpent, setTimeSpent] = useState(task.totalTimeSpent || 0);

  const priority = PRIORITY_CONFIG[task.priority];
  const status = STATUS_CONFIG[task.status];
  const overdue = isOverdue(task.dueDate, task.status);

  const toggleComplete = () =>
    updateTask(task._id, { status: task.status === 'done' ? 'todo' : 'done', progress: task.status === 'done' ? 0 : 100 });

  const handleTimer = async () => {
    try {
      if (timerRunning) {
        const { data } = await tasksAPI.stopTimer(task._id);
        setTimeSpent(data.totalTimeSpent);
        setTimerRunning(false);
        toast.success('Timer stopped');
      } else {
        await tasksAPI.startTimer(task._id);
        setTimerRunning(true);
        toast.success('Timer started');
      }
    } catch {
      toast.error('Timer error');
    }
  };

  return (
    <div className={`group bg-[var(--surface)] border rounded-xl p-4 transition-all hover:shadow-md ${
      selected ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800' : 'border-[var(--border)]'
    } ${overdue ? 'border-l-4 border-l-red-500' : ''}`}>
      <div className="flex items-start gap-3">
        {/* Checkbox select */}
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(task._id)}
          className="mt-1 rounded accent-indigo-600 cursor-pointer"
        />

        {/* Complete toggle */}
        <button onClick={toggleComplete} className="mt-0.5 shrink-0 text-[var(--muted)] hover:text-indigo-600 transition">
          {task.status === 'done'
            ? <CheckCircle2 size={20} className="text-green-500" />
            : <Circle size={20} />}
        </button>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <p className={`font-medium text-sm text-[var(--text)] ${task.status === 'done' ? 'line-through text-[var(--muted)]' : ''}`}>
            {task.title}
          </p>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">{task.description}</p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Badge className={`${priority.bg} ${priority.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${priority.dot} mr-1`} />
              {priority.label}
            </Badge>
            <Badge className={`${status.bg} ${status.color}`}>{status.label}</Badge>
            {task.category && (
              <Badge className="bg-slate-100 dark:bg-slate-700 text-[var(--muted)]">
                <Tag size={10} className="mr-1" />{task.category}
              </Badge>
            )}
            {overdue && <Badge className="bg-red-100 dark:bg-red-900/30 text-red-600">Overdue</Badge>}
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[var(--muted)]">
            {task.dueDate && (
              <span className={`flex items-center gap-1 ${overdue ? 'text-red-500' : ''}`}>
                <Calendar size={12} />
                {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </span>
            )}
            {timeSpent > 0 && (
              <span className="flex items-center gap-1">
                <Clock size={12} />{formatDuration(timeSpent)}
              </span>
            )}
            {task.subtasks?.length > 0 && (
              <span>{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks</span>
            )}
          </div>

          {/* Progress */}
          {task.progress > 0 && (
            <div className="mt-2">
              <ProgressBar value={task.progress} />
              <span className="text-xs text-[var(--muted)]">{task.progress}%</span>
            </div>
          )}

          {/* Tags */}
          {task.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map(tag => (
                <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600">#{tag}</span>
              ))}
            </div>
          )}

          {/* Subtasks expanded */}
          {expanded && task.subtasks?.length > 0 && (
            <div className="mt-3 space-y-1.5 pl-2 border-l-2 border-[var(--border)]">
              {task.subtasks.map(sub => (
                <div key={sub._id} className="flex items-center gap-2 text-xs text-[var(--muted)]">
                  {sub.completed
                    ? <CheckCircle2 size={12} className="text-green-500" />
                    : <Circle size={12} />}
                  <span className={sub.completed ? 'line-through' : ''}>{sub.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <button onClick={handleTimer} title={timerRunning ? 'Stop timer' : 'Start timer'}
            className={`p-1.5 rounded-lg transition ${timerRunning ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-[var(--muted)] hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
            {timerRunning ? <Square size={14} /> : <Play size={14} />}
          </button>
          <button onClick={() => onEdit(task)} className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-slate-100 dark:hover:bg-slate-700 transition">
            <Edit2 size={14} />
          </button>
          <button onClick={() => deleteTask(task._id)} className="p-1.5 rounded-lg text-[var(--muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
            <Trash2 size={14} />
          </button>
          {task.subtasks?.length > 0 && (
            <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-slate-100 dark:hover:bg-slate-700 transition">
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
