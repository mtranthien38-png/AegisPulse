const incidents = [
  { title: "Validator drift detected", status: "triaged", owner: "oncall", asset: "Validator Node A" },
  { title: "RPC gateway instability", status: "investigating", owner: "platform", asset: "RPC Gateway" },
];

export default function IncidentsPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold">Incidents</h1>
        <div className="mt-6 grid gap-4">
          {incidents.map((incident) => (
            <div key={incident.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-lg font-medium">{incident.title}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-400">
                <span>Status: {incident.status}</span>
                <span>Owner: {incident.owner}</span>
                <span>Asset: {incident.asset}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
