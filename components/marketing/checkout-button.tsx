"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

// Stripe isn't configured yet — always route through the real, current
// session state (checked client-side to avoid any stale server-render
// of the signed-in status) instead of hitting /api/checkout.
export function CheckoutButton({
  highlight,
  variant,
  children,
}: {
  tier: "free" | "pro" | "elite";
  highlight: boolean;
  variant?: "primary" | "outline";
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      router.push("/signup?next=/billing");
      return;
    }

    setLoading(false);
    router.push("/billing");
  }

  return (
    <Button
      variant={variant ?? (highlight ? "primary" : "outline")}
      className="mt-8 w-full"
      onClick={handleClick}
      loading={loading}
    >
      {children}
    </Button>
  );
}
