import { useState, useEffect } from 'react'
import { useWallet } from '../lib/useWallet'
import { scoreAlert, getAlert } from '../lib/aegispulse'
import { EXPLORER_URL } from '../lib/genlayer'
import type { LocalAsset, LocalAlert } from '../lib/types'

const LS_ALERTS = 'aegispulse:alerts'
const LS_ASSETS = 'aegispulse:assets'

export function Alerts() {
  const wallet = useWallet()
  const [alerts, setAlerts] = useState<LocalAlert[]>([])
  const [assets, setAssets] = useState<LocalAsset[]>([])
  const [assetId, setAssetId] = useState('')
  const [severity, setSeverity] = useState('medium')
  const [evidence, setEvidence] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setAlerts(JSON.parse(localStorage.getItem(LS_ALERTS) || '[]'))
      setAssets(JSON.parse(localStorage.getItem(LS_ASSETS) || '[]'))
    } catch {}
  }, [])

  const doScore = async () => {
    if (!wallet.address || !assetId || !evidence) return
    setStatus('Scoring alert with AI consensus...')
    setError(null)
    try {
      const alertId = `alert_${Date.now()}`
      const txHash = await scoreAlert(wallet.address, alertId, assetId, severity, evidence)
      let result: any = null
      try { result = await getAlert(alertId) } catch {}
      const newAlert: LocalAlert = {
        alert_id: alertId, asset_id: assetId,
        severity_score: result?.severity_score ?? 0,
        confidence: result?.confidence ?? 0,
        recommended_action: result?.recommended_action ?? 'observe',
        severity_hint: severity, evidence_summary: evidence,
        scored_at: new Date().toISOString(), tx_hash: String(txHash),
      }
      const updated = [...alerts, newAlert]
      setAlerts(updated)
      localStorage.setItem(LS_ALERTS, JSON.stringify(updated))
      setStatus(`Alert scored! Score: ${newAlert.severity_score}, Action: ${newAlert.recommended_action}`)
      setEvidence('')
    } catch (err: any) {
      setError(err?.message ?? 'Failed')
      setStatus(null)
    }
  }

  const severityColor = (s: string) => {
    if (s === 'critical' || s === 'high') return 'text-red-300 border-red-400/20 bg-red-400/10'
    if (s === 'medium') return 'text-amber-300 border-amber-400/20 bg-amber-400/10'
    return 'text-emerald-300 border-emerald-400/20 bg-emerald-400/10'
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">Signal Intelligence</p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight">Alerts</h1>
        <p className="mt-2 text-sm text-slate-400">Score alerts with AI consensus on GenLayer.</p>
      </header>

      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="text-lg font-semibold text-cyan-200">Score New Alert</h3>
        <div className="mt-4 space-y-3">
          <select
            value={assetId}
            onChange={e => setAssetId(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-cyan-400/40 focus:outline-none"
          >
            <option value="">Select asset...</option>
            {assets.map(a => (
              <option key={a.asset_id} value={a.asset_id}>{a.name} ({a.asset_type})</option>
            ))}
          </select>
          <select
            value={severity}
            onChange={e => setSeverity(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-cyan-400/40 focus:outline-none"
          >
            <option value="low">Low severity</option>
            <option value="medium">Medium severity</option>
            <option value="high">High severity</option>
            <option value="critical">Critical severity</option>
          </select>
          <textarea
            placeholder="Evidence summary (what happened, symptoms, metrics)..."
            value={evidence}
            onChange={e => setEvidence(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400/40 focus:outline-none"
          />
          <button
            onClick={doScore}
            disabled={!wallet.address || !assetId || !evidence}
            className="w-full rounded-full bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-300 disabled:opacity-40"
          >
            Score with AI consensus
          </button>
          {status && <p className="text-sm text-cyan-200">{status}</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}
          {!wallet.address && <p className="text-xs text-slate-500">Connect wallet on the Dashboard first.</p>}
        </div>
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-500">
            No alerts scored yet.
          </div>
        ) : (
          alerts.slice().reverse().map(a => (
            <div key={a.alert_id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{a.asset_id}</p>
                  <p className="mt-1 text-sm text-slate-400">{a.evidence_summary}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs ${severityColor(a.severity_hint)}`}>
                  {a.severity_hint}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                <span>Score: <strong className="text-white">{a.severity_score}</strong>/100</span>
                <span>Confidence: <strong className="text-white">{a.confidence}</strong>/100</span>
                <span>Action: <strong className="text-cyan-200">{a.recommended_action}</strong></span>
                {a.tx_hash && (
                  <a
                    href={`${EXPLORER_URL}/tx/${a.tx_hash}`}
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
