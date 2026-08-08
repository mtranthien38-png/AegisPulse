import { Section } from "@/components/section";
import { StatCard } from "@/components/stat-card";

const cards = [
  { label: "Monitored assets", value: "12", hint: "Across 3 networks" },
  { label: "Open alerts", value: "3", hint: "2 high-confidence" },
  { label: "Active incidents", value: "2", hint: "1 requires on-call" },
  { label: "MTTA", value: "4.8m", hint: "Mean time to acknowledge" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(77,212,255,0.12),_transparent_25%),linear-gradient(180deg,#09101f,#070b14)] p-6 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">Operations</p>
          <h1 className="text-4xl font-semibold tracking-tight">AegisPulse dashboard</h1>
          <p className="max-w-2xl text-sm text-slate-300">
            A live command surface for monitoring assets, tracking alerts, and driving incident response.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-4">
          {cards.map((card) => (
            <StatCard key={card.label} label={card.label} value={card.value} hint={card.hint} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Section eyebrow="Alerts" title="Recent signal stream">
            <div className="space-y-3">
              {[
                ["Heartbeat missed", "Validator Node A", "high"],
                ["Latency spike", "RPC Gateway", "medium"],
                ["Peer divergence warning", "Bridge Watcher", "high"],
              ].map(([title, asset, severity]) => (
                <div key={title} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-sm text-slate-400">{asset}</p>
                  </div>
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                    {severity}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Section eyebrow="Incidents" title="Active response queue">
            <div className="space-y-3">
              {[
                ["Validator drift detected", "triaged", "isolate"],
                ["RPC gateway instability", "investigating", "gather evidence"],
              ].map(([title, status, next]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="font-medium">{title}</p>
                  <div className="mt-2 flex items-center justify-between text-sm text-slate-400">
                    <span>{status}</span>
                    <span>Next: {next}</span>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </main>
  );
}
