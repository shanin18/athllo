import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/utils";

export const metadata = { title: "Payouts" };

export default async function AthletePayouts() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, amount, currency, status, created_at")
    .eq("payee_id", user.id)
    .order("created_at", { ascending: false });

  const available = (transactions ?? [])
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + Number(t.amount ?? 0), 0);

  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="font-display text-2xl font-extrabold">Payouts</h1>
      <p className="mt-1 text-sm text-muted">Connect Stripe to receive payments from completed deals.</p>

      <Card className="mt-8 max-w-sm p-6 text-center">
        <div className="stat-num text-3xl font-bold">{formatMoney(available * 100)}</div>
        <div className="text-xs text-muted">available balance</div>
        <Button className="mt-5 w-full">Set up payouts</Button>
      </Card>

      <h2 className="mt-10 font-display text-lg font-bold">Transaction history</h2>
      <div className="mt-4 space-y-3">
        {(transactions ?? []).length === 0 && (
          <Card className="p-8 text-center text-sm text-muted">No transactions yet.</Card>
        )}
        {(transactions ?? []).map((t) => (
          <Card key={t.id} className="flex items-center justify-between p-5">
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
          </Card>
        ))}
      </div>
    </div>
  );
}
