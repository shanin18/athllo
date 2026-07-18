"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { setVerificationStatus } from "@/lib/actions/verification";

export function VerificationReviewRow({
  athlete,
}: {
  athlete: { user_id: string; display_name: string; slug: string; headline: string | null; total_reach: number };
}) {
  const [resolved, setResolved] = useState(false);
  const [pending, setPending] = useState(false);

  async function handle(status: "verified" | "rejected") {
    setPending(true);
    await setVerificationStatus(athlete.user_id, status);
    setPending(false);
    setResolved(true);
  }

  if (resolved) return null;

  return (
    <Card className="flex items-center justify-between gap-4 p-5">
      <div>
        <Link href={`/athletes/${athlete.slug}`} className="font-display font-bold hover:text-brand" target="_blank">
          {athlete.display_name}
        </Link>
        <p className="mt-0.5 text-sm text-muted">{athlete.headline}</p>
        <p className="mt-0.5 text-xs text-muted">{athlete.total_reach.toLocaleString()} reach</p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" disabled={pending} onClick={() => handle("verified")}>
          Approve
        </Button>
        <Button size="sm" variant="outline" disabled={pending} onClick={() => handle("rejected")}>
          Reject
        </Button>
      </div>
    </Card>
  );
}
