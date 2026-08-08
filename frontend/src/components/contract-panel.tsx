export function ContractPanel({
  address,
  txHash,
  network,
}: {
  address: string;
  txHash: string;
  network: string;
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
      </dl>
    </div>
  );
}
