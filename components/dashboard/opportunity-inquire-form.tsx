"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { sendInquiry, type InquiryActionState } from "@/lib/actions/inquiries";

const initialState: InquiryActionState = { ok: false, message: "" };

export function OpportunityInquireForm({
  recipientId,
  opportunityTitle,
}: {
  recipientId: string;
  opportunityTitle: string;
}) {
  const [state, formAction, pending] = useActionState(sendInquiry, initialState);
  const [open, setOpen] = useState(false);

  if (state.ok) {
    return <p className="mt-4 rounded-xl bg-brand-wash p-3 text-sm text-brand">{state.message}</p>;
  }

  if (!open) {
    return (
      <Button size="sm" className="mt-4" onClick={() => setOpen(true)}>
        Apply
      </Button>
    );
  }

  return (
    <form action={formAction} className="mt-4 space-y-2.5">
      <input type="hidden" name="recipientId" value={recipientId} />
      <input type="hidden" name="subject" value={`Application: ${opportunityTitle}`} />
      <textarea
        name="message"
        placeholder="Introduce yourself and why you're a fit…"
        required
        minLength={10}
        className="h-20 w-full resize-none rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none"
      />
      {state.message && !state.ok && <p className="text-xs text-energy">{state.message}</p>}
      <div className="flex gap-2">
        <Button size="sm" type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send application"}
        </Button>
        <Button size="sm" variant="outline" type="button" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
