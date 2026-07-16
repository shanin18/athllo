import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { SponsorProfileForm } from "@/components/dashboard/sponsor-profile-form";

export const metadata = { title: "Company profile" };

export default async function SponsorProfileSettings() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("sponsor_profiles")
    .select("company_name, description, website_url, budget_min, budget_max")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="font-display text-2xl font-extrabold">Company profile</h1>
      <p className="mt-1 text-sm text-muted">This is what athletes see when you send an inquiry.</p>
      <Card className="mt-8 max-w-2xl p-6">
        <SponsorProfileForm profile={profile ?? null} />
      </Card>
    </div>
  );
}
