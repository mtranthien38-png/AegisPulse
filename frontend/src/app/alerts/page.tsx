import { api } from "@/lib/api";

export default async function AlertsPage() {
  const alerts = await api.alerts().catch(() => []);

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold">Alerts</h1>
        <div className="mt-6 grid gap-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium">{alert.title}</p>
                  <p className="text-sm text-slate-400">{alert.asset}</p>
                </div>
                <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                  {alert.severity}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-400">Confidence {alert.confidence}%</p>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center text-slate-400">
              No alerts are available.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
