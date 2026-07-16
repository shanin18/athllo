import Link from "next/link";
import Image from "next/image";
import { SiteNav } from "@/components/marketing/site-nav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BadgeCheck, SlidersHorizontal } from "lucide-react";
import { getAthletes } from "@/lib/data/athletes";
import { sportImageUrl } from "@/lib/sport-images";

export const metadata = { title: "Discover athletes" };
export const revalidate = 60;

const SPORTS = ["All sports", "Surfing", "Track & Field", "Basketball", "Climbing", "Football", "Cycling"];

export default async function SearchPage() {
  const ATHLETES = await getAthletes();
  return (
    <>
      <SiteNav />
      <div className="container-x py-10">
        <h1 className="display text-3xl md:text-4xl">Discover athletes</h1>
        <p className="mt-2 text-muted">Filter by sport, reach, budget, and location.</p>

        {/* Filter bar */}
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface p-3 shadow-card">
          <Input placeholder="Search by name or sport…" className="max-w-xs flex-1" />
          <select className="h-11 rounded-xl border border-line bg-surface px-3 text-[15px] text-ink">
            {SPORTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select className="h-11 rounded-xl border border-line bg-surface px-3 text-[15px] text-ink">
            <option>Any reach</option>
            <option>500K+</option>
            <option>1M+</option>
            <option>3M+</option>
          </select>
          <Button variant="outline" size="sm" className="ml-auto">
            <SlidersHorizontal className="h-4 w-4" /> More filters
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-widest text-muted">
            {ATHLETES.length} athletes
          </span>
          <select className="h-9 rounded-lg border border-line bg-surface px-3 text-sm text-ink-soft">
            <option>Sort: Relevance</option>
            <option>Sort: Reach</option>
            <option>Sort: Recently active</option>
          </select>
        </div>

        {ATHLETES.length === 0 && (
          <p className="mt-16 text-center text-sm text-muted">No athletes found yet.</p>
        )}

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ATHLETES.map((a) => (
            <Link key={a.slug} href={`/athletes/${a.slug}`}>
              <Card className="overflow-hidden transition-shadow hover:shadow-lift">
                <div className="relative h-40">
                  <Image
                    src={sportImageUrl(a.sport)}
                    alt={a.sport}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
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
                    <Avatar seed={a.slug} size={28} className="-mt-8 border-2 border-surface" />
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
        </div>
      </div>
    </>
  );
}
