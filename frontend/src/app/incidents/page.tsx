import { api } from "@/lib/api";

export default async function IncidentsPage() {
  const incidents = await api.incidents().catch(() => []);

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold">Incidents</h1>
        <div className="mt-6 grid gap-4">
          {incidents.map((incident) => (
            <div key={incident.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-lg font-medium">{incident.title}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-400">
                <span>Status: {incident.status}</span>
                <span>Owner: {incident.owner}</span>
                <span>Asset: {incident.asset}</span>
              </div>
              <div className="mt-4 flex gap-3">
                <button className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950">Open contract read</button>
                <button className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/90">Mark reviewed</button>
              </div>
            </div>
          ))}
          {incidents.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center text-slate-400">
              No incidents have been opened yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
