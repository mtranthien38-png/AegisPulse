const assets = [
  { name: "Validator Node A", type: "validator", status: "healthy", risk: 11 },
  { name: "RPC Gateway", type: "service", status: "degraded", risk: 41 },
  { name: "Bridge Watcher", type: "monitor", status: "healthy", risk: 18 },
];

export default function AssetsPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold">Assets</h1>
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
          {assets.map((asset) => (
            <div key={asset.name} className="grid grid-cols-4 gap-4 border-b border-white/10 bg-white/5 p-4 last:border-b-0">
              <div>{asset.name}</div>
              <div className="text-slate-400">{asset.type}</div>
              <div className="text-slate-400">{asset.status}</div>
              <div className="text-right">{asset.risk}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
