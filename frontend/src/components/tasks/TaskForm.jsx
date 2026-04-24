import { useState, useEffect } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { tasksAPI } from '../../api';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];
const STATUSES = [
  { value: 'todo', label: 'To Do' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const EMPTY = { title: '', description: '', priority: 'medium', status: 'todo', category: 'General', project: 'Personal', dueDate: '', dueTime: '', tags: [] };

export default function TaskForm({ isOpen, onClose, editTask }) {
  const { createTask, updateTask } = useTaskStore();
  const [form, setForm] = useState(EMPTY);
  const [tagInput, setTagInput] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title || '',
        description: editTask.description || '',
        priority: editTask.priority || 'medium',
        status: editTask.status || 'todo',
        category: editTask.category || 'General',
        project: editTask.project || 'Personal',
        dueDate: editTask.dueDate ? editTask.dueDate.split('T')[0] : '',
        dueTime: editTask.dueTime || '',
        tags: editTask.tags || [],
      });
      setSubtasks(editTask.subtasks || []);
    } else {
      setForm(EMPTY);
      setSubtasks([]);
    }
  }, [editTask, isOpen]);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) setForm(f => ({ ...f, tags: [...f.tags, t] }));
    setTagInput('');
  };

  const addSubtask = () => {
    if (subtaskInput.trim()) {
      setSubtasks(s => [...s, { title: subtaskInput.trim(), completed: false }]);
      setSubtaskInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    setLoading(true);
    try {
      const payload = { ...form, subtasks };
      if (editTask) {
        await updateTask(editTask._id, payload);
      } else {
        await createTask(payload);
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editTask ? 'Edit Task' : 'New Task'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title *" value={form.title} onChange={set('title')} placeholder="Task title..." />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--text)]">Description</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={3}
            placeholder="Add details..."
            className="w-full px-3 py-2 rounded-lg border text-sm bg-[var(--surface)] text-[var(--text)] border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select label="Priority" value={form.priority} onChange={set('priority')} options={PRIORITIES} />
          <Select label="Status" value={form.status} onChange={set('status')} options={STATUSES} />
          <Input label="Category" value={form.category} onChange={set('category')} placeholder="e.g. Work" />
          <Input label="Project" value={form.project} onChange={set('project')} placeholder="e.g. Personal" />
          <Input label="Due Date" type="date" value={form.dueDate} onChange={set('dueDate')} />
          <Input label="Due Time" type="time" value={form.dueTime} onChange={set('dueTime')} />
        </div>

        {/* Tags */}
        <div>
          <label className="text-sm font-medium text-[var(--text)]">Tags</label>
          <div className="flex gap-2 mt-1">
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add tag + Enter"
              className="flex-1 px-3 py-2 rounded-lg border text-sm bg-[var(--surface)] text-[var(--text)] border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button type="button" variant="secondary" size="sm" onClick={addTag}><Plus size={14} /></Button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {form.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600">
                #{tag}
                <button type="button" onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))}><X size={10} /></button>
              </span>
            ))}
          </div>
        </div>

        {/* Subtasks */}
        <div>
          <label className="text-sm font-medium text-[var(--text)]">Subtasks</label>
          <div className="flex gap-2 mt-1">
            <input
              value={subtaskInput}
              onChange={e => setSubtaskInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
              placeholder="Add subtask + Enter"
              className="flex-1 px-3 py-2 rounded-lg border text-sm bg-[var(--surface)] text-[var(--text)] border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button type="button" variant="secondary" size="sm" onClick={addSubtask}><Plus size={14} /></Button>
          </div>
          <div className="mt-2 space-y-1">
            {subtasks.map((sub, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                {sub.title}
                <button type="button" onClick={() => setSubtasks(s => s.filter((_, j) => j !== i))} className="ml-auto text-red-400 hover:text-red-600">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : editTask ? 'Update Task' : 'Create Task'}</Button>
        </div>
      </form>
    </Modal>
  );
}
