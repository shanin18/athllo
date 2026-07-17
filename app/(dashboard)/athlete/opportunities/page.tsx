import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { OpportunityInquireForm } from "@/components/dashboard/opportunity-inquire-form";

export const metadata = { title: "Opportunities" };

export default async function AthleteOpportunities() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  const { data: opportunities } = await supabase
    .from("opportunities")
    .select(
      "id, title, description, budget_min, budget_max, created_at, sponsor_profiles!inner(user_id, company_name, logo_url)"
    )
    .eq("status", "open")
    .order("created_at", { ascending: false });

  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="font-display text-2xl font-extrabold">Opportunities</h1>
      <p className="mt-1 text-sm text-muted">Campaigns brands are currently looking to fill.</p>

      <div className="mt-8 space-y-4">
        {(opportunities ?? []).length === 0 && (
          <Card className="p-10 text-center">
            <p className="text-sm font-medium text-ink">No open opportunities right now.</p>
            <p className="mt-1 text-sm text-muted">
              Brands post campaigns here as they come up — check back soon.
            </p>
          </Card>
        )}
        {(opportunities ?? []).map((o) => {
          const sponsor = o.sponsor_profiles as unknown as {
            user_id: string;
            company_name: string;
            logo_url: string | null;
          };
          return (
            <Card key={o.id} className="p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">{o.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{sponsor?.company_name}</p>
                </div>
                {(o.budget_min || o.budget_max) && (
                  <span className="stat-num shrink-0 text-sm font-bold">
                    ${o.budget_min ?? 0} – ${o.budget_max ?? "∞"}
                  </span>
                )}
              </div>
              {o.description && (
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{o.description}</p>
              )}
              {sponsor?.user_id && (
                <OpportunityInquireForm
                  recipientId={sponsor.user_id}
                  opportunityTitle={o.title}
                />
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
