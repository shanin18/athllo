"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SportModel = dynamic(
  () => import("@/components/marketing/sport-model").then((m) => m.SportModel),
  {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse bg-panel" />,
  }
);

export function SportsShowcase({
  sports,
  counts,
}: {
  sports: string[];
  counts: Record<string, number>;
}) {
  const [active, setActive] = useState(sports[0]);

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        {sports.map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={cn(
              "flex shrink-0 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all",
              active === s
                ? "border-brand bg-brand-wash text-brand"
                : "border-line text-ink-soft hover:bg-brand-wash/30"
            )}
          >
            {s}
            <span className="font-mono text-xs text-muted">{counts[s] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="relative h-72 overflow-hidden rounded-2xl bg-panel md:h-96">
        <div key={active} className="absolute inset-0 animate-fade-up">
          <SportModel sport={active} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-panel via-panel/10 to-transparent" />
        <div className="pointer-events-none absolute bottom-6 left-6 right-6 flex items-end justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
              {active} · drag to rotate
            </span>
            <div className="stat-num mt-1 text-4xl font-bold text-white">
              {counts[active] ?? 0} <span className="text-lg font-normal text-white/60">athletes</span>
            </div>
          </div>
          <Link href={`/search?sport=${encodeURIComponent(active)}`} className="pointer-events-auto">
            <Button size="sm">
              Browse {active} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
