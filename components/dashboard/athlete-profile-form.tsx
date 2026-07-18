"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateAthleteProfile, type ProfileActionState } from "@/lib/actions/profile";

const initialState: ProfileActionState = { ok: false, message: "" };

export function AthleteProfileForm({
  profile,
}: {
  profile: {
    display_name: string | null;
    headline: string | null;
    bio: string | null;
    location: string | null;
    career_stage: string | null;
    campaign_rate: number | null;
    social_stats?: Record<string, string> | null;
  } | null;
}) {
  const audience = profile?.social_stats ?? {};
  const [state, formAction, pending] = useActionState(updateAthleteProfile, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-soft">Display name</label>
        <Input name="displayName" defaultValue={profile?.display_name ?? ""} required />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-soft">Headline</label>
        <Input name="headline" defaultValue={profile?.headline ?? ""} placeholder="3x national champion…" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-soft">Bio</label>
        <textarea
          name="bio"
          defaultValue={profile?.bio ?? ""}
          rows={4}
          className="w-full resize-none rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-soft">Location</label>
          <Input name="location" defaultValue={profile?.location ?? ""} placeholder="City, Country" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-soft">Career stage</label>
          <select
            name="careerStage"
            defaultValue={profile?.career_stage ?? ""}
            className="h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-[15px] text-ink"
          >
            <option value="">Select…</option>
            <option value="amateur">Amateur</option>
            <option value="semi_pro">Semi-pro</option>
            <option value="pro">Pro</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-soft">Rate per campaign (USD)</label>
        <Input
          name="campaignRate"
          type="number"
          min={0}
          defaultValue={profile?.campaign_rate ?? ""}
          placeholder="5000"
        />
      </div>
      <div>
        <p className="mb-1.5 text-sm font-medium text-ink-soft">Audience (follower counts)</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {["Instagram", "YouTube", "TikTok"].map((platform) => (
            <div key={platform}>
              <label className="mb-1 block text-xs text-muted">{platform}</label>
              <Input
                name={`audience_${platform}`}
                type="number"
                min={0}
                defaultValue={Number(audience[platform]) || ""}
                placeholder="0"
              />
            </div>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-muted">Your total reach is the sum of these — shown on your public profile.</p>
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
