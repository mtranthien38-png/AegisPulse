import { Route, Routes, Link, useLocation } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Dashboard } from './pages/Dashboard'
import { Assets } from './pages/Assets'
import { Alerts } from './pages/Alerts'
import { Incidents } from './pages/Incidents'

const navItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/assets', label: 'Assets' },
  { path: '/alerts', label: 'Alerts' },
  { path: '/incidents', label: 'Incidents' },
]

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(77,212,255,0.12),_transparent_25%),linear-gradient(180deg,#09101f,#070b14)]">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#090d18]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link to="/" className="text-lg font-semibold tracking-tight text-cyan-300">
            AegisPulse
          </Link>
          <div className="flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  location.pathname === item.path
                    ? 'bg-cyan-400/15 text-cyan-200'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
      <Route path="/assets" element={<AppLayout><Assets /></AppLayout>} />
      <Route path="/alerts" element={<AppLayout><Alerts /></AppLayout>} />
      <Route path="/incidents" element={<AppLayout><Incidents /></AppLayout>} />
    </Routes>
  )
}
