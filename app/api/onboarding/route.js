import nodemailer from "nodemailer";
import connectDB from "@/lib/db";
import Onboarding from "@/models/Onboarding";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

const ARRAY_FIELDS = ["marketingChannels", "goals", "servicesInterested"];

function pickOnboardingPayload(body = {}) {
  const payload = {
    fullName: body.fullName,
    businessName: body.businessName,
    role: body.role,
    email: body.email,
    phone: body.phone,
    location: body.location,
    businessDescription: body.businessDescription,
    yearsOperating: body.yearsOperating,
    hasWebsite: body.hasWebsite,
    websiteUrl: body.websiteUrl,
    whatsWorking: body.whatsWorking,
    whatsNotWorking: body.whatsNotWorking,
    hasGoogleBusinessProfile: body.hasGoogleBusinessProfile,
    successDefinition: body.successDefinition,
    timeline: body.timeline,
    urgencyReason: body.urgencyReason,
    idealCustomer: body.idealCustomer,
    customerLocations: body.customerLocations,
    competitors: body.competitors,
    competitorLikesDislikes: body.competitorLikesDislikes,
    hasLogo: body.hasLogo,
    hasBrandColors: body.hasBrandColors,
    hasMedia: body.hasMedia,
    hasCopyReady: body.hasCopyReady,
    budgetRange: body.budgetRange,
    openToInstallments: body.openToInstallments,
    decisionMakers: body.decisionMakers,
    additionalNotes: body.additionalNotes,
  };

  for (const field of ARRAY_FIELDS) {
    if (body[field] !== undefined) {
      payload[field] = Array.isArray(body[field])
        ? body[field]
        : String(body[field]).split(",").map((v) => v.trim()).filter(Boolean);
    }
  }

  return payload;
}

function buildNotificationHtml(data) {
  const row = (label, value) =>
    value
      ? `<tr><td style="padding:6px 0;font-weight:bold;color:#374151;width:170px;vertical-align:top;">${label}:</td><td style="padding:6px 0;color:#111;">${value}</td></tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;">
  <div style="font-family:Arial,sans-serif;max-width:640px;margin:32px auto;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
    <div style="background:#1b4332;padding:28px 32px;">
      <p style="margin:0 0 4px;color:rgba(255,255,255,0.6);font-size:12px;text-transform:uppercase;letter-spacing:1px;">Tishbite Digital — New Client Onboarding</p>
      <h1 style="margin:0;color:#fff;font-size:22px;">${data.businessName}</h1>
    </div>
    <div style="background:#ffffff;padding:28px 32px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row("Full Name", data.fullName)}
        ${row("Email", `<a href="mailto:${data.email}" style="color:#1b4332;">${data.email}</a>`)}
        ${row("Phone", data.phone)}
        ${row("Location", data.location)}
        ${row("Services Interested", (data.servicesInterested || []).join(", "))}
        ${row("Budget Range", data.budgetRange)}
        ${row("Timeline", data.timeline)}
        ${row("Success Looks Like", data.successDefinition)}
      </table>
      <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e5e7eb;">
        <a href="https://www.tishbitedigital.co.za/admin/onboarding" style="display:inline-block;background:#1b4332;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;">
          View Full Submission
        </a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request) {
  const body = await request.json();
  const data = pickOnboardingPayload(body);

  if (!data.fullName?.trim() || !data.businessName?.trim() || !data.email?.trim() || !data.phone?.trim()) {
    return Response.json({ error: "Full name, business name, email, and phone are required." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return Response.json({ error: "Invalid email address." }, { status: 400 });
  }

  try {
    await connectDB();
    const submission = await Onboarding.create(data);

    // Best-effort notification email — the submission itself is already
    // saved, so a failed email here should never block the client.
    try {
      const smtpUser = process.env.ZOHO_SMTP_USER;
      const smtpPass = process.env.ZOHO_SMTP_PASS;
      const notifyTo = process.env.CONTACT_NOTIFY_EMAIL || smtpUser;
      if (smtpUser && smtpPass) {
        const transporter = nodemailer.createTransport({
          host: process.env.ZOHO_SMTP_HOST || "smtp.zoho.com",
          port: Number(process.env.ZOHO_SMTP_PORT) || 465,
          secure: true,
          auth: { user: smtpUser, pass: smtpPass },
        });
        await transporter.sendMail({
          from: `"Tishbite Digital Website" <${smtpUser}>`,
          to: notifyTo,
          replyTo: data.email,
          subject: `New Onboarding Submission — ${data.businessName}`,
          html: buildNotificationHtml(data),
        });
      }
    } catch (mailErr) {
      console.error("Onboarding notification email failed (non-fatal):", mailErr.message);
    }

    return Response.json({ success: true, id: submission._id }, { status: 201 });
  } catch (err) {
    console.error("Onboarding submission error:", err);
    return Response.json({ error: "Failed to submit. Please try again." }, { status: 500 });
  }
}

export async function GET() {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const submissions = await Onboarding.find().sort({ createdAt: -1 });
  return Response.json(submissions);
}
