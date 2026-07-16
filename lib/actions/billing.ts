"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { PlanTier } from "@/lib/stripe/client";

export type BillingActionState = { ok: boolean; message: string };

// Stripe isn't wired up yet — this simulates a successful checkout so the
// rest of the billing flow (plan badge, dashboard gating) can be built and
// tested end-to-end. Swap the body for a real Stripe Checkout redirect
// later without touching any caller of this action.
export async function upgradePlan(tier: Exclude<PlanTier, "free">): Promise<BillingActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "You must be signed in." };

  const { error } = await supabase
    .from("subscriptions")
    .update({ tier, status: "active" })
    .eq("user_id", user.id);

  if (error) return { ok: false, message: "Could not update your plan." };

  revalidatePath("/billing");
  return { ok: true, message: `You're now on the ${tier === "pro" ? "Pro" : "Elite"} plan.` };
}

export async function downgradeToFree(): Promise<BillingActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "You must be signed in." };

  const { error } = await supabase
    .from("subscriptions")
    .update({ tier: "free", status: "active" })
    .eq("user_id", user.id);

  if (error) return { ok: false, message: "Could not update your plan." };

  revalidatePath("/billing");
  return { ok: true, message: "You're back on the Free plan." };
}
