"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, verificationEmailHtml } from "@/lib/email/send";
import { signUpSchema } from "@/lib/validation/schemas";

export type SignUpActionState = { ok: boolean; message: string; needsConfirmation?: boolean };

export async function signUpWithCustomEmail(
  _prev: SignUpActionState,
  formData: FormData
): Promise<SignUpActionState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "signup",
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { role: parsed.data.role },
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
    },
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  const confirmUrl = data.properties.action_link;
  try {
    await sendEmail({
      to: parsed.data.email,
      subject: "Confirm your Athlex account",
      html: verificationEmailHtml(confirmUrl),
    });
  } catch (err) {
    return { ok: false, message: "Could not send confirmation email. Please try again or contact support." };
  }

  return { ok: true, message: "Check your email to confirm your account.", needsConfirmation: true };
}

export async function resendConfirmationEmail(email: string): Promise<{ ok: boolean; message: string }> {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
    },
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  try {
    await sendEmail({
      to: email,
      subject: "Confirm your Athlex account",
      html: verificationEmailHtml(data.properties.action_link),
    });
  } catch {
    return { ok: false, message: "Could not resend the email. Please try again." };
  }

  return { ok: true, message: "Confirmation email resent." };
}
