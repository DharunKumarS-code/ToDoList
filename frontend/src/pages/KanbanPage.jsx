import { useEffect, useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import KanbanBoard from '../components/kanban/KanbanBoard';
import TaskForm from '../components/tasks/TaskForm';
import Button from '../components/ui/Button';
import { Plus } from 'lucide-react';

export default function KanbanPage() {
  const { fetchTasks } = useTaskStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => { fetchTasks(); }, []);

  const handleEdit = (task) => { setEditTask(task); setFormOpen(true); };
  const handleClose = () => { setFormOpen(false); setEditTask(null); };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Kanban Board</h1>
          <p className="text-sm text-[var(--muted)]">Drag tasks to update status</p>
        </div>
        <Button onClick={() => setFormOpen(true)}><Plus size={16} /> New Task</Button>
      </div>
      <KanbanBoard onEdit={handleEdit} />
      <TaskForm isOpen={formOpen} onClose={handleClose} editTask={editTask} />
    </div>
  );
}
