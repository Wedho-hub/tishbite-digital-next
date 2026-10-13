import connectDB from "@/lib/db";
import Campaign from "@/models/Campaign";
import Subscriber from "@/models/Subscriber";
import { requireAdmin } from "@/lib/auth";
import { sendMail, brandedEmail } from "@/lib/mail";
import { plainTextToEmailHtml } from "@/lib/textToHtml";

// Vercel honours this per-route; actual ceiling still depends on your plan
// (Hobby caps at 60s regardless). Sending through a personal Zoho SMTP
// account — not a dedicated bulk sender — is realistically only safe for
// list sizes in the dozens-to-low-hundreds; beyond that you'll want a real
// email service provider.
export const maxDuration = 60;

const BATCH_SIZE = 5; // concurrent sends per batch — gentle on the SMTP connection

export async function GET() {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const campaigns = await Campaign.find().sort({ createdAt: -1 }).lean();
  return Response.json({ data: campaigns });
}

export async function POST(request) {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const { subject, body } = await request.json();

  if (!subject?.trim() || !body?.trim()) {
    return Response.json({ message: "Subject and body are required." }, { status: 400 });
  }

  const recipients = await Subscriber.find({ status: "subscribed" }).select("email firstName unsubscribeToken").lean();
  if (recipients.length === 0) {
    return Response.json({ message: "No active subscribers to send to." }, { status: 400 });
  }

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((r) => {
        const unsubscribeUrl = `https://www.tishbitedigital.co.za/unsubscribe?token=${r.unsubscribeToken}`;
        return sendMail({
          to: r.email,
          subject,
          html: brandedEmail({
            heading: subject,
            bodyHtml: plainTextToEmailHtml(body.replace(/\{\{firstName\}\}/g, r.firstName || "there")),
            footerNote: `<a href="https://www.tishbitedigital.co.za/privacy-policy" style="color:#9ca3af;">Privacy Policy</a> · <a href="${unsubscribeUrl}" style="color:#9ca3af;">Unsubscribe</a>`,
          }),
        });
      })
    );
    results.forEach((r) => (r.status === "fulfilled" ? sent++ : failed++));
  }

  const campaign = await Campaign.create({
    subject,
    body,
    recipientCount: sent,
    failedCount: failed,
  });

  return Response.json({ success: true, campaign, sent, failed });
}
