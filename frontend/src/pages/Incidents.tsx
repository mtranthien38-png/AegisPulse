import { useState, useEffect } from 'react'
import { useWallet } from '../lib/useWallet'
import { openIncident } from '../lib/aegispulse'
import { EXPLORER_URL } from '../lib/genlayer'
import type { LocalAlert, LocalIncident } from '../lib/types'

const LS_INCIDENTS = 'aegispulse:incidents'
const LS_ALERTS = 'aegispulse:alerts'

export function Incidents() {
  const wallet = useWallet()
  const [incidents, setIncidents] = useState<LocalIncident[]>([])
  const [alerts, setAlerts] = useState<LocalAlert[]>([])
  const [alertId, setAlertId] = useState('')
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setIncidents(JSON.parse(localStorage.getItem(LS_INCIDENTS) || '[]'))
      setAlerts(JSON.parse(localStorage.getItem(LS_ALERTS) || '[]'))
    } catch {}
  }, [])

  const doOpen = async () => {
    if (!wallet.address || !alertId || !title) return
    setStatus('Opening incident on-chain...')
    setError(null)
    try {
      const incidentId = `incident_${Date.now()}`
      const txHash = await openIncident(wallet.address, incidentId, alertId, title)
      const newInc: LocalIncident = {
        incident_id: incidentId, alert_id: alertId, title,
        status: 'open', opened_at: new Date().toISOString(), tx_hash: String(txHash),
      }
      const updated = [...incidents, newInc]
      setIncidents(updated)
      localStorage.setItem(LS_INCIDENTS, JSON.stringify(updated))
      setStatus(`Incident opened! TX: ${String(txHash).slice(0, 18)}...`)
      setTitle('')
    } catch (err: any) {
      setError(err?.message ?? 'Failed')
      setStatus(null)
    }
  }

  const resolveLocal = (id: string) => {
    const updated = incidents.map(i =>
      i.incident_id === id ? { ...i, status: 'resolved' } : i
    )
    setIncidents(updated)
    localStorage.setItem(LS_INCIDENTS, JSON.stringify(updated))
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">Response</p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight">Incidents</h1>
        <p className="mt-2 text-sm text-slate-400">Track and resolve incidents from scored alerts.</p>
      </header>

      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="text-lg font-semibold text-cyan-200">Open New Incident</h3>
        <div className="mt-4 space-y-3">
          <select
            value={alertId}
            onChange={e => setAlertId(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-cyan-400/40 focus:outline-none"
          >
            <option value="">Select scored alert...</option>
            {alerts.map(a => (
              <option key={a.alert_id} value={a.alert_id}>
                {a.alert_id} — {a.asset_id} (score: {a.severity_score})
              </option>
            ))}
          </select>
          <input
            placeholder="Incident title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400/40 focus:outline-none"
          />
          <button
            onClick={doOpen}
            disabled={!wallet.address || !alertId || !title}
            className="w-full rounded-full bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-300 disabled:opacity-40"
          >
            Open incident
          </button>
          {status && <p className="text-sm text-cyan-200">{status}</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      </div>

      <div className="space-y-3">
        {incidents.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-500">
            No incidents yet.
          </div>
        ) : (
          incidents.slice().reverse().map(i => (
            <div key={i.incident_id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{i.title}</p>
                  <p className="mt-1 text-xs text-slate-400">Alert: {i.alert_id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    i.status === 'open'
                      ? 'border border-amber-400/20 bg-amber-400/10 text-amber-300'
                      : 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                  }`}>
                    {i.status}
                  </span>
                  {i.status === 'open' && (
                    <button
                      onClick={() => resolveLocal(i.incident_id)}
                      className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300 transition hover:bg-white/10"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-2 flex gap-4 text-xs text-slate-500">
                <span>ID: {i.incident_id}</span>
                <span>{new Date(i.opened_at).toLocaleString()}</span>
                {i.tx_hash && (
                  <a
                    href={`${EXPLORER_URL}/tx/${i.tx_hash}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-cyan-400 underline decoration-cyan-400/40 underline-offset-2"
                  >
                    TX ↗
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
