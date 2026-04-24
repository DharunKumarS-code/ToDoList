import { useEffect, useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import TaskFilters from '../components/tasks/TaskFilters';
import Button from '../components/ui/Button';
import { Plus, Trash2, CheckCheck, MoveRight } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function TasksPage() {
  const { tasks, fetchTasks, loading, bulkAction, reorderTasks } = useTaskStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [selected, setSelected] = useState([]);

  useEffect(() => { fetchTasks(); }, []);

  const toggleSelect = (id) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const handleEdit = (task) => { setEditTask(task); setFormOpen(true); };
  const handleClose = () => { setFormOpen(false); setEditTask(null); };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(tasks);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    reorderTasks(reordered);
  };

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Tasks</h1>
          <p className="text-sm text-[var(--muted)]">{tasks.length} tasks total</p>
        </div>
        <Button onClick={() => setFormOpen(true)}><Plus size={16} /> New Task</Button>
      </div>

      {/* Filters */}
      <TaskFilters />

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">{selected.length} selected</span>
          <Button size="sm" variant="secondary" onClick={() => { bulkAction(selected, 'complete'); setSelected([]); }}>
            <CheckCheck size={14} /> Complete
          </Button>
          <Button size="sm" variant="secondary" onClick={() => { bulkAction(selected, 'move', { status: 'inprogress' }); setSelected([]); }}>
            <MoveRight size={14} /> In Progress
          </Button>
          <Button size="sm" variant="danger" onClick={() => { bulkAction(selected, 'delete'); setSelected([]); }}>
            <Trash2 size={14} /> Delete
          </Button>
          <button onClick={() => setSelected([])} className="ml-auto text-xs text-[var(--muted)] hover:text-[var(--text)]">Clear</button>
        </div>
      )}

      {/* Task list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-[var(--surface)] border border-[var(--border)] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-[var(--muted)]">No tasks found. Create your first task!</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                {tasks.map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                        className={snapshot.isDragging ? 'opacity-80 rotate-1' : ''}>
                        <TaskCard
                          task={task}
                          onEdit={handleEdit}
                          selected={selected.includes(task._id)}
                          onSelect={toggleSelect}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <TaskForm isOpen={formOpen} onClose={handleClose} editTask={editTask} />
    </div>
  );
}
