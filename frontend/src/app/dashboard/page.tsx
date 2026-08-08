const cards = [
  { label: "Monitored assets", value: "12" },
  { label: "Open alerts", value: "3" },
  { label: "Active incidents", value: "1" },
  { label: "MTTA", value: "4.8m" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">{card.label}</p>
              <p className="mt-3 text-3xl font-semibold">{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

