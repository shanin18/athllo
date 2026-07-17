"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sportImageUrl } from "@/lib/sport-images";
import { cn } from "@/lib/utils";

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

      <div className="relative h-72 overflow-hidden rounded-2xl md:h-96">
        {sports.map((s) => (
          <Image
            key={s}
            src={sportImageUrl(s, 1200)}
            alt={s}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className={cn(
              "object-cover transition-opacity duration-500",
              active === s ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
              {active}
            </span>
            <div className="stat-num mt-1 text-4xl font-bold text-white">
              {counts[active] ?? 0} <span className="text-lg font-normal text-white/60">athletes</span>
            </div>
          </div>
          <Link href={`/search?sport=${encodeURIComponent(active)}`}>
            <Button size="sm">
              Browse {active} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
