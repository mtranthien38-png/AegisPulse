import { api } from "@/lib/api";

export default async function AssetsPage() {
  const assets = await api.assets().catch(() => []);

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold">Assets</h1>
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
          {assets.map((asset) => (
            <div key={asset.id} className="grid grid-cols-4 gap-4 border-b border-white/10 bg-white/5 p-4 last:border-b-0">
              <div>{asset.name}</div>
              <div className="text-slate-400">{asset.asset_type}</div>
              <div className="text-slate-400">{asset.status}</div>
              <div className="text-right">{asset.risk_score}</div>
            </div>
          ))}
          {assets.length === 0 && (
            <div className="p-6 text-center text-slate-400">No assets available yet.</div>
          )}
        </div>
      </div>
    </main>
  );
}
