// Content + config for each lead-magnet landing page. One object per route.
// `proof` reuses real, already-public testimonials from Testimonials.jsx —
// nothing here is a placeholder.
//
// LEAD_OFFERS is passed as a prop from server page.js files down into client
// components (LandingPageContent, LeadForm), so it must stay plain,
// serializable data — no functions. Email delivery content (which needs a
// function to inject offer-specific data like the scorecard's score) lives
// separately in LEAD_OFFER_EMAILS, used only server-side in
// app/api/subscribers/route.js.

export const LEAD_OFFERS = {
  audit: {
    slug: "audit",
    eyebrow: "Free Digital Presence Audit",
    headline: "Get a Free Audit of Your Website & Socials",
    subheadline:
      "We'll review your website and socials and send you 3 fixes you can act on — free, within 48 hours.",
    bullets: [
      "A real review of your website, Google Business Profile and socials",
      "3 specific fixes you can act on, sent within 48 hours",
      "No sales pitch — just a clear picture of where you stand online",
    ],
    formHeading: "Get My Free Audit",
    ctaText: "Send Me My Free Audit",
    offerLabel: "audit results",
    thankYouHeadline: "Your audit request is on its way!",
    thankYouBody:
      "We're reviewing your website and socials now. Your 3 fixes will land in your inbox within 48 hours.",
    proof: {
      quote:
        "Our WhatsApp enquiries doubled within the first month of launching our new site. Tishbite Digital didn't just build a website — they built us a lead machine that works around the clock.",
      name: "Thandi M.",
      role: "HR Business Partner, Maffy Online",
    },
  },

  scorecard: {
    slug: "scorecard",
    eyebrow: "60-Second Quiz",
    headline: "Is Your Business Invisible Online?",
    subheadline: "Answer 10 quick questions and see your Online Visibility Score instantly.",
    bullets: [
      "10 quick questions — takes under a minute",
      "See your score the moment you finish",
      "Get your full breakdown and next steps by email",
    ],
    formHeading: "Get My Full Results",
    ctaText: "Email Me My Full Results",
    offerLabel: "scorecard results",
    thankYouHeadline: "Your full scorecard results are on their way!",
    thankYouBody: "Check your inbox for your full breakdown and what to fix first.",
    proof: {
      quote:
        "Parents started finding us through Google within weeks. Enrolment enquiries increased noticeably and we now appear for the local searches that matter most to our community.",
      name: "Mr. F. Nkosi",
      role: "Principal, FOG Educare",
    },
  },

  "pricing-guide": {
    slug: "pricing-guide",
    eyebrow: "Free Pricing Guide",
    headline: "What a Website or Social Media Plan Really Costs",
    subheadline:
      'No vague "it depends" — real starting prices, what affects them, and how to budget for it.',
    bullets: [
      "Real starting price ranges, not vague estimates",
      "What actually drives the cost up or down",
      "How to budget for it without overpaying",
    ],
    formHeading: "Send Me the Pricing Guide",
    ctaText: "Send Me the Pricing Guide",
    offerLabel: "pricing guide",
    thankYouHeadline: "Your pricing guide is on its way!",
    thankYouBody: "Check your inbox — your pricing guide will land shortly.",
    proof: {
      quote:
        "They made the whole process simple and clear. I didn't know where to start online, but within a short time I had a professional site and was getting weekly WhatsApp enquiries.",
      name: "Leon V.",
      role: "Owner, Cape Comfort Home Services",
    },
  },

  checklist: {
    slug: "checklist",
    eyebrow: "Free Checklist",
    headline: "7 Things Your Business Page Needs to Get Customers",
    subheadline:
      "A simple checklist to see what's missing from your website or Facebook/Instagram page before you spend another rand on ads.",
    bullets: [
      "The 7 must-haves most business pages are missing",
      "A quick way to self-audit before you spend on ads",
      "Practical, no jargon — built for small business owners",
    ],
    formHeading: "Send Me the Checklist",
    ctaText: "Send Me the Checklist",
    offerLabel: "checklist",
    thankYouHeadline: "Your checklist is on its way!",
    thankYouBody: "Check your inbox — your 7-point checklist will land shortly.",
    proof: {
      quote:
        "Our WhatsApp enquiries doubled within the first month of launching our new site. Tishbite Digital didn't just build a website — they built us a lead machine that works around the clock.",
      name: "Thandi M.",
      role: "HR Business Partner, Maffy Online",
    },
  },

  call: {
    slug: "call",
    eyebrow: "Free 15-Minute Call",
    headline: "Book a Free 15-Minute Strategy Call",
    subheadline:
      "Tell us a bit about your business and when suits you — we'll confirm your time on WhatsApp.",
    bullets: [
      "15 focused minutes, no sales script",
      "Walk away with at least one concrete next step",
      "We confirm your time directly on WhatsApp",
    ],
    formHeading: "Book My Free Call",
    ctaText: "Request My Free Call",
    offerLabel: "strategy call",
    thankYouHeadline: "Your call request is in!",
    thankYouBody: "We'll confirm your 15-minute slot on WhatsApp shortly — keep an eye on your messages.",
    proof: {
      quote:
        "They made the whole process simple and clear. I didn't know where to start online, but within a short time I had a professional site and was getting weekly WhatsApp enquiries.",
      name: "Leon V.",
      role: "Owner, Cape Comfort Home Services",
    },
    showPreferredTime: true,
  },
};

