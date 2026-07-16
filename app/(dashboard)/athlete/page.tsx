import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, TrendingUp, Inbox, Handshake } from "lucide-react";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { formatMoney, formatReach } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

export const metadata = { title: "Athlete dashboard" };

export default async function AthleteDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("athlete_profiles")
    .select("id, display_name, total_reach, verification_status")
    .eq("user_id", user.id)
    .maybeSingle();

  const [{ count: inquiryCount }, { data: deals }, { data: inquiries }] = await Promise.all([
    supabase
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("recipient_id", user.id)
      .eq("status", "new"),
    supabase
      .from("deals")
      .select("amount")
      .eq("athlete_id", profile?.id ?? "")
      .eq("status", "active"),
    supabase
      .from("inquiries")
      .select("subject, created_at, users:sender_id(email)")
      .eq("recipient_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const activeDealsTotal = (deals ?? []).reduce((sum, d: any) => sum + Number(d.amount ?? 0), 0);

  const stats = [
    { label: "Profile views", value: formatReach(profile?.total_reach ?? 0), delta: "reach", icon: TrendingUp },
    { label: "Open inquiries", value: String(inquiryCount ?? 0), delta: "new", icon: Inbox },
    {
      label: "Active deals",
      value: String((deals ?? []).length),
      delta: formatMoney(activeDealsTotal * 100),
      icon: Handshake,
    },
  ];

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar seed={user.email ?? user.id} size={48} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-extrabold">
                {profile?.display_name ?? "Overview"}
              </h1>
              {profile?.verification_status === "verified" && (
                <Badge className="border-brand/20 bg-brand-wash text-brand">
                  <BadgeCheck className="h-3 w-3" /> Verified
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted">Here's how your profile is performing.</p>
          </div>
        </div>
        <Link href="/athlete/profile">
          <Button variant="outline" size="sm">Edit profile</Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">{s.label}</span>
              <s.icon className="h-4 w-4 text-brand" />
            </div>
            <div className="mt-3 flex items-end gap-2">
              <span className="stat-num text-3xl font-bold">{s.value}</span>
              <span className="mb-1 font-mono text-xs text-brand">{s.delta}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Recent inquiries</h2>
            <Link href="/athlete/inquiries" className="text-sm font-medium text-brand hover:text-brand-ink">
              View all
            </Link>
          </div>
          <div className="mt-4 divide-y divide-line">
            {(inquiries ?? []).length === 0 && (
              <p className="py-3.5 text-sm text-muted">No inquiries yet.</p>
            )}
            {(inquiries ?? []).map((i: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between py-3.5">
                <div>
                  <div className="text-sm font-semibold">{i.users?.email ?? "Unknown"}</div>
                  <div className="text-sm text-muted">{i.subject}</div>
                </div>
                <span className="font-mono text-xs text-muted">
                  {new Date(i.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="font-display text-lg font-bold">Payouts</h2>
          <p className="mt-1 text-sm text-muted">Connect Stripe to receive payments.</p>
          <div className="mt-5 rounded-xl border border-dashed border-line p-5 text-center">
            <div className="stat-num text-2xl font-bold">$0.00</div>
            <div className="text-xs text-muted">available balance</div>
            <Link href="/athlete/payouts">
              <Button size="sm" className="mt-4 w-full">Set up payouts</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
