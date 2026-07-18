"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { sportImageUrl } from "@/lib/sport-images";
import type { AthleteCard } from "@/lib/data/athletes";

const REACH_TIERS: Record<string, number> = { "500K+": 500_000, "1M+": 1_000_000, "3M+": 3_000_000 };

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <div className="h-40 animate-pulse bg-surface" />
      <div className="space-y-3 p-5">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 animate-pulse rounded-full bg-surface" />
          <div className="h-4 w-28 animate-pulse rounded bg-surface" />
        </div>
        <div className="h-3 w-20 animate-pulse rounded bg-surface" />
        <div className="h-4 w-16 animate-pulse rounded bg-surface" />
      </div>
    </div>
  );
}

export function AthleteResults({
  q,
  sport,
  reach,
  location,
  budget,
  sort,
}: {
  q: string;
  sport: string;
  reach: string;
  location: string;
  budget: string;
  sort: string;
}) {
  const [items, setItems] = useState<AthleteCard[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const query = new URLSearchParams();
  if (q) query.set("q", q);
  if (sport) query.set("sport", sport);
  if (reach && REACH_TIERS[reach]) query.set("minReach", String(REACH_TIERS[reach]));
  if (location) query.set("location", location);
  if (budget) query.set("budget", budget);
  if (sort) query.set("sort", sort);
  const baseQuery = query.toString();

  const fetchPage = useCallback(
    async (pageNum: number, reset: boolean) => {
      setLoading(true);
      const params = new URLSearchParams(baseQuery);
      params.set("page", String(pageNum));
      const res = await fetch(`/api/athletes?${params.toString()}`);
      const data = await res.json();
      setItems((prev) => (reset ? data.items : [...prev, ...data.items]));
      setHasMore(data.hasMore);
      setLoading(false);
    },
    [baseQuery]
  );

  useEffect(() => {
    setPage(0);
    fetchPage(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseQuery]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const next = page + 1;
          setPage(next);
          fetchPage(next, false);
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, page, fetchPage]);

  return (
    <>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          {items.length} athlete{items.length === 1 ? "" : "s"} loaded
        </span>
      </div>

      {!loading && items.length === 0 && (
        <p className="mt-16 text-center text-sm text-muted">No athletes match those filters.</p>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a, i) => (
          <Link key={a.slug} href={`/athletes/${a.slug}`}>
            <Card className="group overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={a.coverUrl ?? sportImageUrl(a.sport)}
                  alt={a.sport}
                  fill
                  priority={i < 3}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  style={a.coverUrl ? { objectPosition: a.coverPos } : undefined}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-panel/80 via-panel/10 to-transparent" />
                <span className="absolute left-4 top-4 font-mono text-[11px] uppercase tracking-widest text-white/70">
                  {a.sport}
                </span>
                <div className="absolute bottom-4 left-4">
                  <div className="stat-num text-2xl font-bold text-white">{a.reach}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/60">
                    total reach
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2.5">
                  <Avatar
                    seed={a.slug}
                    src={a.avatarUrl}
                    size={28}
                    style={a.avatarUrl ? { objectPosition: a.avatarPos } : undefined}
                  />
                  <h3 className="font-display text-lg font-bold">{a.name}</h3>
                  {a.verified && <BadgeCheck className="h-4 w-4 text-brand" />}
                </div>
                <p className="text-sm text-muted">{a.loc}</p>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                  <span className="stat-num text-sm font-bold">
                    {a.rate}
                    <span className="font-sans font-normal text-muted"> /campaign</span>
                  </span>
                  {!a.verified && <Badge>Unverified</Badge>}
                </div>
              </div>
            </Card>
          </Link>
        ))}
        {loading && Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={`sk-${i}`} />)}
      </div>

      <div ref={sentinelRef} className="h-1" />
    </>
  );
}
