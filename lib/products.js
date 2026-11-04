// Single source of truth for Tishbite's service/product catalog. Name,
// price and description must match everywhere they appear — the Services
// page, checkout, and WhatsApp copy — so they're defined once here instead
// of being hand-duplicated (and drifting out of sync) in each place.

export const PRODUCTS = [
  // ── Quick-win individual services ──
  {
    slug: "google-business-profile-setup",
    title: "Google Business Profile Setup & Optimisation",
    category: "general",
    tier: "standard",
    price: "R1,499",
    numericPrice: 1499,
    badge: null,
    shortDescription:
      "Profile setup, photos, services, review QR code + posts so you show up for \"near me\" searches.",
    blueprint:
      "**Problem:** When people search \"near me\", Google shows 3 businesses first — if you are not one of them, you are invisible to nearby buyers.\n\n**Solution:** We set up or fix your Google Business Profile: correct categories, services and products, a keyword-rich description, 10+ quality photos, hours, WhatsApp and website links, plus a printable review QR code and 4 ready-made posts.\n\n**Result Focus:** More calls, more direction requests, and more WhatsApp chats — tracked so you can see it.\n\n- Full profile setup and optimization\n- 10+ photos and a review QR code\n- 4 ready-made posts included",
  },
  {
    slug: "whatsapp-business-sales-setup",
    title: "WhatsApp Business Sales Setup",
    category: "general",
    tier: "standard",
    price: "R1,299",
    numericPrice: 1299,
    badge: null,
    shortDescription:
      "Catalogue, auto-replies, quick replies and lead labels so WhatsApp becomes a sales desk.",
    blueprint:
      "**Problem:** Customers already message you on WhatsApp, but slow replies and invisible pricing lose sales.\n\n**Solution:** We turn your WhatsApp into a sales desk: a catalogue of up to 15 products or services, greeting and away messages, quick replies for common questions, lead-tracking labels, a short link and QR code, plus 5 status templates.\n\n**Result Focus:** Faster replies, fewer lost leads, and customers who can see your prices before they ask.\n\n- Catalogue of up to 15 items\n- Auto-replies and lead-tracking labels\n- Short link, QR code and status templates",
  },
  {
    slug: "lead-generating-business-website",
    title: "Lead-Generating Business Website",
    category: "general",
    tier: "standard",
    price: "R7,500",
    numericPrice: 7500,
    badge: null,
    shortDescription:
      "Up to 5 pages, mobile-first and SEO-ready, with WhatsApp and call buttons on every page.",
    blueprint:
      "**Problem:** Many websites get visits but fail to turn visitors into enquiries.\n\n**Solution:** Up to 5 pages, mobile-first and fast-loading, written to convert — clear offer, trust proof, and WhatsApp and call buttons on every page, with SEO structure so Google understands what you do and where. Includes Google Analytics tracking.\n\n**Result Focus:** More qualified enquiries, better user experience, and stronger digital authority.\n\n- Responsive, speed-conscious design\n- SEO-ready page structure\n- WhatsApp and call buttons on every page",
  },
  {
    slug: "website-care-plan",
    title: "Website Care Plan",
    category: "general",
    tier: "standard",
    price: "R399/month",
    numericPrice: null,
    badge: null,
    shortDescription: "Hosting care, backups, security checks and 2 content edits a month.",
    blueprint:
      "**Problem:** Websites break, slow down, or fall behind without ongoing attention — most owners only notice once it has already cost them leads.\n\n**Solution:** Hosting management, monthly backups, security and uptime checks, and up to 2 content edits per month — handled by us, not you.\n\n**Result Focus:** A site that stays fast, safe and current, with problems fixed before they cost you enquiries.\n\n- Hosting, backups and uptime monitoring\n- Monthly security checks\n- Up to 2 content edits per month",
  },
  {
    slug: "custom-web-app-automation",
    title: "Custom Web Application Development",
    category: "general",
    tier: "standard",
    price: "From R18,000",
    numericPrice: 18000,
    badge: null,
    shortDescription:
      "Booking systems, client portals, quoting tools and CRM automation built around your process.",
    blueprint:
      "**Problem:** Spreadsheets and manual paperwork slow a growing business down, and off-the-shelf tools rarely fit how you actually work.\n\n**Solution:** We design and build the system that fits your business — booking systems, client portals, quoting tools, admin dashboards, and CRM automation — built with React, Next.js, and Node.js.\n\n**Result Focus:** Hours of admin saved per week — we agree the number upfront and design to hit it.\n\n- Full-stack builds on modern frameworks (React, Next.js, Node.js)\n- Secure logins, dashboards and database-backed features\n- Payment, CRM and third-party API integrations",
  },

  // ── Bundles: lead with these ──
  {
    slug: "get-found-starter",
    title: "Get Found Starter",
    category: "bundle",
    tier: "lead",
    price: "R3,999",
    numericPrice: 3999,
    installment: { amount: 1333, months: 3 },
    badge: "Most Popular",
    shortDescription: "Website + Google profile + WhatsApp, all linked together. Live in 10 days.",
    blueprint:
      "**Problem:** Most small businesses are invisible online because their Google profile, website, and WhatsApp are not working together.\n\n**Solution:** A one-page mobile website, a fully optimised Google Business Profile, and a WhatsApp Business sales setup — all linked together so a customer can find you, trust you, and message you in under a minute. Built on fast, modern tech that you own, with no monthly rental.\n\n**Result Focus:** Your first enquiries from Google within 30 days.\n\n- One-page mobile website\n- Optimised Google Business Profile\n- Linked WhatsApp Business sales setup",
  },
  {
    slug: "trade-pro-pack",
    title: "Trade Pro Pack",
    category: "bundle",
    tier: "lead",
    price: "R4,999",
    numericPrice: 4999,
    installment: { amount: 1667, months: 3 },
    badge: "For Trades",
    shortDescription:
      "Built for plumbers, electricians, builders and tradespeople — by a trade-tested journeyman.",
    blueprint:
      "**Problem:** Trades and home-service businesses win work through word of mouth alone, and a slow season can hit hard.\n\n**Solution:** Built for plumbers, electricians, builders, welders, fitters, and home-service pros — by a trade-tested journeyman with 10 years on site. A one-page job-winning website with a before/after gallery, a Google profile set up for \"near me\" searches, a WhatsApp catalogue of your services, a printable review QR card, and a 60-day review plan.\n\n**Result Focus:** Steady weekly job enquiries without relying only on word of mouth.\n\n- Job-winning site with before/after gallery\n- Google Maps profile tuned for \"near me\" searches\n- WhatsApp catalogue + 60-day review plan",
  },
  {
    slug: "business-launch-suite",
    title: "Business Launch Suite",
    category: "bundle",
    tier: "lead",
    price: "R8,500",
    numericPrice: 8500,
    installment: { amount: 2900, months: 3 },
    badge: null,
    shortDescription: "Company registration + branding bundle — launch registered and professional.",
    blueprint:
      "**Problem:** New businesses struggle to launch quickly because legal setup and brand identity are done in disconnected steps.\n\n**Solution:** This bundle combines registration and branding so you launch as a compliant, professional business.\n\n**Result Focus:** Faster go-to-market setup, stronger credibility, and a cleaner foundation for sales.\n\n- Registration and compliance setup\n- Brand identity and launch assets\n- Structured start-up readiness",
  },
  {
    slug: "local-growth-plan",
    title: "Local Growth Plan",
    category: "bundle",
    tier: "lead",
    price: "R999/month",
    numericPrice: null,
    badge: null,
    shortDescription: "Monthly Google posts, photos, review replies and a results report.",
    blueprint:
      "**Problem:** A Google profile only works if it stays active — most go stale within weeks of setup.\n\n**Solution:** Every month we publish 4 posts, add fresh photos, answer reviews, send your customers review requests, and update your offers.\n\n**Result Focus:** A one-page monthly report — profile views, calls, website clicks, WhatsApp chats, and new reviews. No contract, cancel any time with 30 days' notice.\n\n- 4 posts and fresh photos monthly\n- Review replies and requests\n- Monthly performance report",
  },

  // ── Advanced tier: kept for businesses that already have the basics covered ──
  {
    slug: "digital-foundation-suite",
    title: "Digital Foundation Suite",
    category: "bundle",
    tier: "advanced",
    price: "R10,000",
    numericPrice: 10000,
    installment: { amount: 3400, months: 3 },
    badge: "Advanced",
    shortDescription: "Website + Google profile + Meta Suite, rolled into one foundation.",
    blueprint:
      "**Problem:** Businesses moving online often lack the core assets needed to attract and convert digital traffic.\n\n**Solution:** This bundle builds your core website, local SEO visibility, and social platform integration in one rollout.\n\n**Result Focus:** Better online discoverability, trust, and enquiry readiness from day one.\n\n- Lead-ready website\n- Local SEO and Google profile setup\n- Meta and channel integration",
  },
  {
    slug: "growth-acceleration-suite",
    title: "Growth Acceleration Suite",
    category: "bundle",
    tier: "advanced",
    price: "R12,500",
    numericPrice: 12500,
    installment: { amount: 2500, months: 5 },
    badge: "Advanced",
    shortDescription: "Social growth + local SEO + paid campaigns, aligned into one strategy.",
    blueprint:
      "**Problem:** Visibility may exist, but growth stalls when content, local search, and advertising are not aligned.\n\n**Solution:** This bundle aligns social growth, local SEO, and paid campaigns into one demand-generation strategy.\n\n**Result Focus:** Stronger lead pipeline, higher brand visibility, and momentum toward revenue growth.\n\n- Social growth execution\n- Local search optimization\n- Paid campaign lead acquisition",
  },
  {
    slug: "revenue-automation-suite",
    title: "Revenue Automation Suite",
    category: "bundle",
    tier: "advanced",
    price: "R15,000",
    numericPrice: 15000,
    installment: { amount: 3000, months: 5 },
    badge: "Advanced",
    shortDescription: "Ads + platform integration + CRM automation to move leads through your pipeline.",
    blueprint:
      "**Problem:** Many businesses generate leads but lose revenue due to weak follow-up and fragmented sales systems.\n\n**Solution:** This bundle combines ads, platform integration, and CRM automation to move leads efficiently through your pipeline.\n\n**Result Focus:** Better lead-to-sale conversion, reduced manual effort, and predictable revenue operations.\n\n- Conversion-focused lead generation\n- Unified platform setup\n- CRM automation workflows",
  },
  {
    slug: "tishbite-enterprise-growth-system",
    title: "Tishbite Enterprise Growth System",
    category: "bundle",
    tier: "advanced",
    price: "R28,000+",
    numericPrice: 28000,
    installment: { amount: 4700, months: 6 },
    badge: "Advanced",
    shortDescription: "The full brand-to-conversion system for businesses ready to scale.",
    blueprint:
      "**Problem:** Scaling businesses outgrow piecemeal marketing and need a coordinated infrastructure for growth.\n\n**Solution:** Our flagship bundle unifies all core growth services into one structured operating system.\n\n**Result Focus:** End-to-end visibility, faster execution, and enterprise-ready growth consistency.\n\n- Full brand-to-conversion ecosystem\n- Integrated acquisition and automation layers\n- Long-term scalability framework",
  },
];

export const getProductBySlug = (slug) => PRODUCTS.find((p) => p.slug === slug) || null;
export const getProductByTitle = (title) =>
  PRODUCTS.find((p) => p.title.toLowerCase() === String(title || "").toLowerCase()) || null;
