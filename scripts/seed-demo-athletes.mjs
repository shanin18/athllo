import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Missing Supabase env vars");

const admin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

const ATHLETES = [
  {
    email: "sana.ito@athllo.test",
    slug: "sana-ito",
    display_name: "Sana Ito",
    headline: "3x national champion. Ocean advocate.",
    bio: "Professional surfer competing on the world tour, with a community built around sustainable ocean sports and coastal conservation.",
    location: "Lisbon, Portugal",
    sportSlug: "surfing",
    career_stage: "pro",
    campaign_rate: 12000,
    total_reach: 3200000,
    social_stats: { Instagram: "1.8M", TikTok: "980K", YouTube: "420K" },
    achievements: ["3x National Champion", "WSL Tour competitor", "2M+ engaged community"],
    verification_status: "verified",
    is_featured: true,
  },
  {
    email: "maya.okonkwo@athllo.test",
    slug: "maya-okonkwo",
    display_name: "Maya Okonkwo",
    headline: "Sprinter. Two-time European medalist.",
    bio: "400m specialist and mentor to young athletes, partnering with brands that back the next generation of track talent.",
    location: "London, UK",
    sportSlug: "track-field",
    career_stage: "pro",
    campaign_rate: 8000,
    total_reach: 2400000,
    social_stats: { Instagram: "1.4M", TikTok: "760K", YouTube: "240K" },
    achievements: ["2x European medalist", "National record holder", "Youth mentor program"],
    verification_status: "verified",
    is_featured: true,
  },
  {
    email: "tariq.bello@athllo.test",
    slug: "tariq-bello",
    display_name: "Tariq Bello",
    headline: "Guard. Rising star on the continental circuit.",
    bio: "Point guard known for clutch performances and a fast-growing highlight reel across West Africa's pro leagues.",
    location: "Lagos, Nigeria",
    sportSlug: "basketball",
    career_stage: "semi_pro",
    campaign_rate: 7000,
    total_reach: 1900000,
    social_stats: { Instagram: "1.2M", TikTok: "540K", YouTube: "160K" },
    achievements: ["League MVP finalist", "1M+ engaged community"],
    verification_status: "verified",
    is_featured: true,
  },
  {
    email: "aisha.karim@athllo.test",
    slug: "aisha-karim",
    display_name: "Aisha Karim",
    headline: "Sport climber. Route-setting the future.",
    bio: "Competitive lead climber and gym owner, building the Gulf region's climbing scene from the ground up.",
    location: "Dubai, UAE",
    sportSlug: "climbing",
    career_stage: "semi_pro",
    campaign_rate: 5000,
    total_reach: 1100000,
    social_stats: { Instagram: "820K", TikTok: "220K", YouTube: "60K" },
    achievements: ["Regional lead champion", "Gym owner & coach"],
    verification_status: "unverified",
    is_featured: false,
  },
  {
    email: "diego.ramos@athllo.test",
    slug: "diego-ramos",
    display_name: "Diego Ramos",
    headline: "Winger. Academy graduate turned starter.",
    bio: "Left winger known for pace and finishing, breaking into the first team after years in the academy pipeline.",
    location: "Madrid, Spain",
    sportSlug: "football",
    career_stage: "pro",
    campaign_rate: 4000,
    total_reach: 890000,
    social_stats: { Instagram: "650K", TikTok: "190K", YouTube: "50K" },
    achievements: ["Academy Player of the Year", "First-team debut 2024"],
    verification_status: "verified",
    is_featured: false,
  },
  {
    email: "leo.andersen@athllo.test",
    slug: "leo-andersen",
    display_name: "Leo Andersen",
    headline: "Endurance cyclist. Nordic circuit regular.",
    bio: "Road cyclist competing across Scandinavia, with a growing following documenting off-season training and gear reviews.",
    location: "Oslo, Norway",
    sportSlug: "cycling",
    career_stage: "amateur",
    campaign_rate: 3000,
    total_reach: 640000,
    social_stats: { Instagram: "420K", TikTok: "150K", YouTube: "70K" },
    achievements: ["Nordic Cup top 10", "Gear review creator"],
    verification_status: "unverified",
    is_featured: false,
  },
];

async function main() {
  const { data: sports, error: sportsError } = await admin.from("sports").select("id, slug");
  if (sportsError) throw sportsError;
  const sportBySlug = Object.fromEntries((sports ?? []).map((s) => [s.slug, s.id]));

  for (const a of ATHLETES) {
    let userId;
    let created, createError;
    for (let attempt = 0; attempt < 4; attempt++) {
      ({ data: created, error: createError } = await admin.auth.admin.createUser({
        email: a.email,
        password: "demo1234",
        email_confirm: true,
        user_metadata: { role: "athlete" },
      }));
      if (!createError || !createError.message.includes("fetch failed")) break;
      await new Promise((r) => setTimeout(r, 1000));
    }

    if (createError) {
      const { data: existing, error: lookupError } = await admin
        .from("users")
        .select("id")
        .eq("email", a.email)
        .maybeSingle();
      if (lookupError || !existing) {
        console.error(`FAILED ${a.email}:`, createError.message, lookupError?.message ?? "");
        continue;
      }
      userId = existing.id;
    } else {
      userId = created.user.id;
    }

    let upsertError;
    for (let attempt = 0; attempt < 4; attempt++) {
      ({ error: upsertError } = await admin
        .from("athlete_profiles")
        .update({
          slug: a.slug,
          display_name: a.display_name,
          headline: a.headline,
          bio: a.bio,
          location: a.location,
          sport_id: sportBySlug[a.sportSlug] ?? null,
          career_stage: a.career_stage,
          campaign_rate: a.campaign_rate,
          total_reach: a.total_reach,
          social_stats: a.social_stats,
          achievements: a.achievements,
          verification_status: a.verification_status,
          is_featured: a.is_featured,
        })
        .eq("user_id", userId));
      if (!upsertError || !upsertError.message.includes("fetch failed")) break;
      await new Promise((r) => setTimeout(r, 1000));
    }

    if (upsertError) {
      console.error(`PROFILE UPDATE FAILED ${a.email}:`, upsertError.message);
      continue;
    }
    console.log(`OK ${a.slug}`);
  }
}

main().then(() => process.exit(0));
