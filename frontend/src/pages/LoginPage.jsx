import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md bg-[var(--surface)] rounded-2xl shadow-xl border border-[var(--border)] p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <CheckSquare size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-[var(--text)]">TaskFlow</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--text)] mb-1">Welcome back</h1>
        <p className="text-sm text-[var(--muted)] mb-6">Sign in to your account</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" required />
          <Input label="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" required />
          <Button type="submit" className="w-full justify-center" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <p className="text-sm text-center text-[var(--muted)] mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
