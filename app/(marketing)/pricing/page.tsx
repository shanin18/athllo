import Link from "next/link";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CheckoutButton } from "@/components/marketing/checkout-button";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Pricing" };

const tiers = [
  {
    name: "Free",
    tier: "free" as const,
    price: "$0",
    tag: "Get discovered",
    features: ["Public profile", "Up to 5 inquiries / mo", "Basic search visibility", "Standard payouts"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    tier: "pro" as const,
    price: "$29",
    tag: "For serious talent",
    features: ["Everything in Free", "Unlimited inquiries", "Priority search ranking", "Verified badge", "Deal analytics"],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Elite",
    tier: "elite" as const,
    price: "$99",
    tag: "For brands & agencies",
    features: ["Everything in Pro", "Featured placement", "Post unlimited opportunities", "Team seats", "Dedicated support"],
    cta: "Go Elite",
    highlight: false,
  },
];

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="container-x py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">Pricing</span>
        <h1 className="display mt-4 text-4xl md:text-6xl">Simple plans. No surprises.</h1>
        <p className="mt-4 text-muted">Start free. Upgrade when the deals start coming in.</p>
      </div>
      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {tiers.map((t) => (
          <Card
            key={t.name}
            className={
              t.highlight
                ? "relative border-brand p-8 shadow-lift ring-1 ring-brand"
                : "p-8"
            }
          >
            {t.highlight && (
              <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white">
                Most popular
              </span>
            )}
            <p className="eyebrow">{t.tag}</p>
            <h3 className="mt-3 font-display text-2xl font-extrabold">{t.name}</h3>
            <div className="mt-4 flex items-end gap-1">
              <span className="stat-num text-5xl font-bold">{t.price}</span>
              <span className="mb-1 text-sm text-muted">/month</span>
            </div>
            <ul className="mt-7 space-y-3">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[15px] text-ink-soft">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {f}
                </li>
              ))}
            </ul>
            {t.tier === "free" ? (
              <Link href="/signup" className="mt-8 block">
                <span className="flex h-11 w-full items-center justify-center rounded-full border border-line bg-surface text-[15px] font-medium text-ink transition-colors hover:bg-brand-wash">
                  {t.cta}
                </span>
              </Link>
            ) : (
              <CheckoutButton tier={t.tier} isSignedIn={!!user} highlight={t.highlight}>
                {t.cta}
              </CheckoutButton>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
