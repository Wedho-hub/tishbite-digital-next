import nodemailer from "nodemailer";
import connectDB from "@/lib/db";
import Enquiry from "@/models/Enquiry";

export const runtime = "nodejs";

function buildNotificationHtml({ name, email, service, message }) {
  const serviceRow = service
    ? `<tr>
        <td style="padding:8px 0;font-weight:bold;color:#374151;width:110px;vertical-align:top;">Service:</td>
        <td style="padding:8px 0;color:#555;">${service}</td>
      </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;">
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:32px auto;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">

    <div style="background:#1b4332;padding:28px 32px;">
      <p style="margin:0 0 4px;color:rgba(255,255,255,0.6);font-size:12px;text-transform:uppercase;letter-spacing:1px;">Tishbite Digital — Website Enquiry</p>
      <h1 style="margin:0;color:#fff;font-size:22px;">New Enquiry from ${name}</h1>
    </div>

    <div style="background:#ffffff;padding:28px 32px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:8px 0;font-weight:bold;color:#374151;width:110px;vertical-align:top;">Name:</td>
          <td style="padding:8px 0;color:#111;">${name}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-weight:bold;color:#374151;vertical-align:top;">Email:</td>
          <td style="padding:8px 0;"><a href="mailto:${email}" style="color:#1b4332;font-weight:bold;">${email}</a></td>
        </tr>
        ${serviceRow}
        <tr>
          <td style="padding:8px 0;font-weight:bold;color:#374151;vertical-align:top;">Message:</td>
          <td style="padding:8px 0;color:#374151;"></td>
        </tr>
      </table>
      <div style="margin-top:4px;padding:16px;background:#f0f7f3;border-left:4px solid #1b4332;border-radius:0 8px 8px 0;font-size:14px;color:#374151;white-space:pre-wrap;line-height:1.6;">${message}</div>

      <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e5e7eb;">
        <a href="mailto:${email}?subject=Re: Your enquiry to Tishbite Digital"
           style="display:inline-block;background:#1b4332;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;">
          Reply to ${name}
        </a>
      </div>
    </div>

    <div style="background:#f9fafb;padding:16px 32px;text-align:center;font-size:12px;color:#9ca3af;border-top:1px solid #e5e7eb;">
      Tishbite Digital · info@tishbitedigital.co.za · +27 79 168 4548
    </div>
  </div>
</body>
</html>`;
}

function buildAutoReplyHtml({ name, service, message }) {
  const serviceNote = service
    ? `<p style="margin:0 0 16px;color:#555;font-size:14px;">Your enquiry is about: <strong style="color:#1b4332;">${service}</strong></p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;">
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:32px auto;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">

    <div style="background:#1b4332;padding:28px 32px;">
      <p style="margin:0 0 4px;color:rgba(255,255,255,0.6);font-size:12px;text-transform:uppercase;letter-spacing:1px;">Tishbite Digital</p>
      <h1 style="margin:0;color:#fff;font-size:22px;">Message Received ✓</h1>
    </div>

    <div style="background:#ffffff;padding:28px 32px;font-size:14px;line-height:1.7;color:#374151;">
      <p style="margin:0 0 16px;">Hi <strong>${name}</strong>,</p>
      <p style="margin:0 0 16px;">Thank you for reaching out to Tishbite Digital. We've received your message and a member of our team will get back to you within <strong>24 hours</strong>.</p>
      ${serviceNote}

      <div style="background:#f0f7f3;border:1px solid #d1fae5;border-radius:10px;padding:16px 20px;margin:20px 0;">
        <p style="margin:0 0 8px;font-weight:bold;color:#1b4332;font-size:13px;">WHAT HAPPENS NEXT</p>
        <ul style="margin:0;padding-left:18px;color:#555;font-size:13px;">
          <li style="margin-bottom:6px;">We'll review your enquiry and prepare a tailored response</li>
          <li style="margin-bottom:6px;">One of our specialists will contact you within 24 hours</li>
          <li>For urgent matters, WhatsApp us at <a href="https://wa.me/27791684548" style="color:#1b4332;font-weight:bold;">+27 79 168 4548</a></li>
        </ul>
      </div>

      <p style="margin:0 0 8px;font-weight:bold;color:#374151;font-size:13px;">YOUR MESSAGE:</p>
      <div style="background:#f9fafb;border-left:4px solid #1b4332;padding:14px 16px;border-radius:0 8px 8px 0;font-size:13px;color:#555;white-space:pre-wrap;line-height:1.6;">${message}</div>

      <p style="margin:24px 0 0;color:#9ca3af;font-size:12px;">If you didn't submit this enquiry, please ignore this email.</p>
    </div>

    <div style="background:#1b4332;padding:20px 32px;text-align:center;">
      <p style="margin:0 0 8px;color:rgba(255,255,255,0.9);font-weight:bold;font-size:14px;">Tishbite Digital</p>
      <p style="margin:0;color:rgba(255,255,255,0.6);font-size:12px;">info@tishbitedigital.co.za · +27 79 168 4548 · tishbitedigital.co.za</p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request) {
  try {
    const { name, email, service, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return Response.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email address." }, { status: 400 });
    }

    const smtpUser = process.env.ZOHO_SMTP_USER;
    const smtpPass = process.env.ZOHO_SMTP_PASS;
    const notifyTo = process.env.CONTACT_NOTIFY_EMAIL || smtpUser;

    if (!smtpUser || !smtpPass) {
      console.error("ZOHO_SMTP_USER or ZOHO_SMTP_PASS env vars not set");
      return Response.json({ error: "Email service not configured." }, { status: 503 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.ZOHO_SMTP_HOST || "smtp.zoho.com",
      port: Number(process.env.ZOHO_SMTP_PORT) || 465,
      secure: true,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const serviceLabel = service?.trim() || null;
    const subjectSuffix = serviceLabel ? ` — ${serviceLabel}` : "";

    await Promise.all([
      transporter.sendMail({
        from: `"Tishbite Digital Website" <${smtpUser}>`,
        to: notifyTo,
        replyTo: email,
        subject: `New Enquiry from ${name}${subjectSuffix}`,
        html: buildNotificationHtml({ name, email, service: serviceLabel, message }),
      }),
      transporter.sendMail({
        from: `"Tishbite Digital" <${smtpUser}>`,
        to: email,
        subject: "We've received your message — Tishbite Digital",
        html: buildAutoReplyHtml({ name, service: serviceLabel, message }),
      }),
    ]);

    // Best-effort: also persist the enquiry for the admin dashboard
    try {
      await connectDB();
      await Enquiry.create({ name, email, message });
    } catch (dbErr) {
      console.error("DB persistence failed (non-fatal):", dbErr.message);
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return Response.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
