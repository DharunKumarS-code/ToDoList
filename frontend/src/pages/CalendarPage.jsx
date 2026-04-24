import { useState } from 'react';
import CalendarView from '../components/calendar/CalendarView';
import { format } from 'date-fns';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../utils/constants';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayTasks, setDayTasks] = useState([]);

  const handleDateClick = (date, tasks) => {
    setSelectedDate(date);
    setDayTasks(tasks);
  };

  return (
    <div className="p-6 space-y-5 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Calendar</h1>
        <p className="text-sm text-[var(--muted)]">Click a date to see tasks</p>
      </div>

      <CalendarView onDateClick={handleDateClick} />

      <Modal
        isOpen={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        title={selectedDate ? `Tasks for ${format(selectedDate, 'MMMM d, yyyy')}` : ''}
      >
        {dayTasks.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No tasks on this day.</p>
        ) : (
          <div className="space-y-3">
            {dayTasks.map(task => (
              <div key={task._id} className="flex items-center justify-between p-3 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                <span className={`text-sm font-medium text-[var(--text)] ${task.status === 'done' ? 'line-through text-[var(--muted)]' : ''}`}>
                  {task.title}
                </span>
                <div className="flex gap-1.5">
                  <Badge className={`${PRIORITY_CONFIG[task.priority]?.bg} ${PRIORITY_CONFIG[task.priority]?.color}`}>
                    {PRIORITY_CONFIG[task.priority]?.label}
                  </Badge>
                  <Badge className={`${STATUS_CONFIG[task.status]?.bg} ${STATUS_CONFIG[task.status]?.color}`}>
                    {STATUS_CONFIG[task.status]?.label}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
