"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { athleteProfileSchema, sponsorProfileSchema } from "@/lib/validation/schemas";

export type ProfileActionState = { ok: boolean; message: string };

export async function updateAthleteProfile(
  _prev: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "You must be signed in." };

  const parsed = athleteProfileSchema.safeParse({
    displayName: formData.get("displayName"),
    headline: formData.get("headline") || undefined,
    bio: formData.get("bio") || undefined,
    location: formData.get("location") || undefined,
    careerStage: formData.get("careerStage") || undefined,
    campaignRate: formData.get("campaignRate") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const PLATFORMS = ["Instagram", "YouTube", "TikTok"];
  const socialStats: Record<string, string> = {};
  let totalReach = 0;
  for (const platform of PLATFORMS) {
    const raw = formData.get(`audience_${platform}`);
    const count = raw ? Number(raw) : 0;
    if (count > 0) {
      socialStats[platform] = String(count);
      totalReach += count;
    }
  }

  const { error } = await supabase
    .from("athlete_profiles")
    .update({
      display_name: parsed.data.displayName,
      headline: parsed.data.headline ?? null,
      bio: parsed.data.bio ?? null,
      location: parsed.data.location ?? null,
      career_stage: parsed.data.careerStage ?? null,
      campaign_rate: parsed.data.campaignRate ?? null,
      social_stats: socialStats,
      total_reach: totalReach,
    })
    .eq("user_id", user.id);

  if (error) return { ok: false, message: "Could not update profile." };
  revalidatePath("/athlete");
  revalidatePath("/athlete/profile");
  return { ok: true, message: "Profile updated." };
}

export async function updateSponsorProfile(
  _prev: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "You must be signed in." };

  const parsed = sponsorProfileSchema.safeParse({
    companyName: formData.get("companyName"),
    description: formData.get("description") || undefined,
    websiteUrl: formData.get("websiteUrl") || "",
    budgetMin: formData.get("budgetMin") || undefined,
    budgetMax: formData.get("budgetMax") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("sponsor_profiles")
    .update({
      company_name: parsed.data.companyName,
      description: parsed.data.description ?? null,
      website_url: parsed.data.websiteUrl || null,
      budget_min: parsed.data.budgetMin ?? null,
      budget_max: parsed.data.budgetMax ?? null,
    })
    .eq("user_id", user.id);

  if (error) return { ok: false, message: "Could not update profile." };
  revalidatePath("/sponsor");
  revalidatePath("/sponsor/profile");
  return { ok: true, message: "Profile updated." };
}
