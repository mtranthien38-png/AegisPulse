export default function HomePage() {
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
          AegisPulse helps infrastructure teams monitor assets, score risk, and
          coordinate response with a clean operator workflow.
        </p>
        <div className="mt-10 flex gap-3">
          <a className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-medium text-slate-950" href="/dashboard">
            Open dashboard
          </a>
          <a className="rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white/90" href="#features">
            Explore features
          </a>
        </div>
        <div id="features" className="mt-20 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-cyan-200">Monitor</p>
            <p className="mt-2 text-slate-300">Track validators, services, relays, and watchpoints with structured health signals.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-cyan-200">Triage</p>
            <p className="mt-2 text-slate-300">Turn alerts into incidents with consistent severity, owner, and next step metadata.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-cyan-200">Respond</p>
            <p className="mt-2 text-slate-300">Use GenLayer-backed scoring to keep high-risk events transparent and auditable.</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
          <a className="underline decoration-cyan-300/60 underline-offset-4" href="/assets">Assets</a>
          <a className="underline decoration-cyan-300/60 underline-offset-4" href="/alerts">Alerts</a>
          <a className="underline decoration-cyan-300/60 underline-offset-4" href="/incidents">Incidents</a>
        </div>
      </section>
    </main>
  );
}
