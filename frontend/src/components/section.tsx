import type { ReactNode } from "react";

export function Section({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur">
      {eyebrow ? <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">{eyebrow}</p> : null}
      <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