export const getOfferBySlug = (slug) =>
  Object.values(LEAD_OFFERS).find((offer) => offer.slug === slug) || null;

// Server-only — never imported by a client component. `body(extra)` returns
// the HTML sent automatically the moment someone signs up (see
// app/api/subscribers/route.js). `extra` carries offer-specific data
// submitted with the form — currently only the scorecard uses it, to
// deliver the visitor's actual score.
const listItem = (text) => `<li style="margin-bottom:10px;">${text}</li>`;

export const LEAD_OFFER_EMAILS = {
  audit: {
    subject: "Your free audit request — here's what happens next",
    body: () => `
      <p style="margin:0 0 16px;">Thanks for requesting a free audit of your website and socials!</p>
      <p style="margin:0 0 16px;">We'll personally review your site, Google Business Profile, and social pages, and send you <strong>3 specific fixes</strong> you can act on — no fluff, no sales pitch.</p>
      <div style="background:#f0f7f3;border:1px solid #d1fae5;border-radius:10px;padding:16px 20px;margin:20px 0;">
        <p style="margin:0;font-weight:bold;color:#1b4332;font-size:13px;">⏱ Expect your results within 48 hours.</p>
      </div>
      <p style="margin:0 0 8px;">Want to fast-track it? Reply to this email with your website URL and social handles so we can get started right away.</p>
    `,
  },

  scorecard: {
    subject: "Your Online Visibility Score + what to fix first",
    body: (extra) => {
      const score = extra?.score;
      const band = extra?.band;
      const scoreBlock = Number.isFinite(score)
        ? `<div style="background:#f0f7f3;border:1px solid #d1fae5;border-radius:10px;padding:20px;margin:0 0 20px;text-align:center;">
            <p style="margin:0 0 4px;color:#6b7280;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">Your Online Visibility Score</p>
            <p style="margin:0;font-size:36px;font-weight:bold;color:#1b4332;">${score}<span style="font-size:18px;color:#9ca3af;">/10</span></p>
            ${band ? `<p style="margin:6px 0 0;font-weight:bold;color:#b8860b;">${band}</p>` : ""}
          </div>`
        : "";
      return `
        <p style="margin:0 0 16px;">Thanks for completing the Online Visibility quiz! Here's your full breakdown.</p>
        ${scoreBlock}
        <p style="margin:0 0 8px;font-weight:bold;color:#374151;">The areas that move the needle most for South African businesses:</p>
        <ul style="margin:0 0 16px;padding-left:18px;color:#555;">
          ${listItem("A complete, active Google Business Profile — this is often the single biggest visibility gap")}
          ${listItem("A fast, mobile-friendly website customers can actually act on")}
          ${listItem("Visible reviews — social proof is what turns a search result into an enquiry")}
          ${listItem("A direct WhatsApp or call path so interested visitors don't have to hunt for how to contact you")}
        </ul>
        <p style="margin:0 0 16px;">Want a second pair of eyes on your specific result? Reply to this email or book a free 15-minute strategy call and we'll walk through it together.</p>
      `;
    },
  },

  "pricing-guide": {
    subject: "What a website or social media plan really costs in South Africa",
    body: () => `
      <p style="margin:0 0 16px;">Here's the real breakdown — no vague "it depends" answers.</p>
      <p style="margin:0 0 8px;font-weight:bold;color:#374151;">Typical starting price ranges:</p>
      <ul style="margin:0 0 16px;padding-left:18px;color:#555;">
        ${listItem("<strong>Single service</strong> (website, SEO, branding, ads, or CRM setup on its own) — from R2,500")}
        ${listItem("<strong>Business Launch Suite</strong> (registration + branding bundle) — from R8,500")}
        ${listItem("<strong>Digital Foundation Suite</strong> (website + Google Business + Meta Suite) — from R10,000")}
        ${listItem("<strong>Growth Acceleration Suite</strong> (social growth + lead generation) — from R12,500")}
        ${listItem("<strong>Revenue Automation Suite</strong> (CRM, automation, conversion optimization) — from R15,000")}
        ${listItem("<strong>Enterprise Growth System</strong> (everything, bundled) — from R28,000+")}
      </ul>
      <p style="margin:0 0 8px;font-weight:bold;color:#374151;">What actually drives the price up or down:</p>
      <ul style="margin:0 0 16px;padding-left:18px;color:#555;">
        ${listItem("Number of pages and how custom the design is vs. a templated build")}
        ${listItem("Whether you need ongoing SEO/ads management, or a once-off build")}
        ${listItem("Integrations — payments, booking systems, CRM, automation")}
        ${listItem("How much content (copy, photos) you already have ready to go")}
      </ul>
      <p style="margin:0 0 16px;">Most packages can be split into 3–6 monthly installments, so you don't need the full amount upfront. Reply to this email with a bit about your business and we'll give you a specific quote.</p>
    `,
  },

  checklist: {
    subject: "Your checklist: 7 things your business page needs",
    body: () => `
      <p style="margin:0 0 16px;">Here's your checklist — go through it before you spend another rand on ads.</p>
      <ol style="margin:0 0 16px;padding-left:20px;color:#555;">
        ${listItem("<strong>A clear offer above the fold</strong> — a visitor should know what you do and who it's for within 3 seconds")}
        ${listItem("<strong>One obvious way to contact you</strong> — a WhatsApp button or call button, not buried in a menu")}
        ${listItem("<strong>A complete Google Business Profile</strong> — hours, photos, category, and service area filled in")}
        ${listItem("<strong>Visible reviews</strong> — even 3–5 genuine reviews build real trust")}
        ${listItem("<strong>Mobile-friendly design</strong> — most South African customers will find you on a phone first")}
        ${listItem("<strong>Clear pricing or a starting range</strong> — vague pricing quietly pushes buyers away")}
        ${listItem("<strong>A reason to act now</strong> — a specific next step (book, enquire, message) rather than a dead end")}
      </ol>
      <p style="margin:0 0 16px;">Missing 2 or more of these? That's usually where the lost enquiries are hiding. Reply to this email and we'll help you prioritise what to fix first.</p>
    `,
  },

  call: {
    subject: "Your strategy call request — we'll confirm on WhatsApp",
    body: () => `
      <p style="margin:0 0 16px;">Thanks for requesting a free 15-minute strategy call!</p>
      <p style="margin:0 0 16px;">We'll message you on WhatsApp shortly to confirm a time that works for you. If you gave us a preferred day/time, we'll try to match it.</p>
      <p style="margin:0 0 16px;">In the meantime, if you'd like to get started straight away, feel free to message us directly:</p>
      <a href="https://wa.me/27640584229" style="display:inline-block;background:#25d366;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;">Chat on WhatsApp</a>
    `,
  },
};
