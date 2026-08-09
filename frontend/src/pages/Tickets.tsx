import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWallet } from '../lib/useWallet'
import { listAllIds, getTicket } from '../lib/aegispulse'
import { EXPLORER_URL } from '../lib/genlayer'
import type { Ticket } from '../lib/types'
import { STATUS_LABELS, STATUS_COLORS } from '../lib/types'

export function Tickets() {
  const wallet = useWallet()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'provider' | 'operator'>('all')

  const loadTickets = async () => {
    setLoading(true)
    try {
      let ids: number[]
      if (wallet.address && filter !== 'all') {
        const { listTicketsFor } = await import('../lib/aegispulse')
        ids = await listTicketsFor(wallet.address)
      } else {
        ids = await listAllIds()
      }
      const loaded = await Promise.all(ids.map(id => getTicket(id).catch(null)))
      setTickets(loaded.filter(Boolean) as Ticket[])
    } catch { setTickets([]) }
    setLoading(false)
  }

  useEffect(() => { loadTickets() }, [wallet.address, filter])

  const fmtGEN = (wei: number) => (wei / 1e18).toFixed(4)
  const fmtDate = (ts: number) => ts > 0 ? new Date(ts * 1000).toLocaleDateString() : '—'
  const shortAddr = (a: string) => a ? `${a.slice(0, 6)}...${a.slice(-4)}` : ''

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-white">SLA Tickets</h1>
          <p className="text-xs text-slate-500 mt-1">Infrastructure SLA compliance escrow — provider stakes GEN, AI adjudicates</p>
        </div>
        <div className="flex items-center gap-2">
          {wallet.address ? (
            <span className="text-xs px-2 py-1 rounded border border-emerald-400/20 bg-emerald-400/5 text-emerald-300 font-mono">
              {shortAddr(wallet.address)}
            </span>
          ) : (
            <button onClick={wallet.connect}
              className="text-xs px-3 py-1.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30 transition">
              Connect
            </button>
          )}
          <Link to="/create"
            className="text-xs px-3 py-1.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/30 transition">
            + New SLA
          </Link>
        </div>
      </div>

      {/* Filters */}
      {wallet.address && (
        <div className="flex gap-1 mb-4">
          {(['all', 'provider', 'operator'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1 rounded transition ${
                filter === f ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}>
              {f === 'all' ? 'All' : f === 'provider' ? 'As Provider' : 'As Operator'}
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-900/50 text-slate-500 uppercase tracking-wider">
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">SLA Spec</th>
              <th className="text-left px-4 py-2">Provider</th>
              <th className="text-left px-4 py-2">Operator</th>
              <th className="text-right px-4 py-2">Stake</th>
              <th className="text-center px-4 py-2">Status</th>
              <th className="text-right px-4 py-2">Deadline</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-slate-600">Loading from chain...</td></tr>
            ) : tickets.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-slate-600">
                {wallet.address ? 'No tickets found.' : 'Connect wallet to see your tickets.'}
              </td></tr>
            ) : (
              tickets.map(t => (
                <tr key={t.id} className="border-t border-slate-800/50 hover:bg-slate-900/30 transition">
                  <td className="px-4 py-3">
                    <Link to={`/ticket/${t.id}`} className="text-cyan-400 hover:text-cyan-300 font-mono">
                      #{t.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 max-w-[200px] truncate text-slate-300">{t.sla_spec}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">
                    <a href={`${EXPLORER_URL}/address/${t.provider}`} target="_blank" rel="noopener noreferrer"
                      className="hover:text-emerald-400 transition">{shortAddr(t.provider)}</a>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-400">
                    <a href={`${EXPLORER_URL}/address/${t.operator}`} target="_blank" rel="noopener noreferrer"
                      className="hover:text-emerald-400 transition">{shortAddr(t.operator)}</a>
                  </td>
                  <td className="px-4 py-3 text-right text-amber-300 font-mono">{fmtGEN(t.stake_amount)} GEN</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] border ${STATUS_COLORS[t.status] ?? 'text-slate-500'}`}>
                      {STATUS_LABELS[t.status] ?? t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500">{fmtDate(t.deadline)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {wallet.error && <p className="mt-3 text-xs text-red-400">{wallet.error}</p>}
    </div>
  )
}
