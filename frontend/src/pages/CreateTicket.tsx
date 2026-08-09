import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../lib/useWallet'
import { createTicket } from '../lib/aegispulse'

export function CreateTicket() {
  const wallet = useWallet()
  const nav = useNavigate()
  const [operator, setOperator] = useState('')
  const [slaSpec, setSlaSpec] = useState('')
  const [days, setDays] = useState(7)
  const [stake, setStake] = useState('0.1')
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const doCreate = async () => {
    if (!wallet.address || !operator || !slaSpec || !stake) return
    setStatus('Submitting on-chain...'); setError(null)
    try {
      const deadline = Math.floor(Date.now() / 1000) + days * 86400
      const txHash = await createTicket(wallet.address, operator, slaSpec, deadline, stake)
      setStatus(`Ticket created! TX: ${String(txHash).slice(0, 18)}...`)
      setTimeout(() => nav('/'), 2000)
    } catch (err: any) {
      setError(err?.message ?? 'Failed'); setStatus(null)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-lg font-bold text-white mb-1">Create SLA Ticket</h1>
      <p className="text-xs text-slate-500 mb-6">Provider stakes GEN on an SLA commitment. If violated, operator raises alert and AI adjudicates.</p>

      <div className="space-y-4">
        {/* Operator */}
        <div>
          <label className="text-xs text-slate-400 block mb-1">Operator Address</label>
          <input value={operator} onChange={e => setOperator(e.target.value)}
            placeholder="0x..."
            className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-sm text-white font-mono placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none" />
          <p className="text-[10px] text-slate-600 mt-1">The monitoring party who can raise alerts</p>
        </div>

        {/* SLA Spec */}
        <div>
          <label className="text-xs text-slate-400 block mb-1">SLA Specification</label>
          <textarea value={slaSpec} onChange={e => setSlaSpec(e.target.value)} rows={4}
            placeholder="e.g. Validator must maintain 99.5% uptime, respond within 30s, no more than 2 missed blocks per hour..."
            className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none" />
          <p className="text-[10px] text-slate-600 mt-1">Plain-English SLA that AI validators will check evidence against</p>
        </div>

        {/* Deadline + Stake */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Deadline (days)</label>
            <input type="number" value={days} onChange={e => setDays(+e.target.value)} min={1}
              className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-sm text-white font-mono focus:border-emerald-500/50 focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Stake (GEN)</label>
            <input value={stake} onChange={e => setStake(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-sm text-white font-mono focus:border-emerald-500/50 focus:outline-none" />
          </div>
        </div>

        {/* Workflow preview */}
        <div className="border border-slate-800 rounded p-3 bg-slate-900/30">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Workflow</p>
          <div className="space-y-1 text-xs text-slate-400">
            <p>1. You stake {stake || '0'} GEN on SLA compliance</p>
            <p>2. Operator monitors and can raise alert if SLA breached</p>
            <p>3. You submit evidence URLs proving compliance</p>
            <p>4. AI validators fetch evidence live and adjudicate</p>
            <p>5. Violation → payout to operator / No violation → refund to you</p>
            <p>6. Either party can dispute within 3-day appeal window</p>
          </div>
        </div>

        {/* Submit */}
        <button onClick={doCreate}
          disabled={!wallet.address || !operator || !slaSpec || !stake}
          className="w-full py-2.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-sm font-medium hover:bg-emerald-500/30 transition disabled:opacity-30">
          {!wallet.address ? 'Connect wallet first' : `Stake ${stake || '0'} GEN & Create Ticket`}
        </button>

        {status && <p className="text-xs text-emerald-400">{status}</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    </div>
  )
}
