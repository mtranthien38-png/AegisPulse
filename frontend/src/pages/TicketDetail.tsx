import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useWallet } from '../lib/useWallet'
import { getTicket, acknowledge, submitEvidence, adjudicate, raiseAlert, raiseDispute, settleRefund, refundExpired } from '../lib/aegispulse'
import { EXPLORER_URL } from '../lib/genlayer'
import type { Ticket } from '../lib/types'
import { STATUS_LABELS, STATUS_COLORS } from '../lib/types'

export function TicketDetail() {
  const { id } = useParams()
  const wallet = useWallet()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [action, setAction] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Evidence form
  const [evidenceUrls, setEvidenceUrls] = useState('')
  const [notes, setNotes] = useState('')
  // Alert form
  const [alertSummary, setAlertSummary] = useState('')
  // Dispute form
  const [disputeReason, setDisputeReason] = useState('')
  const [disputeEvidence, setDisputeEvidence] = useState('')

  const load = async () => {
    if (!id) return
    setLoading(true)
    try { setTicket(await getTicket(+id)) } catch { setTicket(null) }
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const isProvider = wallet.address && ticket && wallet.address.toLowerCase() === ticket.provider.toLowerCase()
  const isOperator = wallet.address && ticket && wallet.address.toLowerCase() === ticket.operator.toLowerCase()
  const isParty = isProvider || isOperator

  const fmtGEN = (wei: number) => (wei / 1e18).toFixed(4)
  const fmtDate = (ts: number) => ts > 0 ? new Date(ts * 1000).toLocaleString() : '—'
  const shortAddr = (a: string) => a ? `${a.slice(0, 8)}...${a.slice(-6)}` : ''

  const doAction = async (fn: () => Promise<string>, label: string) => {
    setAction(label); setError(null)
    try {
      const tx = await fn()
      setAction(`${label} done! TX: ${String(tx).slice(0, 16)}...`)
      setTimeout(load, 3000)
    } catch (err: any) {
      setError(err?.message ?? 'Failed'); setAction(null)
    }
  }

  if (loading) return <div className="text-center py-12 text-slate-600">Loading ticket from chain...</div>
  if (!ticket) return <div className="text-center py-12 text-slate-600">Ticket not found.</div>

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition">&larr; Back to tickets</Link>

      {/* Header */}
      <div className="flex items-start justify-between mt-3 mb-6">
        <div>
          <h1 className="text-lg font-bold text-white">Ticket #{ticket.id}</h1>
          <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] border ${STATUS_COLORS[ticket.status]}`}>
            {STATUS_LABELS[ticket.status] ?? ticket.status}
          </span>
        </div>
        <div className="text-right text-xs text-slate-500">
          <p>Stake: <span className="text-amber-300 font-mono">{fmtGEN(ticket.stake_amount)} GEN</span></p>
          <p>Deadline: {fmtDate(ticket.deadline)}</p>
          {ticket.dispute_round > 0 && <p>Dispute round: {ticket.dispute_round}</p>}
        </div>
      </div>

      {/* Parties */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border border-slate-800 rounded p-3 bg-slate-900/30">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Provider (staker)</p>
          <a href={`${EXPLORER_URL}/address/${ticket.provider}`} target="_blank" rel="noopener noreferrer"
            className="text-sm font-mono text-emerald-400 hover:text-emerald-300 transition">
            {shortAddr(ticket.provider)}
          </a>
          {isProvider && <span className="ml-2 text-[10px] text-emerald-400">← you</span>}
        </div>
        <div className="border border-slate-800 rounded p-3 bg-slate-900/30">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Operator (monitor)</p>
          <a href={`${EXPLORER_URL}/address/${ticket.operator}`} target="_blank" rel="noopener noreferrer"
            className="text-sm font-mono text-cyan-400 hover:text-cyan-300 transition">
            {shortAddr(ticket.operator)}
          </a>
          {isOperator && <span className="ml-2 text-[10px] text-cyan-400">← you</span>}
        </div>
      </div>

      {/* SLA Spec */}
      <div className="border border-slate-800 rounded p-4 mb-4 bg-slate-900/30">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">SLA Specification</p>
        <p className="text-sm text-slate-300 whitespace-pre-wrap">{ticket.sla_spec}</p>
      </div>

      {/* Alert */}
      {ticket.alert_summary && (
        <div className="border border-amber-400/20 rounded p-4 mb-4 bg-amber-400/5">
          <p className="text-[10px] text-amber-400 uppercase tracking-wider mb-2">Alert / Notes</p>
          <p className="text-sm text-amber-200 whitespace-pre-wrap">{ticket.alert_summary}</p>
        </div>
      )}

      {/* Evidence URLs */}
      {ticket.evidence_urls.length > 0 && (
        <div className="border border-slate-800 rounded p-4 mb-4 bg-slate-900/30">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Evidence URLs</p>
          <div className="space-y-1">
            {ticket.evidence_urls.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                className="block text-xs text-cyan-400 hover:text-cyan-300 font-mono truncate">
                {url}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Verdict */}
      {ticket.verdict_reasoning && (
        <div className="border border-purple-400/20 rounded p-4 mb-4 bg-purple-400/5">
          <p className="text-[10px] text-purple-400 uppercase tracking-wider mb-2">AI Verdict</p>
          <p className="text-sm text-purple-200 whitespace-pre-wrap">{ticket.verdict_reasoning}</p>
        </div>
      )}

      {/* Actions */}
      {isParty && (
        <div className="border border-slate-800 rounded p-4 bg-slate-900/30">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">Actions</p>

          {/* Operator: raise alert */}
          {isOperator && ticket.status === 'open' && (
            <div className="mb-4">
              <textarea value={alertSummary} onChange={e => setAlertSummary(e.target.value)} rows={2}
                placeholder="Describe the SLA violation observed..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-amber-500/50 focus:outline-none mb-2" />
              <button onClick={() => doAction(() => raiseAlert(wallet.address!, ticket.id, alertSummary), 'Raise Alert')}
                disabled={!alertSummary} className="px-4 py-2 rounded text-xs bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/30 transition disabled:opacity-30">
                Raise Alert
              </button>
            </div>
          )}

          {/* Provider: acknowledge */}
          {isProvider && ticket.status === 'open' && (
            <button onClick={() => doAction(() => acknowledge(wallet.address!, ticket.id), 'Acknowledge')}
              className="px-4 py-2 rounded text-xs bg-blue-500/20 text-blue-300 border border-blue-400/30 hover:bg-blue-500/30 transition mr-2">
              Acknowledge Alert
            </button>
          )}

          {/* Provider: submit evidence */}
          {isProvider && (ticket.status === 'acknowledged' || ticket.status === 'open') && (
            <div className="mb-4">
              <textarea value={evidenceUrls} onChange={e => setEvidenceUrls(e.target.value)} rows={2}
                placeholder="Evidence URLs, one per line..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-xs text-white font-mono placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none mb-2" />
              <input value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Notes for AI (optional)"
                className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none mb-2" />
              <button onClick={() => {
                const urls = evidenceUrls.split('\n').map(u => u.trim()).filter(Boolean)
                doAction(() => submitEvidence(wallet.address!, ticket.id, urls, notes), 'Submit Evidence')
              }} disabled={!evidenceUrls}
                className="px-4 py-2 rounded text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30 transition disabled:opacity-30">
                Submit Evidence
              </button>
            </div>
          )}

          {/* Anyone: adjudicate */}
          {ticket.status === 'evidence_submitted' && (
            <button onClick={() => doAction(() => adjudicate(wallet.address!, ticket.id), 'Adjudicate')}
              className="px-4 py-2 rounded text-xs bg-purple-500/20 text-purple-300 border border-purple-400/30 hover:bg-purple-500/30 transition">
              Request AI Adjudication
            </button>
          )}

          {/* Either party: dispute */}
          {(ticket.status === 'no_violation' || ticket.status === 'violation_confirmed') && (
            <div className="mb-4">
              <input value={disputeReason} onChange={e => setDisputeReason(e.target.value)}
                placeholder="Dispute reason..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-orange-500/50 focus:outline-none mb-2" />
              <input value={disputeEvidence} onChange={e => setDisputeEvidence(e.target.value)}
                placeholder="Additional evidence URLs (comma-separated, optional)"
                className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-xs text-white font-mono placeholder:text-slate-600 focus:border-orange-500/50 focus:outline-none mb-2" />
              <button onClick={() => {
                const urls = disputeEvidence.split(',').map(u => u.trim()).filter(Boolean)
                doAction(() => raiseDispute(wallet.address!, ticket.id, urls, disputeReason), 'Raise Dispute')
              }} disabled={!disputeReason}
                className="px-4 py-2 rounded text-xs bg-orange-500/20 text-orange-300 border border-orange-400/30 hover:bg-orange-500/30 transition disabled:opacity-30">
                Raise Dispute
              </button>
            </div>
          )}

          {/* Settle / Refund */}
          {ticket.status === 'no_violation' && (
            <button onClick={() => doAction(() => settleRefund(wallet.address!, ticket.id), 'Settle Refund')}
              className="px-4 py-2 rounded text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30 transition">
              Settle Refund (after appeal window)
            </button>
          )}
          {(ticket.status === 'open' || ticket.status === 'acknowledged') && (
            <button onClick={() => doAction(() => refundExpired(wallet.address!, ticket.id), 'Refund Expired')}
              className="px-4 py-2 rounded text-xs bg-slate-500/20 text-slate-300 border border-slate-400/30 hover:bg-slate-500/30 transition">
              Refund Expired
            </button>
          )}
        </div>
      )}

      {/* Status messages */}
      {action && <p className="mt-3 text-xs text-emerald-400">{action}</p>}
      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

      {/* Timeline */}
      <div className="mt-6 border border-slate-800 rounded p-4 bg-slate-900/30">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">Lifecycle</p>
        <div className="space-y-2">
          {[
            ['open', 'Provider stakes GEN on SLA'],
            ['acknowledged', 'Operator acknowledges alert'],
            ['evidence_submitted', 'Provider submits evidence URLs'],
            ['violation_confirmed / no_violation', 'AI adjudicates from live-fetched evidence'],
            ['disputed', 'Either party disputes within 3-day window'],
            ['settled_payout / settled_refund', 'Final settlement'],
          ].map(([status, desc]) => (
            <div key={status} className="flex items-start gap-2">
              <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                ticket.status === status ? 'bg-emerald-400' : 'bg-slate-700'
              }`} />
              <p className={`text-xs ${ticket.status === status ? 'text-white' : 'text-slate-600'}`}>
                <span className="font-mono">{status}</span> — {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
