import { NavLink } from 'react-router-dom';
import { CheckSquare, LayoutDashboard, Calendar, Kanban, BarChart2, LogOut, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const links = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks',     icon: CheckSquare,     label: 'Tasks'     },
  { to: '/kanban',    icon: Kanban,          label: 'Kanban'    },
  { to: '/calendar',  icon: Calendar,        label: 'Calendar'  },
  { to: '/analytics', icon: BarChart2,       label: 'Analytics' },
];

export default function Sidebar() {
  const { user, logout, toggleTheme } = useAuthStore();

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col bg-[var(--surface)] border-r border-[var(--border)]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <CheckSquare size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg text-[var(--text)]">TaskFlow</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-slate-100 dark:hover:bg-slate-700'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[var(--border)] space-y-1">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          {user?.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {user?.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
        <div className="px-3 pt-2 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-[var(--text)] truncate">{user?.name}</p>
            <p className="text-xs text-[var(--muted)] truncate">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
