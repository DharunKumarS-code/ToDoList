import { create } from 'zustand';
import { tasksAPI } from '../api';
import toast from 'react-hot-toast';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  filters: { status: '', priority: '', search: '', category: '', project: '' },

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const { data } = await tasksAPI.getAll(get().filters);
      set({ tasks: data.tasks, loading: false });
    } catch (err) {
      toast.error('Failed to load tasks');
      set({ loading: false });
    }
  },

  createTask: async (taskData) => {
    try {
      const { data } = await tasksAPI.create(taskData);
      set({ tasks: [data.task, ...get().tasks] });
      toast.success('Task created');
      return data.task;
    } catch (err) {
      toast.error('Failed to create task');
    }
  },

  updateTask: async (id, updates) => {
    try {
      const { data } = await tasksAPI.update(id, updates);
      set({ tasks: get().tasks.map((t) => (t._id === id ? data.task : t)) });
      toast.success('Task updated');
    } catch (err) {
      toast.error('Failed to update task');
    }
  },

  deleteTask: async (id) => {
    try {
      await tasksAPI.delete(id);
      set({ tasks: get().tasks.filter((t) => t._id !== id) });
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  },

  bulkAction: async (ids, action, data) => {
    try {
      await tasksAPI.bulk({ ids, action, data });
      await get().fetchTasks();
      toast.success(`Bulk ${action} applied`);
    } catch (err) {
      toast.error('Bulk action failed');
    }
  },

  reorderTasks: async (reordered) => {
    const prev = get().tasks;
    set({ tasks: reordered });
    try {
      await tasksAPI.reorder(reordered.map((t, i) => ({ id: t._id, order: i })));
    } catch {
      set({ tasks: prev });
      toast.error('Reorder failed');
    }
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
    get().fetchTasks();
  },

  clearFilters: () => {
    set({ filters: { status: '', priority: '', search: '', category: '', project: '' } });
    get().fetchTasks();
  },
}));
