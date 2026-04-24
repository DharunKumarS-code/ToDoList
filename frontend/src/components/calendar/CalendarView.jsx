import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { tasksAPI } from '../../api';
import { PRIORITY_CONFIG } from '../../utils/constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarView({ onDateClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCalendar();
  }, [currentDate]);

  const fetchCalendar = async () => {
    setLoading(true);
    try {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const { data } = await tasksAPI.getCalendar(start.toISOString(), end.toISOString());
      setGrouped(data.grouped);
    } catch {
      setGrouped({});
    } finally {
      setLoading(false);
    }
  };

  const renderDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const d = day;
        const key = format(d, 'yyyy-MM-dd');
        const dayTasks = grouped[key] || [];
        const inMonth = isSameMonth(d, currentDate);

        week.push(
          <div
            key={key}
            onClick={() => onDateClick && onDateClick(d, dayTasks)}
            className={`min-h-24 p-1.5 border-b border-r border-[var(--border)] cursor-pointer transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/10 ${!inMonth ? 'opacity-30' : ''} ${isToday(d) ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
          >
            <div className={`text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full ${isToday(d) ? 'bg-indigo-600 text-white' : 'text-[var(--text)]'}`}>
              {format(d, 'd')}
            </div>
            <div className="space-y-0.5">
              {dayTasks.slice(0, 3).map(task => (
                <div
                  key={task._id}
                  className={`text-xs px-1.5 py-0.5 rounded truncate ${
                    task.status === 'done'
                      ? 'bg-slate-200 dark:bg-slate-700 text-[var(--muted)] line-through'
                      : `${PRIORITY_CONFIG[task.priority]?.bg} ${PRIORITY_CONFIG[task.priority]?.color}`
                  }`}
                  title={task.title}
                >
                  {task.title}
                </div>
              ))}
              {dayTasks.length > 3 && (
                <div className="text-xs text-[var(--muted)] px-1">+{dayTasks.length - 3} more</div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div key={day.toString()} className="grid grid-cols-7">{week}</div>);
    }
    return rows;
  };

  return (
    <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <h2 className="text-base font-semibold text-[var(--text)]">{format(currentDate, 'MMMM yyyy')}</h2>
        <div className="flex gap-1">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-[var(--muted)] transition">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-[var(--muted)] transition">Today</button>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-[var(--muted)] transition">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-[var(--border)]">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="py-2 text-center text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center text-[var(--muted)]">Loading...</div>
      ) : (
        <div>{renderDays()}</div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-5 py-3 border-t border-[var(--border)]">
        {Object.entries(PRIORITY_CONFIG).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <span className={`w-2.5 h-2.5 rounded-full ${val.dot}`} />
            {val.label}
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />Completed
        </div>
      </div>
    </div>
  );
}
