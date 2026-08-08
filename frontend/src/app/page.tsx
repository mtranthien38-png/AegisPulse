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
      </section>
    </main>
  );
}

