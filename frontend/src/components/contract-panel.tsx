export function ContractPanel({
  address,
  txHash,
  network,
  registeredAssets,
  trackedAlerts,
  openIncidents,
}: {
  address: string;
  txHash: string;
  network: string;
  registeredAssets?: number;
  trackedAlerts?: number;
  openIncidents?: number;
}) {
  return (
    <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">On-chain</p>
      <h3 className="mt-2 text-xl font-semibold">GenLayer contract</h3>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex items-start justify-between gap-4">
          <dt className="text-slate-400">Network</dt>
          <dd className="text-right font-medium text-white">{network}</dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="text-slate-400">Address</dt>
          <dd className="max-w-[18rem] truncate text-right font-mono text-xs text-white">{address}</dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="text-slate-400">Deployment TX</dt>
          <dd className="max-w-[18rem] truncate text-right font-mono text-xs text-white">{txHash}</dd>
        </div>
        {registeredAssets !== undefined && (
          <div className="flex items-start justify-between gap-4">
            <dt className="text-slate-400">Assets tracked</dt>
            <dd className="text-right font-medium text-white">{registeredAssets}</dd>
          </div>
        )}
        {trackedAlerts !== undefined && (
          <div className="flex items-start justify-between gap-4">
            <dt className="text-slate-400">Alerts tracked</dt>
            <dd className="text-right font-medium text-white">{trackedAlerts}</dd>
          </div>
        )}
        {openIncidents !== undefined && (
          <div className="flex items-start justify-between gap-4">
            <dt className="text-slate-400">Open incidents</dt>
            <dd className="text-right font-medium text-white">{openIncidents}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
