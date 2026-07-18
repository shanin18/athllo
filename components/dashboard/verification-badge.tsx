"use client";

import { useState } from "react";
import { BadgeCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requestVerification } from "@/lib/actions/verification";

export function VerificationBadge({ status }: { status: string }) {
  const [current, setCurrent] = useState(status);
  const [pending, setPending] = useState(false);

  if (current === "verified") {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-brand-wash px-3 py-1 text-xs font-medium text-brand">
        <BadgeCheck className="h-3.5 w-3.5" /> Verified
      </span>
    );
  }

  if (current === "pending") {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted">
        <Clock className="h-3.5 w-3.5" /> Verification pending
      </span>
    );
  }

  async function handleRequest() {
    setPending(true);
    const result = await requestVerification();
    setPending(false);
    if (result.ok) setCurrent("pending");
  }

  return (
    <Button size="sm" variant="outline" onClick={handleRequest} disabled={pending}>
      {pending ? "Submitting…" : "Request verification"}
    </Button>
  );
}
