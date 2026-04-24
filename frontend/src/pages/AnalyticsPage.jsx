import Analytics from '../components/analytics/Analytics';

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Analytics</h1>
        <p className="text-sm text-[var(--muted)]">Your productivity insights</p>
      </div>
      <Analytics />
    </div>
  );
}
