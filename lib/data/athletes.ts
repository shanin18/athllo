import { createClient } from "@/lib/supabase/server";
import { formatMoney, formatReach } from "@/lib/utils";

export type AthleteCard = {
  slug: string;
  name: string;
  sport: string;
  reach: string;
  rawReach: number;
  loc: string;
  rate: string;
  rawRate: number;
  verified: boolean;
};

export type AthleteFilters = {
  q?: string;
  sport?: string;
  minReach?: number;
  location?: string;
  maxBudget?: number;
  sort?: "reach" | "recent" | "relevance";
};

export type AthleteDetail = AthleteCard & {
  userId: string;
  headline: string;
  bio: string;
  achievements: string[];
  stats: [string, string][];
};

const CARD_SELECT =
  "slug, display_name, location, total_reach, campaign_rate, verification_status, sports(name)";

function toCard(row: any): AthleteCard {
  return {
    slug: row.slug,
    name: row.display_name,
    sport: row.sports?.name ?? "Unspecified",
    reach: formatReach(row.total_reach ?? 0),
    rawReach: row.total_reach ?? 0,
    loc: row.location ?? "",
    rate: formatMoney((row.campaign_rate ?? 0) * 100),
    rawRate: row.campaign_rate ?? 0,
    verified: row.verification_status === "verified",
  };
}

export async function getAthletes(filters: AthleteFilters = {}): Promise<AthleteCard[]> {
  const supabase = await createClient();
  let query = supabase.from("athlete_profiles").select(CARD_SELECT);

  if (filters.q) {
    query = query.ilike("display_name", `%${filters.q}%`);
  }
  if (filters.minReach) {
    query = query.gte("total_reach", filters.minReach);
  }
  if (filters.location) {
    query = query.ilike("location", `%${filters.location}%`);
  }
  if (filters.maxBudget) {
    query = query.lte("campaign_rate", filters.maxBudget);
  }

  if (filters.sort === "recent") {
    query = query.order("created_at", { ascending: false });
  } else {
    query = query.order("total_reach", { ascending: false });
  }

  const { data, error } = await query;
  if (error || !data) return [];
  const rows = filters.sport && filters.sport !== "All sports"
    ? data.filter((r: any) => r.sports?.name === filters.sport)
    : data;
  return rows.map(toCard);
}

export async function getSportCounts(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("athlete_profiles").select("sports(name)");
  if (error || !data) return {};
  const counts: Record<string, number> = {};
  for (const row of data as any[]) {
    const name = row.sports?.name;
    if (!name) continue;
    counts[name] = (counts[name] ?? 0) + 1;
  }
  return counts;
}

export async function getFeaturedAthletes(limit = 3): Promise<AthleteCard[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("athlete_profiles")
    .select(CARD_SELECT)
    .eq("is_featured", true)
    .order("total_reach", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data.map(toCard);
}

export async function getAthleteBySlug(slug: string): Promise<AthleteDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("athlete_profiles")
    .select(
      "user_id, slug, display_name, headline, bio, location, total_reach, campaign_rate, verification_status, achievements, social_stats, sports(name)"
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return {
    ...toCard(data),
    userId: data.user_id,
    headline: data.headline ?? "",
    bio: data.bio ?? "",
    achievements: Array.isArray(data.achievements) ? data.achievements : [],
    stats: Object.entries(data.social_stats ?? {}) as [string, string][],
  };
}
