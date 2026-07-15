"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendInquiry, saveToShortlist, type InquiryActionState } from "@/lib/actions/inquiries";

const initialState: InquiryActionState = { ok: false, message: "" };

export function AthleteCta({
  recipientId,
  athleteName,
  isSignedIn,
}: {
  recipientId: string;
  athleteName: string;
  isSignedIn: boolean;
}) {
  const [state, formAction, pending] = useActionState(sendInquiry, initialState);
  const [saveState, setSaveState] = useState<InquiryActionState | null>(null);
  const [saving, setSaving] = useState(false);

  if (!isSignedIn) {
    return (
      <>
        <Link href="/signup" className="mt-5 block">
          <Button className="w-full">Send an inquiry</Button>
        </Link>
        <Link href="/signup" className="mt-2 block">
          <Button variant="outline" className="w-full">
            Save to shortlist
          </Button>
        </Link>
      </>
    );
  }

  async function handleSave() {
    setSaving(true);
    const result = await saveToShortlist(recipientId);
    setSaveState(result);
    setSaving(false);
  }

  return (
    <>
      {state.ok ? (
        <p className="mt-5 rounded-xl bg-brand-wash p-4 text-sm text-brand">{state.message}</p>
      ) : (
        <form action={formAction} className="mt-5 space-y-3">
          <input type="hidden" name="recipientId" value={recipientId} />
          <Input name="subject" placeholder={`Campaign idea for ${athleteName}`} required />
          <textarea
            name="message"
            placeholder="Tell them about the opportunity…"
            required
            minLength={10}
            className="h-24 w-full resize-none rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none"
          />
          {state.message && !state.ok && (
            <p className="text-sm text-energy">{state.message}</p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Sending…" : "Send an inquiry"}
          </Button>
        </form>
      )}
      <Button
        variant="outline"
        className="mt-2 w-full"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving…" : "Save to shortlist"}
      </Button>
      {saveState && (
        <p className={`mt-2 text-center text-xs ${saveState.ok ? "text-brand" : "text-energy"}`}>
          {saveState.message}
        </p>
      )}
    </>
  );
}
