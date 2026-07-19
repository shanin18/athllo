import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { SponsorProfileForm } from "@/components/dashboard/sponsor-profile-form";
import { ProfilePhotoUpload } from "@/components/dashboard/profile-photo-upload";

export const metadata = { title: "Company profile" };

export default async function SponsorProfileSettings() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("sponsor_profiles")
    .select("company_name, description, website_url, budget_min, budget_max, logo_url, logo_pos, cover_url, cover_pos")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="font-display text-2xl font-extrabold">Company profile</h1>
      <p className="mt-1 text-sm text-muted">This is what athletes see when you send an inquiry.</p>
      <Card className="mt-8 max-w-4xl overflow-hidden p-0">
        <ProfilePhotoUpload
          table="sponsor_profiles"
          column="cover_url"
          posColumn="cover_pos"
          userId={user.id}
          initialUrl={profile?.cover_url ?? null}
          initialPos={profile?.cover_pos}
          shape="banner"
          label="Cover photo"
        />
        <div className="-mt-10 px-6">
          <ProfilePhotoUpload
            table="sponsor_profiles"
            column="logo_url"
            posColumn="logo_pos"
            userId={user.id}
            initialUrl={profile?.logo_url ?? null}
            initialPos={profile?.logo_pos}
            shape="circle"
            label="Company logo"
            className="w-20"
          />
        </div>
        <div className="max-w-2xl p-6 pt-4">
          <SponsorProfileForm profile={profile ?? null} />
        </div>
      </Card>
    </div>
  );
}
