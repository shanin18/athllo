"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateSponsorProfile, type ProfileActionState } from "@/lib/actions/profile";

const initialState: ProfileActionState = { ok: false, message: "" };

export function SponsorProfileForm({
  profile,
}: {
  profile: {
    company_name: string | null;
    description: string | null;
    website_url: string | null;
    budget_min: number | null;
    budget_max: number | null;
  } | null;
}) {
  const [state, formAction, pending] = useActionState(updateSponsorProfile, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-soft">Company name</label>
        <Input name="companyName" defaultValue={profile?.company_name ?? ""} required />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-soft">Description</label>
        <textarea
          name="description"
          defaultValue={profile?.description ?? ""}
          rows={4}
          className="w-full resize-none rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-soft">Website</label>
        <Input name="websiteUrl" defaultValue={profile?.website_url ?? ""} placeholder="https://…" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-soft">Budget min (USD)</label>
          <Input name="budgetMin" type="number" min={0} defaultValue={profile?.budget_min ?? ""} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-soft">Budget max (USD)</label>
          <Input name="budgetMax" type="number" min={0} defaultValue={profile?.budget_max ?? ""} />
        </div>
      </div>
      {state.message && (
        <p className={`text-sm ${state.ok ? "text-brand" : "text-energy"}`}>{state.message}</p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
