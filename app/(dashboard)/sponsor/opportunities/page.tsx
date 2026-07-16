import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { CreateOpportunityForm } from "@/components/dashboard/create-opportunity-form";

export const metadata = { title: "Opportunities" };

export default async function SponsorOpportunities() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  const { data: sponsorProfile } = await supabase
    .from("sponsor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: opportunities } = await supabase
    .from("opportunities")
    .select("id, title, description, status, budget_min, budget_max, created_at")
    .eq("sponsor_id", sponsorProfile?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="font-display text-2xl font-extrabold">Opportunities</h1>
      <p className="mt-1 text-sm text-muted">Post a campaign and let athletes come to you.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card className="p-6">
          <h2 className="font-display text-lg font-bold">New opportunity</h2>
          <div className="mt-4">
            <CreateOpportunityForm />
          </div>
        </Card>

        <div className="space-y-4">
          {(opportunities ?? []).length === 0 && (
            <Card className="p-8 text-center text-sm text-muted">
              You haven't posted an opportunity yet.
            </Card>
          )}
          {(opportunities ?? []).map((o) => (
            <Card key={o.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="text-sm font-semibold">{o.title}</div>
                <span className="shrink-0 font-mono text-[11px] uppercase tracking-widest text-muted">
                  {o.status}
                </span>
              </div>
              {o.description && (
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{o.description}</p>
              )}
              {(o.budget_min || o.budget_max) && (
                <p className="mt-3 stat-num text-sm font-bold">
                  ${o.budget_min ?? 0} – ${o.budget_max ?? "∞"}
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
