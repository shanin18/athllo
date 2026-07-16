import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Search, Megaphone, Handshake } from "lucide-react";
import Link from "next/link";
import { createClient, getCurrentUser } from "@/lib/supabase/server";

export const metadata = { title: "Brand dashboard" };

export default async function SponsorDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("sponsor_profiles")
    .select("id, company_name")
    .eq("user_id", user.id)
    .maybeSingle();

  const [{ count: savedCount }, { data: opportunities }] = await Promise.all([
    supabase
      .from("saved_profiles")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("opportunities")
      .select("id, title, status, sports(name)")
      .eq("sponsor_id", profile?.id ?? "")
      .order("created_at", { ascending: false }),
  ]);

  const openCount = (opportunities ?? []).filter((o) => o.status === "open").length;
  const activeDealsCount = (opportunities ?? []).filter((o) => o.status === "active").length;

  const stats = [
    { label: "Shortlisted", value: String(savedCount ?? 0), icon: Search },
    { label: "Open opportunities", value: String(openCount), icon: Megaphone },
    { label: "Active deals", value: String(activeDealsCount), icon: Handshake },
  ];

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar seed={user.email ?? user.id} size={48} />
          <div>
            <h1 className="font-display text-2xl font-extrabold">
              {profile?.company_name ?? "Overview"}
            </h1>
            <p className="mt-1 text-sm text-muted">Find talent and manage your campaigns.</p>
          </div>
        </div>
        <Link href="/search"><Button size="sm"><Search className="h-4 w-4" /> Find athletes</Button></Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">{s.label}</span>
              <s.icon className="h-4 w-4 text-brand" />
            </div>
            <div className="stat-num mt-3 text-3xl font-bold">{s.value}</div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Your opportunities</h2>
          <Link href="/sponsor/opportunities" className="text-sm font-medium text-brand hover:text-brand-ink">
            View all
          </Link>
        </div>
        <div className="mt-4 divide-y divide-line">
          {(opportunities ?? []).length === 0 && (
            <p className="py-3.5 text-sm text-muted">
              You haven't posted an opportunity yet.
            </p>
          )}
          {(opportunities ?? []).map((o: any) => (
            <div key={o.id} className="flex items-center justify-between py-3.5">
              <div>
                <div className="text-sm font-semibold">{o.title}</div>
                <div className="text-sm text-muted">{o.sports?.name ?? "Any sport"}</div>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                {o.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
