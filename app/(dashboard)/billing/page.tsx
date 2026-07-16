import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BillingPlans } from "@/components/dashboard/billing-plans";
import { PaymentMethodForm } from "@/components/dashboard/payment-method-form";
import { formatMoney } from "@/lib/utils";
import type { PlanTier } from "@/lib/stripe/client";

export const metadata = { title: "Billing" };

const PLAN_PRICE: Record<PlanTier, string> = { free: "$0/mo", pro: "$29/mo", elite: "$99/mo" };

export default async function BillingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  const [{ data: subscription }, { data: transactions }] = await Promise.all([
    supabase.from("subscriptions").select("tier, status, current_period_end").eq("user_id", user.id).maybeSingle(),
    supabase
      .from("transactions")
      .select("id, amount, currency, status, created_at")
      .eq("payer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const tier = (subscription?.tier as PlanTier) ?? "free";

  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="font-display text-2xl font-extrabold">Billing</h1>
      <p className="mt-1 text-sm text-muted">Manage your plan, payment method, and invoices.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-display text-lg font-bold">Current plan</h2>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="font-display text-xl font-extrabold capitalize">{tier}</div>
                <div className="text-sm text-muted">{PLAN_PRICE[tier]}</div>
              </div>
              <Badge className={tier === "free" ? "" : "border-brand/20 bg-brand-wash text-brand"}>
                {subscription?.status ?? "active"}
              </Badge>
            </div>
            {tier !== "free" && (
              <p className="mt-3 text-xs text-muted">
                {subscription?.current_period_end
                  ? `Renews ${new Date(subscription.current_period_end).toLocaleDateString()}`
                  : "Renews automatically each month"}
              </p>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-lg font-bold">Payment method</h2>
            <p className="mt-1 text-sm text-muted">No payment provider is connected yet — this is a demo form.</p>
            <div className="mt-4">
              <PaymentMethodForm />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-lg font-bold">Billing history</h2>
            <div className="mt-4 divide-y divide-line">
              {(transactions ?? []).length === 0 && (
                <p className="py-3.5 text-sm text-muted">No invoices yet.</p>
              )}
              {(transactions ?? []).map((t) => (
                <div key={t.id} className="flex items-center justify-between py-3.5">
                  <div>
                    <div className="stat-num text-sm font-bold">
                      {formatMoney(Number(t.amount ?? 0) * 100, t.currency)}
                    </div>
                    <div className="text-xs text-muted">
                      {new Date(t.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="font-display text-lg font-bold">Change plan</h2>
          <p className="mt-1 text-sm text-muted">Pick a plan and confirm to switch.</p>
          <div className="mt-4">
            <BillingPlans currentTier={tier} />
          </div>
        </Card>
      </div>
    </div>
  );
}
