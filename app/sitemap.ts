import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const staticRoutes = [
    "",
    "/search",
    "/pricing",
    "/for-athletes",
    "/for-brands",
    "/about",
    "/contact",
    "/careers",
    "/terms",
    "/privacy",
    "/login",
    "/signup",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const supabase = await createClient();
  const { data } = await supabase.from("athlete_profiles").select("slug, updated_at").limit(2000);
  const athleteRoutes = (data ?? []).map((a) => ({
    url: `${base}/athletes/${a.slug}`,
    lastModified: a.updated_at ? new Date(a.updated_at) : new Date(),
  }));

  return [...staticRoutes, ...athleteRoutes];
}
