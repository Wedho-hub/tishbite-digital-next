import nodemailer from "nodemailer";

export function getTransporter() {
  const smtpUser = process.env.ZOHO_SMTP_USER;
  const smtpPass = process.env.ZOHO_SMTP_PASS;
  if (!smtpUser || !smtpPass) return null;

  return nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST || "smtp.zoho.com",
    port: Number(process.env.ZOHO_SMTP_PORT) || 465,
    secure: true,
    auth: { user: smtpUser, pass: smtpPass },
  });
}

export async function sendMail({ to, subject, html, replyTo, fromName = "Tishbite Digital" }) {
  const transporter = getTransporter();
  if (!transporter) throw new Error("Email service not configured (ZOHO_SMTP_USER / ZOHO_SMTP_PASS)");

  await transporter.sendMail({
    from: `"${fromName}" <${process.env.ZOHO_SMTP_USER}>`,
    to,
    replyTo,
    subject,
    html,
  });
}

// Shared branded wrapper so every email we send (lead-magnet delivery,
// broadcasts, confirmations) looks consistent, instead of hand-rolling full
// HTML in every call site.
export function brandedEmail({ heading, bodyHtml, footerNote }) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;">
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:32px auto;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">

    <div style="background:#1b4332;padding:28px 32px;">
      <p style="margin:0 0 4px;color:rgba(255,255,255,0.6);font-size:12px;text-transform:uppercase;letter-spacing:1px;">Tishbite Digital</p>
      <h1 style="margin:0;color:#fff;font-size:22px;">${heading}</h1>
    </div>

    <div style="background:#ffffff;padding:28px 32px;font-size:14px;line-height:1.7;color:#374151;">
      ${bodyHtml}
    </div>

    <div style="background:#f9fafb;padding:16px 32px;text-align:center;font-size:12px;color:#9ca3af;border-top:1px solid #e5e7eb;">
      Tishbite Digital · info@tishbitedigital.co.za · +27 64 058 4229
      ${footerNote ? `<div style="margin-top:8px;">${footerNote}</div>` : ""}
    </div>
  </div>
</body>
</html>`;
}
