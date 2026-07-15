import { createClient } from "@/lib/supabase/server";
import { formatMoney, formatReach } from "@/lib/utils";

export type AthleteCard = {
  slug: string;
  name: string;
  sport: string;
  reach: string;
  loc: string;
  rate: string;
  verified: boolean;
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
    loc: row.location ?? "",
    rate: formatMoney((row.campaign_rate ?? 0) * 100),
    verified: row.verification_status === "verified",
  };
}

export async function getAthletes(): Promise<AthleteCard[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("athlete_profiles")
    .select(CARD_SELECT)
    .order("total_reach", { ascending: false });
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
