"use server";

import { createClient } from "@/lib/supabase/server";
import { inquirySchema } from "@/lib/validation/schemas";

export type InquiryActionState = { ok: boolean; message: string };

export async function sendInquiry(
  _prev: InquiryActionState,
  formData: FormData
): Promise<InquiryActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "You must be signed in to send an inquiry." };
  }

  const parsed = inquirySchema.safeParse({
    recipientId: formData.get("recipientId"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }
  if (parsed.data.recipientId === user.id) {
    return { ok: false, message: "You can't send an inquiry to yourself." };
  }

  const { error } = await supabase.from("inquiries").insert({
    sender_id: user.id,
    recipient_id: parsed.data.recipientId,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });

  if (error) {
    return { ok: false, message: "Could not send inquiry. Please try again." };
  }
  return { ok: true, message: "Inquiry sent." };
}

export async function saveToShortlist(recipientId: string): Promise<InquiryActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "You must be signed in to save a profile." };
  }
  if (recipientId === user.id) {
    return { ok: false, message: "You can't shortlist yourself." };
  }

  const { error } = await supabase
    .from("saved_profiles")
    .upsert({ user_id: user.id, saved_user_id: recipientId }, { onConflict: "user_id,saved_user_id" });

  if (error) {
    return { ok: false, message: "Could not save profile." };
  }
  return { ok: true, message: "Saved to shortlist." };
}
