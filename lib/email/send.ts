const FROM = process.env.EMAIL_FROM ?? "Athlex <onboarding@athlex.app>";

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping custom email send to", to);
    return;
  }
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
}

export function verificationEmailHtml(confirmUrl: string) {
  return `
  <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0b1120;color:#fff;border-radius:16px;">
    <div style="width:32px;height:32px;border-radius:8px;background:#fff;color:#0b1120;display:flex;align-items:center;justify-content:center;font-weight:800;">A</div>
    <h1 style="font-size:22px;margin-top:24px;">Confirm your email</h1>
    <p style="color:#a0a8c0;font-size:15px;line-height:1.5;">
      Welcome to Athlex — the marketplace connecting athletes and brands. Confirm your email to
      activate your account.
    </p>
    <a href="${confirmUrl}" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#1b39ff;color:#fff;border-radius:999px;text-decoration:none;font-weight:600;">
      Confirm email
    </a>
    <p style="color:#6b7280;font-size:12px;margin-top:24px;">
      If you didn't create an account, you can ignore this email.
    </p>
  </div>`;
}
