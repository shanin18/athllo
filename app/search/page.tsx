import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SearchFilters } from "@/components/marketing/search-filters";
import { AthleteResults } from "@/components/marketing/athlete-results";

export const metadata = { title: "Discover athletes" };

const SPORTS = ["All sports", "Surfing", "Track & Field", "Basketball", "Climbing", "Football", "Cycling"];

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
  const budget = sp.budget ?? "";
  const sort = sp.sort ?? "reach";

  return (
    <>
      <SiteNav />
      <div className="container-x py-10">
        <h1 className="display text-3xl md:text-4xl">Discover athletes</h1>
        <p className="mt-2 text-muted">Filter by sport, reach, budget, and location.</p>

        <SearchFilters
          sports={SPORTS}
          values={{ q, sport, reach: reachTier, location, budget, sort }}
        />

        <AthleteResults q={q} sport={sport} reach={reachTier} location={location} budget={budget} sort={sort} />
      </div>
      <SiteFooter />
    </>
  );
}
