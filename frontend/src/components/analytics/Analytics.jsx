import { useEffect, useState } from 'react';
import { tasksAPI } from '../../api';
import { CheckCircle2, Clock, AlertTriangle, TrendingUp, ListTodo, Zap } from 'lucide-react';
import { PRIORITY_CONFIG } from '../../utils/constants';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-[var(--text)]">{value}</p>
      <p className="text-sm text-[var(--muted)]">{label}</p>
    </div>
  </div>
);

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tasksAPI.getAnalytics().then(res => { setData(res.data.analytics); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-[var(--muted)]">Loading analytics...</div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={ListTodo}     label="Total Tasks"       value={data.total}          color="bg-indigo-500" />
        <StatCard icon={CheckCircle2} label="Completed"         value={data.done}           color="bg-green-500"  />
        <StatCard icon={Zap}          label="In Progress"       value={data.inprogress}     color="bg-blue-500"   />
        <StatCard icon={Clock}        label="To Do"             value={data.todo}           color="bg-slate-500"  />
        <StatCard icon={AlertTriangle}label="Overdue"           value={data.overdue}        color="bg-red-500"    />
        <StatCard icon={TrendingUp}   label="Completion Rate"   value={`${data.completionRate}%`} color="bg-purple-500" />
      </div>

      {/* Completion bar */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-3">Overall Progress</h3>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
          <div className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" style={{ width: `${data.completionRate}%` }} />
        </div>
        <p className="text-xs text-[var(--muted)] mt-1">{data.done} of {data.total} tasks completed</p>
      </div>

      {/* By Priority */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-4">Tasks by Priority</h3>
        <div className="space-y-3">
          {data.byPriority.map(({ _id, count }) => {
            const cfg = PRIORITY_CONFIG[_id];
            if (!cfg) return null;
            const pct = data.total > 0 ? Math.round((count / data.total) * 100) : 0;
            return (
              <div key={_id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className={`font-medium ${cfg.color}`}>{cfg.label}</span>
                  <span className="text-[var(--muted)]">{count} ({pct}%)</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className={`h-2 rounded-full ${cfg.dot} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
