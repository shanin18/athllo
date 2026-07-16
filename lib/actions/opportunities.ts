"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const createOpportunitySchema = z.object({
  title: z.string().min(2).max(160),
  description: z.string().max(4000).optional(),
  budgetMin: z.coerce.number().min(0).optional(),
  budgetMax: z.coerce.number().min(0).optional(),
});

export type OpportunityActionState = { ok: boolean; message: string };

export async function createOpportunity(
  _prev: OpportunityActionState,
  formData: FormData
): Promise<OpportunityActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "You must be signed in." };

  const parsed = createOpportunitySchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    budgetMin: formData.get("budgetMin") || undefined,
    budgetMax: formData.get("budgetMax") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const { data: sponsorProfile } = await supabase
    .from("sponsor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!sponsorProfile) return { ok: false, message: "Sponsor profile not found." };

  const { error } = await supabase.from("opportunities").insert({
    sponsor_id: sponsorProfile.id,
    title: parsed.data.title,
    description: parsed.data.description ?? null,
    budget_min: parsed.data.budgetMin ?? null,
    budget_max: parsed.data.budgetMax ?? null,
    status: "open",
  });

  if (error) return { ok: false, message: "Could not create opportunity." };
  revalidatePath("/sponsor");
  revalidatePath("/sponsor/opportunities");
  return { ok: true, message: "Opportunity posted." };
}
