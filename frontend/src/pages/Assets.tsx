import { useState, useEffect } from 'react'
import { useWallet } from '../lib/useWallet'
import { registerAsset } from '../lib/aegispulse'
import type { LocalAsset } from '../lib/types'

const LS = 'aegispulse:assets'

export function Assets() {
  const wallet = useWallet()
  const [assets, setAssets] = useState<LocalAsset[]>([])
  const [name, setName] = useState('')
  const [assetType, setAssetType] = useState('validator')
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try { setAssets(JSON.parse(localStorage.getItem(LS) || '[]')) } catch {}
  }, [])

  const doRegister = async () => {
    if (!wallet.address || !name) return
    setStatus('Registering on-chain...')
    setError(null)
    try {
      const assetId = `asset_${Date.now()}`
      const txHash = await registerAsset(wallet.address, assetId, name, assetType)
      const newAsset: LocalAsset = {
        asset_id: assetId, name, asset_type: assetType,
        status: 'healthy', network: 'bradbury', registered_at: new Date().toISOString(),
      }
      const updated = [...assets, newAsset]
      setAssets(updated)
      localStorage.setItem(LS, JSON.stringify(updated))
      setStatus(`Registered! TX: ${String(txHash).slice(0, 18)}...`)
      setName('')
    } catch (err: any) {
      setError(err?.message ?? 'Failed')
      setStatus(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">Infrastructure</p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight">Assets</h1>
        <p className="mt-2 text-sm text-slate-400">Register and track monitored infrastructure components.</p>
      </header>

      {/* Register form */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="text-lg font-semibold text-cyan-200">Register New Asset</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <input
            placeholder="Asset name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="flex-1 min-w-[200px] rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400/40 focus:outline-none"
          />
          <select
            value={assetType}
            onChange={e => setAssetType(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-cyan-400/40 focus:outline-none"
          >
            <option value="validator">Validator</option>
            <option value="relay">Relay</option>
            <option value="gateway">Gateway</option>
            <option value="watchpoint">Watchpoint</option>
          </select>
          <button
            onClick={doRegister}
            disabled={!wallet.address || !name}
            className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-300 disabled:opacity-40"
          >
            Register
          </button>
        </div>
        {status && <p className="mt-2 text-sm text-cyan-200">{status}</p>}
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        {!wallet.address && <p className="mt-2 text-xs text-slate-500">Connect wallet on the Dashboard first.</p>}
      </div>

      {/* Asset list */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-500">
            No assets registered yet.
          </div>
        ) : (
          assets.map(a => (
            <div key={a.asset_id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{a.name}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs ${
                  a.status === 'healthy'
                    ? 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                    : 'border border-amber-400/20 bg-amber-400/10 text-amber-300'
                }`}>
                  {a.status}
                </span>
              </div>
              <div className="mt-3 space-y-1 text-sm text-slate-400">
                <p>ID: <span className="font-mono text-xs text-slate-300">{a.asset_id}</span></p>
                <p>Type: {a.asset_type}</p>
                <p>Network: {a.network}</p>
                <p className="text-xs text-slate-600">Registered: {new Date(a.registered_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
