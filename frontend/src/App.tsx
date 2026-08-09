import { Route, Routes, Link, useLocation } from 'react-router-dom'
import { Tickets } from './pages/Tickets'
import { CreateTicket } from './pages/CreateTicket'
import { TicketDetail } from './pages/TicketDetail'
import { EXPLORER_URL, CONTRACT_ADDRESS, NETWORK_NAME } from './lib/genlayer'

function Shell({ children }: { children: React.ReactNode }) {
  const loc = useLocation()
  const nav = [
    { path: '/', label: 'Tickets' },
    { path: '/create', label: 'New SLA' },
  ]
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-200 font-mono">
      {/* Top bar */}
      <header className="border-b border-slate-800 bg-[#0a0f1a]/90 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-bold tracking-wider text-emerald-300">AEGISPULSE</span>
            <span className="text-xs text-slate-600">|</span>
            <span className="text-xs text-slate-500">{NETWORK_NAME}</span>
          </div>
          <nav className="flex gap-1">
            {nav.map(n => (
              <Link key={n.path} to={n.path}
                className={`px-3 py-1.5 text-xs rounded transition ${
                  loc.pathname === n.path
                    ? 'bg-emerald-400/15 text-emerald-300'
                    : 'text-slate-500 hover:text-slate-300'
                }`}>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-12">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between text-xs text-slate-600">
          <span>Contract: <a href={`${EXPLORER_URL}/contract/${CONTRACT_ADDRESS}`}
            target="_blank" rel="noopener noreferrer"
            className="text-slate-500 hover:text-emerald-400 transition font-mono">
            {CONTRACT_ADDRESS?.slice(0, 10)}...{CONTRACT_ADDRESS?.slice(-8)}
          </a></span>
          <span>GenLayer Bradbury</span>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Shell><Tickets /></Shell>} />
      <Route path="/create" element={<Shell><CreateTicket /></Shell>} />
      <Route path="/ticket/:id" element={<Shell><TicketDetail /></Shell>} />
    </Routes>
  )
}
