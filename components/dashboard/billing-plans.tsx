"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { upgradePlan, downgradeToFree } from "@/lib/actions/billing";
import type { PlanTier } from "@/lib/stripe/client";

const TIERS: {
  tier: PlanTier;
  name: string;
  price: string;
  features: string[];
}[] = [
  { tier: "free", name: "Free", price: "$0/mo", features: ["Public profile", "Basic search visibility"] },
  {
    tier: "pro",
    name: "Pro",
    price: "$29/mo",
    features: ["Unlimited inquiries", "Priority search ranking", "Verified badge"],
  },
  {
    tier: "elite",
    name: "Elite",
    price: "$99/mo",
    features: ["Everything in Pro", "Featured placement", "Dedicated support"],
  },
];

export function BillingPlans({ currentTier: initialTier }: { currentTier: PlanTier }) {
  const [currentTier, setCurrentTier] = useState(initialTier);
  const [pendingTier, setPendingTier] = useState<PlanTier | null>(null);
  const [pending, startTransition] = useTransition();
  const [successTier, setSuccessTier] = useState<PlanTier | null>(null);

  function handleSelect(tier: PlanTier) {
    if (tier === currentTier || pending) return;
    setPendingTier(tier);
    startTransition(async () => {
      const result = tier === "free" ? await downgradeToFree() : await upgradePlan(tier);
      setPendingTier(null);
      if (result.ok) {
        setCurrentTier(tier);
        setSuccessTier(tier);
      }
    });
  }

  return (
    <>
      <div className="space-y-3">
        {TIERS.map((t) => (
          <button
            key={t.tier}
            type="button"
            onClick={() => handleSelect(t.tier)}
            disabled={pending}
            className={cn(
              "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-colors disabled:cursor-default",
              t.tier === currentTier
                ? "border-brand bg-brand-wash/40"
                : "border-line hover:bg-brand-wash/10"
            )}
          >
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold">{t.name}</span>
                <div className="flex items-center gap-2">
                  <span className="stat-num text-sm font-bold">{t.price}</span>
                  {t.tier === currentTier ? (
                    <span className="rounded-full bg-brand-wash px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-brand">
                      Current
                    </span>
                  ) : pendingTier === t.tier ? (
                    <Loader2 className="h-4 w-4 animate-spin text-brand" />
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                      Switch
                    </span>
                  )}
                </div>
              </div>
              <ul className="mt-2 space-y-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-muted">
                    <Check className="h-3 w-3 shrink-0 text-brand" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </button>
        ))}
      </div>

      {successTier && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-panel/60 p-4"
          onClick={() => setSuccessTier(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-surface p-8 text-center shadow-lift"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-wash text-brand">
              <PartyPopper className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-display text-xl font-bold">
              {successTier === "free" ? "Plan updated" : "Payment successful"}
            </h2>
            <p className="mt-2 text-sm text-muted">
              You're now on the {TIERS.find((t) => t.tier === successTier)?.name} plan.
              {successTier !== "free" && " This is a demo charge — no card was actually billed."}
            </p>
            <Button className="mt-6 w-full" onClick={() => setSuccessTier(null)}>
              Done
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
