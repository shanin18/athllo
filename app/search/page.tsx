import Link from "next/link";
import Image from "next/image";
import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { BadgeCheck } from "lucide-react";
import { getAthletes } from "@/lib/data/athletes";
import { sportImageUrl } from "@/lib/sport-images";
import { SearchFilters } from "@/components/marketing/search-filters";

export const metadata = { title: "Discover athletes" };
export const revalidate = 60;

const SPORTS = ["All sports", "Surfing", "Track & Field", "Basketball", "Climbing", "Football", "Cycling"];
const REACH_TIERS: Record<string, number> = { "500K+": 500_000, "1M+": 1_000_000, "3M+": 3_000_000 };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const sport = sp.sport ?? "All sports";
  const reachTier = sp.reach ?? "";
  const location = sp.location ?? "";
  const maxBudget = sp.budget ? Number(sp.budget) : undefined;
  const sort = (sp.sort as "reach" | "recent" | "relevance") ?? "reach";

  const ATHLETES = await getAthletes({
    q: q || undefined,
    sport,
    minReach: REACH_TIERS[reachTier],
    location: location || undefined,
    maxBudget,
    sort,
  });

  return (
    <>
      <SiteNav />
      <div className="container-x py-10">
        <h1 className="display text-3xl md:text-4xl">Discover athletes</h1>
        <p className="mt-2 text-muted">Filter by sport, reach, budget, and location.</p>

        <SearchFilters
          sports={SPORTS}
          values={{ q, sport, reach: reachTier, location, budget: sp.budget ?? "", sort }}
        />

        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-widest text-muted">
            {ATHLETES.length} athletes
          </span>
        </div>

        {ATHLETES.length === 0 && (
          <p className="mt-16 text-center text-sm text-muted">No athletes match those filters.</p>
        )}

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ATHLETES.map((a) => (
            <Link key={a.slug} href={`/athletes/${a.slug}`}>
              <Card className="group overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={sportImageUrl(a.sport)}
                    alt={a.sport}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
                    <Avatar seed={a.slug} size={28} />
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
      <SiteFooter />
    </>
  );
}
