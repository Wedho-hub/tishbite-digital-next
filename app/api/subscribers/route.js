import connectDB from "@/lib/db";
import Subscriber from "@/models/Subscriber";
import { requireAdmin } from "@/lib/auth";
import { sendMail, brandedEmail } from "@/lib/mail";
import { getOfferBySlug, LEAD_OFFER_EMAILS } from "@/lib/leadOffers";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, email, whatsapp, need, offerSlug, company, score, band } = body;
    const utm = {
      utmSource: body.utm_source || "",
      utmMedium: body.utm_medium || "",
      utmCampaign: body.utm_campaign || "",
      utmContent: body.utm_content || "",
    };

    // Honeypot — a real visitor never fills this in. Pretend success so a
    // bot has no signal it was caught, but do nothing further.
    if (company) {
      return Response.json({ success: true });
    }

    if (!firstName?.trim()) {
      return Response.json({ error: "Please enter your first name." }, { status: 400 });
    }
    if (!email?.trim() || !emailRegex.test(email)) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const offer = getOfferBySlug(offerSlug);
    const offerEmail = offer ? LEAD_OFFER_EMAILS[offer.slug] : null;
    if (!offer || !offerEmail) {
      return Response.json({ error: "Unknown offer." }, { status: 400 });
    }

    await connectDB();

    const subscriber = await Subscriber.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      {
        $set: {
          firstName: firstName.trim(),
          whatsapp: whatsapp?.trim() || "",
          need: need?.trim() || "",
          source: offer.slug,
          status: "subscribed",
          ...utm,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Best-effort from here — the subscriber is already saved, so an email
    // hiccup shouldn't turn into a failed signup from the visitor's side.
    try {
      const unsubscribeUrl = `https://www.tishbitedigital.co.za/unsubscribe?token=${subscriber.unsubscribeToken}`;
      await sendMail({
        to: email,
        subject: offerEmail.subject,
        html: brandedEmail({
          heading: offerEmail.subject,
          bodyHtml: offerEmail.body({ score, band }),
          footerNote: `<a href="https://www.tishbitedigital.co.za/privacy-policy" style="color:#9ca3af;">Privacy Policy</a> · <a href="${unsubscribeUrl}" style="color:#9ca3af;">Unsubscribe</a>`,
        }),
      });
    } catch (err) {
      console.error("Lead-magnet delivery email failed (non-fatal):", err.message);
    }

    try {
      const notifyTo = process.env.CONTACT_NOTIFY_EMAIL || process.env.ZOHO_SMTP_USER;
      if (notifyTo) {
        await sendMail({
          to: notifyTo,
          replyTo: email,
          subject: `New lead: ${firstName} — ${offer.headline}`,
          html: brandedEmail({
            heading: `New Lead — ${offer.offerLabel}`,
            bodyHtml: `
              <p style="margin:0 0 8px;"><strong>Name:</strong> ${firstName}</p>
              <p style="margin:0 0 8px;"><strong>Email:</strong> ${email}</p>
              ${whatsapp ? `<p style="margin:0 0 8px;"><strong>WhatsApp:</strong> ${whatsapp}</p>` : ""}
              ${need ? `<p style="margin:0 0 8px;"><strong>Need:</strong> ${need}</p>` : ""}
              <p style="margin:0 0 8px;"><strong>Offer:</strong> ${offer.slug}</p>
              ${Number.isFinite(score) ? `<p style="margin:0 0 8px;"><strong>Scorecard result:</strong> ${score}/10${band ? ` — ${band}` : ""}</p>` : ""}
              ${utm.utmSource ? `<p style="margin:0;color:#9ca3af;font-size:12px;">UTM: ${utm.utmSource} / ${utm.utmMedium} / ${utm.utmCampaign} / ${utm.utmContent}</p>` : ""}
            `,
          }),
        });
      }
    } catch (err) {
      console.error("Internal lead-notification email failed (non-fatal):", err.message);
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Subscriber signup error:", err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

export async function GET(request) {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const source = searchParams.get("source");

  const filter = {};
  if (status) filter.status = status;
  if (source) filter.source = source;

  const subscribers = await Subscriber.find(filter).sort({ createdAt: -1 }).lean();
  return Response.json({ data: subscribers, total: subscribers.length });
}
