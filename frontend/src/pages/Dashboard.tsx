import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWallet } from '../lib/useWallet'
import { getAlert, registerAsset, scoreAlert, openIncident } from '../lib/aegispulse'
import { CONTRACT_ADDRESS, EXPLORER_URL } from '../lib/genlayer'
import type { LocalAsset, LocalAlert, LocalIncident } from '../lib/types'

const LS_ASSETS = 'aegispulse:assets'
const LS_ALERTS = 'aegispulse:alerts'
const LS_INCIDENTS = 'aegispulse:incidents'

function loadLocal<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}
function saveLocal<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function Dashboard() {
  const wallet = useWallet()
  const [assets, setAssets] = useState<LocalAsset[]>([])
  const [alerts, setAlerts] = useState<LocalAlert[]>([])
  const [incidents, setIncidents] = useState<LocalIncident[]>([])
  const [txStatus, setTxStatus] = useState<string | null>(null)
  const [txError, setTxError] = useState<string | null>(null)

  // Register form
  const [regName, setRegName] = useState('')
  const [regType, setRegType] = useState('validator')
  const [regNetwork, setRegNetwork] = useState('studionet')

  // Score form
  const [scoreAsset, setScoreAsset] = useState('')
  const [scoreSeverity, setScoreSeverity] = useState('medium')
  const [scoreEvidence, setScoreEvidence] = useState('')

  // Incident form
  const [incAlertId, setIncAlertId] = useState('')
  const [incTitle, setIncTitle] = useState('')

  useEffect(() => {
    setAssets(loadLocal<LocalAsset>(LS_ASSETS))
    setAlerts(loadLocal<LocalAlert>(LS_ALERTS))
    setIncidents(loadLocal<LocalIncident>(LS_INCIDENTS))
  }, [])

  const doRegisterAsset = async () => {
    if (!wallet.address || !regName) return
    setTxStatus('Registering asset on-chain...')
    setTxError(null)
    try {
      const assetId = `asset_${Date.now()}`
      const txHash = await registerAsset(wallet.address, assetId, regName, regType)
      const newAsset: LocalAsset = {
        asset_id: assetId, name: regName, asset_type: regType,
        status: 'healthy', network: regNetwork, registered_at: new Date().toISOString(),
      }
      const updated = [...assets, newAsset]
      setAssets(updated)
      saveLocal(LS_ASSETS, updated)
      setTxStatus(`Asset registered! TX: ${String(txHash).slice(0, 18)}...`)
      setRegName('')
    } catch (err: any) {
      setTxError(err?.message ?? 'Failed to register asset')
      setTxStatus(null)
    }
  }

  const doScoreAlert = async () => {
    if (!wallet.address || !scoreAsset || !scoreEvidence) return
    setTxStatus('Scoring alert on-chain (AI consensus)...')
    setTxError(null)
    try {
      const alertId = `alert_${Date.now()}`
      const txHash = await scoreAlert(wallet.address, alertId, scoreAsset, scoreSeverity, scoreEvidence)
      // Try to read result from chain
      let contractResult: any = null
      try { contractResult = await getAlert(alertId) } catch {}
      const newAlert: LocalAlert = {
        alert_id: alertId,
        asset_id: scoreAsset,
        severity_score: contractResult?.severity_score ?? 0,
        confidence: contractResult?.confidence ?? 0,
        recommended_action: contractResult?.recommended_action ?? 'observe',
        severity_hint: scoreSeverity,
        evidence_summary: scoreEvidence,
        scored_at: new Date().toISOString(),
        tx_hash: String(txHash),
      }
      const updated = [...alerts, newAlert]
      setAlerts(updated)
      saveLocal(LS_ALERTS, updated)
      setTxStatus(`Alert scored! TX: ${String(txHash).slice(0, 18)}...`)
      setScoreEvidence('')
    } catch (err: any) {
      setTxError(err?.message ?? 'Failed to score alert')
      setTxStatus(null)
    }
  }

  const doOpenIncident = async () => {
    if (!wallet.address || !incAlertId || !incTitle) return
    setTxStatus('Opening incident on-chain...')
    setTxError(null)
    try {
      const incidentId = `incident_${Date.now()}`
      const txHash = await openIncident(wallet.address, incidentId, incAlertId, incTitle)
      const newInc: LocalIncident = {
        incident_id: incidentId, alert_id: incAlertId, title: incTitle,
        status: 'open', opened_at: new Date().toISOString(), tx_hash: String(txHash),
      }
      const updated = [...incidents, newInc]
      setIncidents(updated)
      saveLocal(LS_INCIDENTS, updated)
      setTxStatus(`Incident opened! TX: ${String(txHash).slice(0, 18)}...`)
      setIncTitle('')
    } catch (err: any) {
      setTxError(err?.message ?? 'Failed to open incident')
      setTxStatus(null)
    }
  }

  const summaryCards = [
    { label: 'Monitored assets', value: assets.length, hint: `${assets.filter(a => a.status === 'healthy').length} healthy` },
    { label: 'Scored alerts', value: alerts.length, hint: `${alerts.filter(a => a.severity_score >= 70).length} high-risk` },
    { label: 'Open incidents', value: incidents.filter(i => i.status === 'open').length, hint: `${incidents.length} total` },
    { label: 'Resolved', value: incidents.filter(i => i.status === 'resolved').length, hint: 'Contract workflow' },
  ]

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Header */}
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">Operations</p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight">AegisPulse Dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">Monitor assets, score alerts with AI consensus, and manage incidents — all on-chain.</p>
      </header>

      {/* Wallet */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-300/70">Wallet</p>
            <p className="mt-1 text-sm">
              {wallet.address
                ? <span className="font-mono text-cyan-200">{wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}</span>
                : <span className="text-slate-500">Not connected</span>
              }
            </p>
          </div>
          <button
            onClick={wallet.connect}
            className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-300"
          >
            {wallet.address ? 'Reconnect' : 'Connect Wallet'}
          </button>
        </div>
        {wallet.error && <p className="mt-2 text-sm text-red-400">{wallet.error}</p>}
      </div>

      {/* Contract info */}
      <div className="mb-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
        <p className="text-xs uppercase tracking-widest text-cyan-300/70">On-chain</p>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
          <span className="text-slate-400">Contract:</span>
          <a
            href={`${EXPLORER_URL}/contract/${CONTRACT_ADDRESS}`}
            target="_blank" rel="noopener noreferrer"
            className="font-mono text-xs text-cyan-200 underline decoration-cyan-400/40 underline-offset-2"
          >
            {CONTRACT_ADDRESS?.slice(0, 10)}...{CONTRACT_ADDRESS?.slice(-8)}
          </a>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-300">
            StudioNet
          </span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">{card.label}</p>
            <p className="mt-1 text-3xl font-semibold text-white">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.hint}</p>
          </div>
        ))}
      </div>

      {/* Status messages */}
      {txStatus && (
        <div className="mb-4 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-sm text-cyan-200">
          {txStatus}
        </div>
      )}
      {txError && (
        <div className="mb-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">
          {txError}
        </div>
      )}

      {/* Action panels */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Register Asset */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-cyan-200">Register Asset</h3>
          <p className="mt-1 text-xs text-slate-400">Add a monitored infrastructure asset on-chain.</p>
          <div className="mt-4 space-y-3">
            <input
              placeholder="Asset name"
              value={regName}
              onChange={e => setRegName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400/40 focus:outline-none"
            />
            <select
              value={regType}
              onChange={e => setRegType(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-cyan-400/40 focus:outline-none"
            >
              <option value="validator">Validator</option>
              <option value="relay">Relay</option>
              <option value="gateway">Gateway</option>
              <option value="watchpoint">Watchpoint</option>
            </select>
            <button
              onClick={doRegisterAsset}
              disabled={!wallet.address || !regName}
              className="w-full rounded-full bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-300 disabled:opacity-40"
            >
              Register on-chain
            </button>
          </div>
        </div>

        {/* Score Alert */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-cyan-200">Score Alert</h3>
          <p className="mt-1 text-xs text-slate-400">AI consensus scores the alert severity on-chain.</p>
          <div className="mt-4 space-y-3">
            <select
              value={scoreAsset}
              onChange={e => setScoreAsset(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-cyan-400/40 focus:outline-none"
            >
              <option value="">Select asset...</option>
              {assets.map(a => (
                <option key={a.asset_id} value={a.asset_id}>{a.name}</option>
              ))}
            </select>
            <select
              value={scoreSeverity}
              onChange={e => setScoreSeverity(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-cyan-400/40 focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <textarea
              placeholder="Evidence summary..."
              value={scoreEvidence}
              onChange={e => setScoreEvidence(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400/40 focus:outline-none"
            />
            <button
              onClick={doScoreAlert}
              disabled={!wallet.address || !scoreAsset || !scoreEvidence}
              className="w-full rounded-full bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-300 disabled:opacity-40"
            >
              Score on-chain
            </button>
          </div>
        </div>

        {/* Open Incident */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-cyan-200">Open Incident</h3>
          <p className="mt-1 text-xs text-slate-400">Escalate a scored alert into a tracked incident.</p>
          <div className="mt-4 space-y-3">
            <select
              value={incAlertId}
              onChange={e => setIncAlertId(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-cyan-400/40 focus:outline-none"
            >
              <option value="">Select alert...</option>
              {alerts.map(a => (
                <option key={a.alert_id} value={a.alert_id}>
                  {a.alert_id} — {a.severity_hint} (score: {a.severity_score})
                </option>
              ))}
            </select>
            <input
              placeholder="Incident title"
              value={incTitle}
              onChange={e => setIncTitle(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400/40 focus:outline-none"
            />
            <button
              onClick={doOpenIncident}
              disabled={!wallet.address || !incAlertId || !incTitle}
              className="w-full rounded-full bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-300 disabled:opacity-40"
            >
              Open incident
            </button>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">Recent Alerts</h3>
          <div className="mt-3 space-y-2">
            {alerts.length === 0 ? (
              <p className="text-sm text-slate-500">No alerts scored yet.</p>
            ) : (
              alerts.slice(-5).reverse().map(a => (
                <div key={a.alert_id} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/60 p-3">
                  <div>
                    <p className="text-sm font-medium">{a.asset_id}</p>
                    <p className="text-xs text-slate-400">{a.severity_hint} — {a.recommended_action}</p>
                  </div>
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-xs text-cyan-200">
                    {a.severity_score}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">Active Incidents</h3>
          <div className="mt-3 space-y-2">
            {incidents.filter(i => i.status === 'open').length === 0 ? (
              <p className="text-sm text-slate-500">No open incidents.</p>
            ) : (
              incidents.filter(i => i.status === 'open').slice(-5).reverse().map(i => (
                <div key={i.incident_id} className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                  <p className="text-sm font-medium">{i.title}</p>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                    <span>{i.incident_id}</span>
                    <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-amber-200">{i.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Workflow explanation */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="text-lg font-semibold">Workflow</h3>
        <div className="mt-4 space-y-2 text-sm text-slate-300">
          {[
            ['1', 'Register Asset', 'Onboard a monitored infrastructure component on-chain.'],
            ['2', 'Score Alert', 'AI consensus evaluates alert severity and recommends action.'],
            ['3', 'Open Incident', 'Escalate high-risk alerts into tracked incidents.'],
            ['4', 'Resolve', 'Close incidents after remediation.'],
          ].map(([num, title, desc]) => (
            <div key={num} className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-slate-950/60 text-xs text-cyan-300">
                {num}
              </div>
              <div>
                <span className="font-medium text-white">{title}</span>
                <span className="ml-2 text-slate-400">— {desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
