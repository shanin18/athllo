import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { createClient, getCurrentProfile } from "@/lib/supabase/server";
import { VerificationReviewRow } from "@/components/dashboard/verification-review-row";

export const metadata = { title: "Verifications" };

export default async function AdminVerifications() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect("/athlete");

  const supabase = await createClient();
  const { data: pending } = await supabase
    .from("athlete_profiles")
    .select("user_id, display_name, slug, headline, total_reach")
    .eq("verification_status", "pending")
    .order("updated_at", { ascending: true });

  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="font-display text-2xl font-extrabold">Verification requests</h1>
      <p className="mt-1 text-sm text-muted">Review athletes who've requested a verified badge.</p>

      <div className="mt-8 space-y-3">
        {(pending ?? []).length === 0 && (
          <Card className="p-8 text-center text-sm text-muted">No pending requests.</Card>
        )}
        {(pending ?? []).map((p) => (
          <VerificationReviewRow key={p.user_id} athlete={p} />
        ))}
      </div>
    </div>
  );
}
