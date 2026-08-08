import { api } from "@/lib/api";
import { Section } from "@/components/section";
import { StatCard } from "@/components/stat-card";
import { ContractPanel } from "@/components/contract-panel";
import { WorkflowPanel } from "@/components/workflow-panel";

export default async function DashboardPage() {
  const [overview, contract, workflow] = await Promise.all([
    api.overview().catch(() => null),
    api.contract().catch(() => null),
    api.workflow().catch(() => null),
  ]);

  const summary = overview?.summary ?? {
    monitored_assets: 0,
    healthy_assets: 0,
    degraded_assets: 0,
    open_alerts: 0,
    open_incidents: 0,
    resolved_incidents: 0,
  };

  const cards = [
    { label: "Monitored assets", value: String(summary.monitored_assets), hint: `${summary.healthy_assets} healthy` },
    { label: "Open alerts", value: String(summary.open_alerts), hint: `${summary.open_incidents} open incidents` },
    { label: "Open incidents", value: String(summary.open_incidents), hint: `${summary.resolved_incidents} resolved` },
    { label: "Resolved incidents", value: String(summary.resolved_incidents), hint: "Contract workflow metrics" },
  ];

  const workflowSteps = workflow?.steps ?? [
    { key: "asset_onboard", label: "Onboard asset", status: "done" },
    { key: "alert_ingest", label: "Ingest alert", status: "done" },
    { key: "contract_score", label: "Score on-chain", status: "done" },
    { key: "incident_open", label: "Open incident", status: "active" },
    { key: "review_close", label: "Review and close", status: "pending" },
  ];

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

        <div className="grid gap-6 lg:grid-cols-3">
          <ContractPanel
            address={contract?.address ?? "0x4FF47a2cF80f48f848679c6B73C4b560912EbeC5"}
            txHash={contract?.deployment_tx_hash ?? "0x69980c8f109895e2380b090d0fc1358964595635e7cecdbe2c3be6f7fa43cd29"}
            network={contract?.network ?? "studionet"}
            registeredAssets={contract?.runtime?.registered_assets}
            trackedAlerts={contract?.runtime?.tracked_alerts}
            openIncidents={contract?.runtime?.open_incidents}
          />

          <Section eyebrow="Status" title="Operational summary">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-slate-400">Healthy assets</p>
                <p className="mt-2 text-2xl font-semibold">{summary.healthy_assets}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-slate-400">Degraded assets</p>
                <p className="mt-2 text-2xl font-semibold">{summary.degraded_assets}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-slate-400">Open alerts</p>
                <p className="mt-2 text-2xl font-semibold">{summary.open_alerts}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-slate-400">Open incidents</p>
                <p className="mt-2 text-2xl font-semibold">{summary.open_incidents}</p>
              </div>
            </div>
          </Section>

          <WorkflowPanel steps={workflowSteps} />
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

        <Section eyebrow="Contract" title="Write/read flow">
          <div className="space-y-3 text-sm text-slate-300">
            <p>1. Register a monitored asset with the contract.</p>
            <p>2. Score a fresh alert on-chain.</p>
            <p>3. Open an incident after the contract verdict.</p>
            <p>4. Read back the alert or incident state from the contract panel.</p>
          </div>
        </Section>
      </div>
    </main>
  );
}
