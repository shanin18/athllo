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
  avatarUrl: string | null;
  avatarPos: string;
  coverUrl: string | null;
  coverPos: string;
};

export type AthleteFilters = {
  q?: string;
  sport?: string;
  minReach?: number;
  location?: string;
  maxBudget?: number;
  sort?: "reach" | "recent" | "relevance";
  page?: number;
  pageSize?: number;
};

export type AthleteDetail = AthleteCard & {
  userId: string;
  headline: string;
  bio: string;
  achievements: string[];
  stats: [string, string][];
};

const CARD_SELECT =
  "slug, display_name, location, total_reach, campaign_rate, verification_status, avatar_url, avatar_pos, cover_url, cover_pos, sports(name)";

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
    avatarUrl: row.avatar_url ?? null,
    avatarPos: row.avatar_pos ?? "50% 50%",
    coverUrl: row.cover_url ?? null,
    coverPos: row.cover_pos ?? "50% 50%",
  };
}

export async function getAthletes(
  filters: AthleteFilters = {}
): Promise<{ items: AthleteCard[]; hasMore: boolean }> {
  const supabase = await createClient();
  const hasSportFilter = !!filters.sport && filters.sport !== "All sports";
  const select = hasSportFilter ? CARD_SELECT.replace("sports(name)", "sports!inner(name)") : CARD_SELECT;
  let query = supabase.from("athlete_profiles").select(select);

  if (filters.q) {
    query = query.ilike("display_name", `%${filters.q}%`);
  }
  if (hasSportFilter) {
    query = query.eq("sports.name", filters.sport);
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

  const pageSize = filters.pageSize ?? 8;
  const page = filters.page ?? 0;
  const from = page * pageSize;
  const to = from + pageSize; // fetch one extra to detect hasMore
  query = query.range(from, to);

  const { data, error } = await query;
  if (error || !data) return { items: [], hasMore: false };
  const hasMore = data.length > pageSize;
  return { items: data.slice(0, pageSize).map(toCard), hasMore };
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
      "user_id, slug, display_name, headline, bio, location, total_reach, campaign_rate, verification_status, avatar_url, avatar_pos, cover_url, cover_pos, achievements, social_stats, sports(name)"
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
    stats: Object.entries(data.social_stats ?? {}).map(([platform, count]) => [
      platform,
      /^\d+$/.test(String(count)) ? formatReach(Number(count)) : String(count),
    ]) as [string, string][],
  };
}
