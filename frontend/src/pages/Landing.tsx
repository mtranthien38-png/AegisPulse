import { Link } from 'react-router-dom'

export function Landing() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(77,212,255,0.16),_transparent_30%),linear-gradient(180deg,#0b1020,#090d18)] text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-cyan-300/80">
          AegisPulse
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">
          Detect anomalies before they become incidents.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Infrastructure monitoring powered by GenLayer. Register assets, score
          alerts with AI consensus, and manage incident response — all on-chain.
        </p>
        <div className="mt-10 flex gap-3">
          <Link
            className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-300"
            to="/dashboard"
          >
            Open dashboard
          </Link>
          <a
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white/90 transition hover:bg-white/5"
            href="#features"
          >
            Learn more
          </a>
        </div>

        <div id="features" className="mt-20 grid gap-4 md:grid-cols-3">
          {[
            ['Monitor', 'Track validators, services, relays, and watchpoints with structured health signals.'],
            ['Triage', 'Turn alerts into incidents with consistent severity, owner, and next-step metadata.'],
            ['Respond', 'Use GenLayer-backed AI scoring to keep high-risk events transparent and auditable.'],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-cyan-200">{title}</p>
              <p className="mt-2 text-slate-300">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ['On-chain', 'Every asset registration, alert score, and incident is a GenLayer transaction.'],
            ['AI consensus', 'Alert scoring uses multi-validator AI consensus — no single point of failure.'],
            ['Auditable', 'Full incident trail from alert detection to resolution, all on the blockchain.'],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-5">
              <p className="text-sm text-cyan-200">{title}</p>
              <p className="mt-2 text-sm text-slate-400">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-300">
          <Link className="underline decoration-cyan-300/60 underline-offset-4 hover:text-cyan-200" to="/assets">Assets</Link>
          <Link className="underline decoration-cyan-300/60 underline-offset-4 hover:text-cyan-200" to="/alerts">Alerts</Link>
          <Link className="underline decoration-cyan-300/60 underline-offset-4 hover:text-cyan-200" to="/incidents">Incidents</Link>
        </div>
      </section>
    </main>
  )
}
