import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTaskStore } from '../../store/taskStore';
import { PRIORITY_CONFIG, STATUS_CONFIG, isOverdue } from '../../utils/constants';
import { format } from 'date-fns';
import { Calendar, GripVertical } from 'lucide-react';
import Badge from '../ui/Badge';

const COLUMNS = ['todo', 'inprogress', 'done'];

export default function KanbanBoard({ onEdit }) {
  const { tasks, updateTask } = useTaskStore();

  const getColumnTasks = (status) =>
    tasks.filter(t => t.status === status).sort((a, b) => a.order - b.order);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    await updateTask(draggableId, { status: destination.droppableId });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(col => {
          const colTasks = getColumnTasks(col);
          const config = STATUS_CONFIG[col];
          return (
            <div key={col} className="flex-shrink-0 w-72">
              <div className={`flex items-center justify-between px-3 py-2 rounded-t-xl ${config.bg}`}>
                <span className={`text-sm font-semibold ${config.color}`}>{config.label}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/50 ${config.color}`}>{colTasks.length}</span>
              </div>
              <Droppable droppableId={col}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-32 p-2 space-y-2 rounded-b-xl border border-t-0 border-[var(--border)] transition-colors ${snapshot.isDraggingOver ? 'bg-indigo-50 dark:bg-indigo-900/10' : 'bg-[var(--surface)]'}`}
                  >
                    {colTasks.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-[var(--bg)] border border-[var(--border)] rounded-lg p-3 cursor-pointer transition-shadow ${snapshot.isDragging ? 'shadow-lg rotate-1' : 'hover:shadow-md'} ${isOverdue(task.dueDate, task.status) ? 'border-l-4 border-l-red-500' : ''}`}
                            onClick={() => onEdit(task)}
                          >
                            <div className="flex items-start gap-2">
                              <div {...provided.dragHandleProps} className="mt-0.5 text-[var(--muted)] hover:text-[var(--text)]">
                                <GripVertical size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium text-[var(--text)] ${task.status === 'done' ? 'line-through text-[var(--muted)]' : ''}`}>
                                  {task.title}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  <Badge className={`${PRIORITY_CONFIG[task.priority].bg} ${PRIORITY_CONFIG[task.priority].color}`}>
                                    {PRIORITY_CONFIG[task.priority].label}
                                  </Badge>
                                  {task.dueDate && (
                                    <span className={`flex items-center gap-1 text-xs ${isOverdue(task.dueDate, task.status) ? 'text-red-500' : 'text-[var(--muted)]'}`}>
                                      <Calendar size={10} />
                                      {format(new Date(task.dueDate), 'MMM d')}
                                    </span>
                                  )}
                                </div>
                                {task.subtasks?.length > 0 && (
                                  <div className="mt-2">
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1">
                                      <div
                                        className="h-1 rounded-full bg-indigo-500"
                                        style={{ width: `${task.progress}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-[var(--muted)]">
                                      {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
