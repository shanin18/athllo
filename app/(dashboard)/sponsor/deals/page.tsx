import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/utils";

export const metadata = { title: "Deals" };

export default async function SponsorDeals() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  const { data: sponsorProfile } = await supabase
    .from("sponsor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: deals } = await supabase
    .from("deals")
    .select("id, title, amount, currency, status, athlete_profiles(display_name)")
    .eq("sponsor_id", sponsorProfile?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="font-display text-2xl font-extrabold">Deals</h1>
      <p className="mt-1 text-sm text-muted">Every campaign you've funded, past and present.</p>

      <div className="mt-8 space-y-4">
        {(deals ?? []).length === 0 && (
          <Card className="p-8 text-center text-sm text-muted">No deals yet.</Card>
        )}
        {(deals ?? []).map((d: any) => (
          <Card key={d.id} className="flex items-center justify-between p-6">
            <div>
              <div className="text-sm font-semibold">{d.title}</div>
              <div className="mt-0.5 text-xs text-muted">
                {d.athlete_profiles?.display_name ?? "Unknown athlete"}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="stat-num text-sm font-bold">
                {formatMoney(Number(d.amount ?? 0) * 100, d.currency)}
              </span>
              <Badge>{d.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
