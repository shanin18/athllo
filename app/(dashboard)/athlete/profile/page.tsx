import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { AthleteProfileForm } from "@/components/dashboard/athlete-profile-form";

export const metadata = { title: "My profile" };

export default async function AthleteProfileSettings() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("athlete_profiles")
    .select("display_name, headline, bio, location, career_stage, campaign_rate")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="font-display text-2xl font-extrabold">My profile</h1>
      <p className="mt-1 text-sm text-muted">This is what brands see when they view your profile.</p>
      <Card className="mt-8 max-w-2xl p-6">
        <AthleteProfileForm profile={profile ?? null} />
      </Card>
    </div>
  );
}
