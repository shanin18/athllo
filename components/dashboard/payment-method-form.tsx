"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// No Stripe yet — this is a cosmetic form that "saves" nothing server-side.
// Swap for Stripe Elements / a SetupIntent once billing goes live.
export function PaymentMethodForm() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(card.number.slice(-4).padStart(4, "•"));
    }, 700);
  }

  if (saved) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-line p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-wash text-brand">
            <CreditCard className="h-4 w-4" />
          </span>
          <div>
            <div className="text-sm font-semibold">Card ending in {saved}</div>
            <div className="text-xs text-muted">Expires {card.expiry || "--/--"}</div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setSaved(null)}>
          Change
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-soft">Card number</label>
        <Input
          inputMode="numeric"
          placeholder="4242 4242 4242 4242"
          required
          maxLength={19}
          value={card.number}
          onChange={(e) => setCard({ ...card, number: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-soft">Name on card</label>
        <Input
          placeholder="Jane Doe"
          required
          value={card.name}
          onChange={(e) => setCard({ ...card, name: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-soft">Expiry</label>
          <Input
            placeholder="MM/YY"
            required
            maxLength={5}
            value={card.expiry}
            onChange={(e) => setCard({ ...card, expiry: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-soft">CVC</label>
          <Input
            inputMode="numeric"
            placeholder="123"
            required
            maxLength={4}
            value={card.cvc}
            onChange={(e) => setCard({ ...card, cvc: e.target.value })}
          />
        </div>
      </div>
      <Button type="submit" loading={saving}>
        Save card
      </Button>
    </form>
  );
}
