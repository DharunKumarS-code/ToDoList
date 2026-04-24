import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import KanbanPage from './pages/KanbanPage';
import CalendarPage from './pages/CalendarPage';
import AnalyticsPage from './pages/AnalyticsPage';

function PrivateRoute({ children }) {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { token } = useAuthStore();
  return !token ? children : <Navigate to="/" replace />;
}

export default function App() {
  const { init, user } = useAuthStore();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (user) {
      document.documentElement.classList.toggle('dark', user.theme === 'dark');
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' } }} />
      <Routes>
        <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index          element={<Dashboard />}    />
          <Route path="tasks"   element={<TasksPage />}    />
          <Route path="kanban"  element={<KanbanPage />}   />
          <Route path="calendar"element={<CalendarPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
