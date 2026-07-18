import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { AthleteProfileForm } from "@/components/dashboard/athlete-profile-form";
import { ProfilePhotoUpload } from "@/components/dashboard/profile-photo-upload";
import { VerificationBadge } from "@/components/dashboard/verification-badge";

export const metadata = { title: "My profile" };

export default async function AthleteProfileSettings() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("athlete_profiles")
    .select(
      "display_name, headline, bio, location, career_stage, campaign_rate, avatar_url, avatar_pos, cover_url, cover_pos, social_stats, verification_status"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold">My profile</h1>
        <VerificationBadge status={profile?.verification_status ?? "unverified"} />
      </div>
      <p className="mt-1 text-sm text-muted">This is what brands see when they view your profile.</p>
      <Card className="mt-8 max-w-2xl overflow-hidden p-0">
        <ProfilePhotoUpload
          table="athlete_profiles"
          column="cover_url"
          posColumn="cover_pos"
          userId={user.id}
          initialUrl={profile?.cover_url ?? null}
          initialPos={profile?.cover_pos}
          shape="banner"
        />
        <div className="-mt-10 px-6">
          <ProfilePhotoUpload
            table="athlete_profiles"
            column="avatar_url"
            posColumn="avatar_pos"
            userId={user.id}
            initialUrl={profile?.avatar_url ?? null}
            initialPos={profile?.avatar_pos}
            shape="circle"
          />
        </div>
        <div className="p-6 pt-4">
          <AthleteProfileForm profile={profile ?? null} />
        </div>
      </Card>
    </div>
  );
}
