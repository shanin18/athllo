"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createOpportunity, type OpportunityActionState } from "@/lib/actions/opportunities";

const initialState: OpportunityActionState = { ok: false, message: "" };

export function CreateOpportunityForm() {
  const [state, formAction, pending] = useActionState(createOpportunity, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-soft">Title</label>
        <Input name="title" placeholder="Summer running campaign" required />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-soft">Description</label>
        <textarea
          name="description"
          rows={4}
          placeholder="What are you looking for?"
          className="w-full resize-none rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-soft">Budget min (USD)</label>
          <Input name="budgetMin" type="number" min={0} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-soft">Budget max (USD)</label>
          <Input name="budgetMax" type="number" min={0} />
        </div>
      </div>
      {state.message && (
        <p className={`text-sm ${state.ok ? "text-brand" : "text-energy"}`}>{state.message}</p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Posting…" : "Post opportunity"}
      </Button>
    </form>
  );
}
