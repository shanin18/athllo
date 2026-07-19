import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const FROM = process.env.EMAIL_FROM ?? `Athlex <${GMAIL_USER}>`;

let transporter: nodemailer.Transporter | null = null;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    });
  }
  return transporter;
}

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.warn("GMAIL_USER/GMAIL_APP_PASSWORD not set — skipping custom email send to", to);
    return;
  }
  await getTransporter().sendMail({ from: FROM, to, subject, html });
}

export function verificationEmailHtml(confirmUrl: string) {
  return `
  <!doctype html>
  <html>
    <body style="margin:0;padding:0;background:#e8eaf0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e8eaf0;padding:40px 16px;">
        <tr>
          <td>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;">
              <tr>
                <td style="border-radius:24px;overflow:hidden;box-shadow:0 8px 30px rgba(11,17,32,0.08);">

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background:linear-gradient(135deg,#0b1120,#1b39ff);padding:36px 40px;text-align:center;">
                        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                          <tr>
                            <td style="width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,0.15);color:#fff;font-weight:800;font-size:15px;text-align:center;vertical-align:middle;">A</td>
                            <td style="padding-left:10px;font-size:17px;font-weight:800;color:#fff;letter-spacing:-0.2px;">Athlex</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
                    <tr>
                      <td style="padding:44px 40px 40px;">
                        <table role="presentation" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg,#1b39ff,#5b7cff);text-align:center;vertical-align:middle;font-size:24px;color:#fff;">✓</td>
                          </tr>
                        </table>
                        <h1 style="font-size:25px;font-weight:800;color:#0b1120;margin:26px 0 10px;letter-spacing:-0.3px;">Confirm your email</h1>
                        <p style="color:#5b6178;font-size:15px;line-height:1.65;margin:0 0 30px;">
                          Welcome to Athlex — the marketplace connecting athletes and brands for
                          sponsorship deals. Confirm your address to activate your account and start
                          exploring.
                        </p>
                        <table role="presentation" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="border-radius:999px;background:#1b39ff;box-shadow:0 4px 14px rgba(27,57,255,0.35);">
                              <a href="${confirmUrl}" style="display:inline-block;padding:15px 34px;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;border-radius:999px;">
                                Confirm email address →
                              </a>
                            </td>
                          </tr>
                        </table>
                        <div style="margin-top:36px;padding-top:24px;border-top:1px solid #eef0f5;">
                          <p style="color:#9aa0b4;font-size:12px;line-height:1.6;margin:0;">
                            Button not working? Paste this link into your browser:<br/>
                            <a href="${confirmUrl}" style="color:#1b39ff;word-break:break-all;">${confirmUrl}</a>
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>
              <tr>
                <td style="padding:24px 12px 0;text-align:center;">
                  <p style="color:#9aa0b4;font-size:12px;margin:0;">
                    If you didn't create an Athlex account, you can safely ignore this email.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}
