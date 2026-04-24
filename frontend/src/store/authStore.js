import { create } from 'zustand';
import { authAPI } from '../api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: true,

  init: async () => {
    const token = localStorage.getItem('token');
    if (!token) return set({ loading: false });
    try {
      const { data } = await authAPI.getMe();
      set({ user: data.user, loading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, loading: false });
    }
  },

  login: async (credentials) => {
    const { data } = await authAPI.login(credentials);
    localStorage.setItem('token', data.token);
    set({ user: data.user, token: data.token });
  },

  register: async (credentials) => {
    const { data } = await authAPI.register(credentials);
    localStorage.setItem('token', data.token);
    set({ user: data.user, token: data.token });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  toggleTheme: async () => {
    const { user } = useAuthStore.getState();
    const newTheme = user.theme === 'light' ? 'dark' : 'light';
    await authAPI.updateTheme(newTheme);
    set({ user: { ...user, theme: newTheme } });
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  },
}));
