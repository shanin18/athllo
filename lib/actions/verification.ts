"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type VerificationActionState = { ok: boolean; message: string };

export async function requestVerification(): Promise<VerificationActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "You must be signed in." };

  const { error } = await supabase
    .from("athlete_profiles")
    .update({ verification_status: "pending" })
    .eq("user_id", user.id)
    .eq("verification_status", "unverified");

  if (error) return { ok: false, message: "Could not submit request." };
  revalidatePath("/athlete/profile");
  return { ok: true, message: "Verification requested — we'll review your profile shortly." };
}

export async function setVerificationStatus(
  userId: string,
  status: "verified" | "rejected" | "unverified"
): Promise<VerificationActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("athlete_profiles")
    .update({ verification_status: status })
    .eq("user_id", userId);

  if (error) return { ok: false, message: "Could not update status." };
  revalidatePath("/admin/verifications");
  return { ok: true, message: "Updated." };
}
