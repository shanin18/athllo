const ROWS = [
  { name: "Maya Okonkwo", sport: "Track & Field", reach: "2.4M", rate: "$8K" },
  { name: "Diego Ramos", sport: "Football", reach: "890K", rate: "$4K" },
  { name: "Aisha Karim", sport: "Climbing", reach: "1.1M", rate: "$5K" },
  { name: "Leo Andersen", sport: "Cycling", reach: "640K", rate: "$3K" },
  { name: "Sana Ito", sport: "Surfing", reach: "3.2M", rate: "$12K" },
  { name: "Tariq Bello", sport: "Basketball", reach: "1.9M", rate: "$7K" },
];

/**
 * The signature element: a live-telemetry ticker treating athlete reach
 * like scoreboard data. Duplicated once so the marquee loops seamlessly.
 */
export function StatTicker() {
  const stream = [...ROWS, ...ROWS];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-panel py-3">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-panel to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-panel to-transparent" />
      <div className="flex w-max animate-marquee items-center gap-10">
        {stream.map((r, i) => (
          <div key={i} className="flex items-center gap-3 whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-[#39e08e]" />
            <span className="font-mono text-[13px] font-medium text-white/90">
              {r.name}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">
              {r.sport}
            </span>
            <span className="stat-num text-[13px] font-bold text-[#7d92ff]">
              {r.reach}
            </span>
            <span className="stat-num text-[13px] text-white/50">{r.rate}/campaign</span>
          </div>
        ))}
      </div>
    </div>
  );
}
