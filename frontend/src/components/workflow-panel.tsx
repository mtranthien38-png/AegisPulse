const stepStyles: Record<string, string> = {
  done: "bg-emerald-400/10 text-emerald-200 border-emerald-400/20",
  active: "bg-cyan-400/10 text-cyan-200 border-cyan-400/20",
  pending: "bg-white/5 text-slate-300 border-white/10",
};

export function WorkflowPanel({
  steps,
}: {
  steps: Array<{ key: string; label: string; status: string }>;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">Workflow</p>
      <h3 className="mt-2 text-xl font-semibold">App-to-contract lifecycle</h3>
      <div className="mt-5 space-y-3">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-slate-950/60 text-xs text-slate-300">
              {index + 1}
            </div>
            <div className={`flex-1 rounded-2xl border px-3 py-2 text-sm ${stepStyles[step.status] ?? stepStyles.pending}`}>
              {step.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
