"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CheckoutButton({
  tier,
  isSignedIn,
  highlight,
  children,
}: {
  tier: "pro" | "elite";
  isSignedIn: boolean;
  highlight: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (!isSignedIn) {
      router.push(`/signup?next=/pricing`);
      return;
    }
    setLoading(true);
    setError(null);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok || !data.url) {
      setError(data.error ?? "Something went wrong");
      return;
    }
    window.location.href = data.url;
  }

  return (
    <div className="mt-8">
      <Button
        variant={highlight ? "primary" : "outline"}
        className="w-full"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? "Redirecting…" : children}
      </Button>
      {error && <p className="mt-2 text-center text-xs text-energy">{error}</p>}
    </div>
  );
}
