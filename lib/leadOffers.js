// Content + config for each lead-magnet landing page. One object per route.
// `proof` reuses real, already-public testimonials from Testimonials.jsx —
// nothing here is a placeholder.

export const LEAD_OFFERS = {
  audit: {
    slug: "audit",
    listKey: "audit",
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
    listKey: "scorecard",
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
    listKey: "pricingGuide",
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
    listKey: "checklist",
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
    listKey: "call",
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
