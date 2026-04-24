import api from './axios';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateTheme: (theme) => api.put('/auth/theme', { theme }),
};

export const tasksAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  getOne: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  bulk: (data) => api.post('/tasks/bulk', data),
  reorder: (tasks) => api.put('/tasks/reorder', { tasks }),
  addSubtask: (id, title) => api.post(`/tasks/${id}/subtasks`, { title }),
  updateSubtask: (id, subId, data) => api.put(`/tasks/${id}/subtasks/${subId}`, data),
  deleteSubtask: (id, subId) => api.delete(`/tasks/${id}/subtasks/${subId}`),
  addComment: (id, text) => api.post(`/tasks/${id}/comments`, { text }),
  startTimer: (id) => api.post(`/tasks/${id}/timer/start`),
  stopTimer: (id) => api.post(`/tasks/${id}/timer/stop`),
  getCalendar: (startDate, endDate) => api.get('/tasks/calendar', { params: { startDate, endDate } }),
  getAnalytics: () => api.get('/tasks/analytics'),
};
