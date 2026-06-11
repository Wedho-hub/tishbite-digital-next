"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import CountUp from "react-countup";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaBullhorn, FaCode, FaSearch, FaCogs, FaLayerGroup, FaRocket,
  FaArrowRight, FaCheckCircle, FaMapMarkerAlt, FaCalendarCheck, FaShieldAlt,
} from "react-icons/fa";
import PageHeader from "@/components/PageHeader";

/* ── Animation variants ─────────────────────────────── */
const spring     = { type: "spring", stiffness: 120, damping: 18 };
const springFast = { type: "spring", stiffness: 150, damping: 20 };
const fadeUp  = { hidden: { opacity: 0, y: 32 },        visible: { opacity: 1, y: 0,     transition: spring     } };
const fadeLeft  = { hidden: { opacity: 0, x: -32 },     visible: { opacity: 1, x: 0,     transition: spring     } };
const fadeRight = { hidden: { opacity: 0, x: 32 },      visible: { opacity: 1, x: 0,     transition: spring     } };
const cardVar   = { hidden: { opacity: 0, y: 24, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: springFast } };
const stagger   = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };
const VIEW      = { once: true, amount: 0.12 };

/* ── Icon mapping ─── */
const ICON_MAP = [
  { matcher: /(market|brand|social|ads?|promotion)/i, icon: FaBullhorn  },
  { matcher: /(web|website|develop|design|app)/i,     icon: FaCode      },
  { matcher: /(seo|search|traffic|ranking)/i,         icon: FaSearch    },
  { matcher: /(autom|crm|system|ops|process)/i,       icon: FaCogs      },
  { matcher: /(bundle|package|strategy|growth)/i,     icon: FaLayerGroup},
];
const getServiceIcon = (s) => {
  const hay = `${s?.title||""} ${s?.description||""}`;
  return ICON_MAP.find(({ matcher }) => matcher.test(hay))?.icon || FaRocket;
};

const normalize = (t = "") =>
  t.toLowerCase().replace(/™/g,"").replace(/^the\s+/i,"").replace(/\s+/g," ").trim();

const BUNDLE_PRICE_MAP = {
  "business launch suite":             "From R8,500",
  "digital foundation suite":          "From R10,000",
  "growth acceleration suite":         "From R12,500",
  "revenue automation suite":          "From R15,000",
  "tishbite enterprise growth system": "From R28,000+",
};
const getServicePrice = (s, isBundle) =>
  isBundle ? (BUNDLE_PRICE_MAP[normalize(s?.title)] || "Custom pricing") : "From R2,500";

/* ── Blueprint descriptions ── */
const BLUEPRINTS = {
  "professional website development": {
    displayTitle: "Lead-Generating Website Development",
    description: "**Problem:** Many websites get visits but fail to turn visitors into enquiries.\n\n**Solution:** We build fast, mobile-optimized websites with conversion-focused structure and clear calls to action.\n\n**Result Focus:** More qualified enquiries, better user experience, and stronger digital authority.\n\n- Responsive, speed-conscious design\n- SEO-ready page structure\n- Contact and WhatsApp conversion pathways",
  },
  "google business profile & local seo optimization": {
    displayTitle: "Google Business Profile & Local SEO Growth",
    description: "**Problem:** Local customers cannot choose your business if you do not appear in map and local search results.\n\n**Solution:** We optimize your Google Business Profile and local SEO signals to improve findability in your service area.\n\n**Result Focus:** Increased local discovery, stronger profile trust signals, and more nearby enquiries.\n\n- Profile optimization and service mapping\n- Local keyword and category refinement\n- Visibility improvements for map-based searches",
  },
  "brand identity & business design": {
    displayTitle: "Brand Identity & Market Positioning Design",
    description: "**Problem:** Businesses lose opportunities when their branding looks inconsistent or unprofessional.\n\n**Solution:** We create a clear visual identity system that positions your business as credible and memorable.\n\n**Result Focus:** Better first impressions, stronger recall, and higher trust during sales conversations.\n\n- Custom logo and identity direction\n- Consistent color and typography system\n- Practical brand usage guide",
  },
  "lead generation & paid advertising campaigns": {
    displayTitle: "Paid Ads & Lead Generation Campaigns",
    description: "**Problem:** Businesses burn ad budget when campaigns are not built around qualified buyer intent.\n\n**Solution:** We design and optimize paid campaigns focused on lead quality, not vanity metrics.\n\n**Result Focus:** More sales-ready leads, improved conversion flow, and better marketing ROI.\n\n- Targeted audience strategy\n- Offer-led campaign setup\n- Tracking and optimization loops",
  },
  "crm, automation & conversion optimization": {
    displayTitle: "CRM, Automation & Conversion Systems",
    description: "**Problem:** Slow follow-up and manual admin cause warm leads to go cold before conversion.\n\n**Solution:** We implement CRM and automation workflows that organize leads and trigger timely follow-ups.\n\n**Result Focus:** Faster response speed, improved conversion rates, and scalable sales operations.\n\n- Pipeline and lead-stage design\n- Automated follow-up workflows\n- Conversion path optimization",
  },
  "business launch suite": {
    displayTitle: "Business Launch Suite",
    description: "**Problem:** New businesses struggle to launch quickly because legal setup and brand identity are done in disconnected steps.\n\n**Solution:** This bundle combines registration and branding so you launch as a compliant, professional business.\n\n**Result Focus:** Faster go-to-market setup, stronger credibility, and a cleaner foundation for sales.\n\n- Registration and compliance setup\n- Brand identity and launch assets\n- Structured start-up readiness",
  },
  "digital foundation suite": {
    displayTitle: "Digital Foundation Suite",
    description: "**Problem:** Businesses moving online often lack the core assets needed to attract and convert digital traffic.\n\n**Solution:** This bundle builds your core website, local SEO visibility, and social platform integration in one rollout.\n\n**Result Focus:** Better online discoverability, trust, and enquiry readiness from day one.\n\n- Lead-ready website\n- Local SEO and Google profile setup\n- Meta and channel integration",
  },
  "growth acceleration suite": {
    displayTitle: "Growth Acceleration Suite",
    description: "**Problem:** Visibility may exist, but growth stalls when content, local search, and advertising are not aligned.\n\n**Solution:** This bundle aligns social growth, local SEO, and paid campaigns into one demand-generation strategy.\n\n**Result Focus:** Stronger lead pipeline, higher brand visibility, and momentum toward revenue growth.\n\n- Social growth execution\n- Local search optimization\n- Paid campaign lead acquisition",
  },
  "revenue automation suite": {
    displayTitle: "Revenue Automation Suite",
    description: "**Problem:** Many businesses generate leads but lose revenue due to weak follow-up and fragmented sales systems.\n\n**Solution:** This bundle combines ads, platform integration, and CRM automation to move leads efficiently through your pipeline.\n\n**Result Focus:** Better lead-to-sale conversion, reduced manual effort, and predictable revenue operations.\n\n- Conversion-focused lead generation\n- Unified platform setup\n- CRM automation workflows",
  },
  "tishbite enterprise growth system": {
    displayTitle: "Tishbite Enterprise Growth System",
    description: "**Problem:** Scaling businesses outgrow piecemeal marketing and need a coordinated infrastructure for growth.\n\n**Solution:** Our flagship bundle unifies all core growth services into one structured operating system.\n\n**Result Focus:** End-to-end visibility, faster execution, and enterprise-ready growth consistency.\n\n- Full brand-to-conversion ecosystem\n- Integrated acquisition and automation layers\n- Long-term scalability framework",
  },
};

const getDescription = (s) => {
  const b = BLUEPRINTS[normalize(s?.title)];
  if (b?.description) return b.description;
  return s?.category === "bundle"
    ? "**Problem:** Growth stalls when critical functions are handled in isolation.\n\n**Solution:** This bundle combines key systems into one coordinated execution plan.\n\n**Result Focus:** Better consistency, higher lead quality, and clearer growth momentum."
    : "**Problem:** Businesses struggle to turn visibility into qualified enquiries.\n\n**Solution:** This service strengthens one core growth function with practical execution support.\n\n**Result Focus:** Better trust, stronger conversion readiness, and improved business outcomes.";
};

const getDisplayTitle = (s) => {
  if (s?.displayTitle) return s.displayTitle;
  const b = BLUEPRINTS[normalize(s?.title)];
  if (b?.displayTitle) return b.displayTitle;
  return (s?.title || "Service").replace(/^The\s+/i,"").replace(/™/g,"").trim();
};

/* ── Fallback data ── */
const FALLBACK_GENERAL = [
  { _id:"fb-reg",    title:"Company Registration & Compliance Setup",           category:"general" },
  { _id:"fb-brand",  title:"Brand Identity & Business Design",                  category:"general" },
  { _id:"fb-web",    title:"Professional Website Development",                   category:"general" },
  { _id:"fb-seo",    title:"Google Business Profile & Local SEO Optimization",  category:"general" },
  { _id:"fb-meta",   title:"Meta Business Suite & Social Platform Integration",  category:"general" },
  { _id:"fb-social", title:"Social Media Growth Strategy & Management",          category:"general" },
  { _id:"fb-ads",    title:"Lead Generation & Paid Advertising Campaigns",       category:"general" },
  { _id:"fb-crm",    title:"CRM, Automation & Conversion Optimization",          category:"general" },
];
const FALLBACK_BUNDLES = [
  { _id:"fb-launch",     title:"Business Launch Suite",             category:"bundle" },
  { _id:"fb-foundation", title:"Digital Foundation Suite",          category:"bundle" },
  { _id:"fb-growth",     title:"Growth Acceleration Suite",         category:"bundle" },
  { _id:"fb-revenue",    title:"Revenue Automation Suite",          category:"bundle" },
  { _id:"fb-enterprise", title:"Tishbite Enterprise Growth System", category:"bundle" },
];
const FALLBACK_SERVICES = [...FALLBACK_GENERAL, ...FALLBACK_BUNDLES];

const PRICING_ROWS = [
  { service:"General Services",                 startingPrice:"R2,500 – R7,500", subscription:"Monthly installments available",        maintenance:"Optional: R500/month",                        notes:"Ideal for individual service needs",         checkoutService:null,                            price:null  },
  { service:"Business Launch Suite",            startingPrice:"R8,500",          subscription:"3 monthly installments (R2,900 each)",   maintenance:"1 month free maintenance included",           notes:"Company registration + branding bundle",     checkoutService:"Business Launch Suite",         price:8500  },
  { service:"Digital Foundation Suite",         startingPrice:"R10,000",         subscription:"3–4 monthly installments",                maintenance:"1 month free website & social setup support", notes:"Website + Google Business + Meta Suite",     checkoutService:"Digital Foundation Suite",      price:10000 },
  { service:"Growth Acceleration Suite",        startingPrice:"R12,500",         subscription:"3–6 monthly installments",                maintenance:"1 month free social media support",           notes:"Social media growth + lead generation",      checkoutService:"Growth Acceleration Suite",     price:12500 },
  { service:"Revenue Automation Suite",         startingPrice:"R15,000",         subscription:"3–6 monthly installments",                maintenance:"1 month free automation & CRM support",       notes:"CRM, automation & conversion optimization",  checkoutService:"Revenue Automation Suite",      price:15000 },
  { service:"Tishbite Enterprise Growth System",startingPrice:"R28,000+",        subscription:"Custom subscription or installments",     maintenance:"2 months free maintenance & support",         notes:"All 8 services included, enterprise-grade",  checkoutService:"Tishbite Enterprise Growth System", price:28000 },
];

const HERO_FEATURES = [
  { Icon:FaMapMarkerAlt,  label:"Cape Town Based"       },
  { Icon:FaCalendarCheck, label:"Installment Plans"     },
  { Icon:FaShieldAlt,     label:"1 Month Free Support"  },
  { Icon:FaCheckCircle,   label:"Results Focused"       },
];

const INITIAL_VISIBLE = 4;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://tishbitedigital-api.onrender.com";

/* ── Section heading ── */
function SectionLabel({ children }) {
  return (
    <p className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-extrabold text-xs uppercase tracking-wider mb-3">
      {children}
    </p>
  );
}

export default function ServicesPageContent() {
  const router = useRouter();
  const [services,       setServices]       = useState(FALLBACK_SERVICES);
  const [expanded,       setExpanded]       = useState({});
  const [showAllGeneral, setShowAllGeneral] = useState(false);
  const [showAllBundles, setShowAllBundles] = useState(false);
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.4 });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/services`);
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && Array.isArray(data) && data.length > 0) setServices(data);
      } catch (_) { /* fallback stays */ }
    })();
    return () => { mounted = false; };
  }, []);

  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));
  const goCheckout = (name, price) =>
    router.push(`/checkout?service=${encodeURIComponent(name)}&price=${price}`);

  const general = services.filter((s) => (s.category || "general") === "general");
  const bundles  = services.filter((s) => (s.category || "general") === "bundle");

  const renderCard = (service, isBundle = false) => {
    const Icon       = getServiceIcon(service);
    const isExpanded = expanded[service._id];
    return (
      <motion.li
        key={service._id}
        variants={cardVar}
        whileTap={{ scale: 0.98 }}
        className={`flex flex-col bg-white rounded-2xl p-6 border ${isBundle ? "border-accent/30" : "border-primary/10"} shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isBundle ? "bg-accent/15" : "bg-primary/10"}`}>
            <Icon className={`text-lg ${isBundle ? "text-[#b8860b]" : "text-primary"}`} aria-hidden="true" />
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isBundle ? "bg-accent/15 text-[#b8860b]" : "bg-primary/10 text-primary"}`}>
            {isBundle ? "Bundle" : "General"}
          </span>
        </div>

        <p className={`text-sm font-bold mb-1 ${isBundle ? "text-[#8a6500]" : "text-primary"}`}>
          {getServicePrice(service, isBundle)}
        </p>

        <h3
          className="text-base font-bold text-primary-dark mb-3 leading-snug"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          {getDisplayTitle(service)}
        </h3>

        <div className={`flex-1 text-sm text-text-muted leading-relaxed overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-250" : "max-h-20"}`}>
          <div className="prose prose-sm max-w-none prose-strong:text-text-dark prose-li:text-text-muted">
            <ReactMarkdown>{getDescription(service)}</ReactMarkdown>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-primary/8">
          <button
            className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
            onClick={() => toggle(service._id)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
          <button
            className={`ml-auto flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg transition-all duration-200 ${isBundle ? "bg-accent text-primary-dark hover:bg-accent-light" : "bg-primary text-white hover:bg-primary-dark"}`}
            onClick={() => goCheckout(getDisplayTitle(service), isBundle ? 8500 : 3500)}
            aria-label={`Get started with ${getDisplayTitle(service)}`}
          >
            Get Started <FaArrowRight size={10} aria-hidden="true" />
          </button>
        </div>
      </motion.li>
    );
  };

  return (
    <>
      <PageHeader
        title="Our Services"
        subtitle="From individual execution to full growth packages — built to generate real leads and measurable outcomes."
      />

      {/* ═══════════════════════════════════════════════
          Section 1 — Overview
          White bg = hard contrast against dark green PageHeader
          Image on LEFT (opposite of homepage hero)
      ════════════════════════════════════════════════ */}
      <section
        className="bg-white py-16 border-b border-primary/8"
        aria-labelledby="services-overview-heading"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* Image — LEFT on desktop */}
            <motion.div
              className="lg:w-2/5 w-full"
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={VIEW}
            >
              <div className="relative">
                <motion.div
                  className="absolute -inset-4 rounded-3xl bg-primary/15 blur-2xl"
                  animate={{ opacity: [0.35, 0.65, 0.35] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <Image
                  src="/assets/profilePic.jpg"
                  alt="Wellington Dhliwayo — Founder of Tishbite Digital"
                  width={480}
                  height={520}
                  priority
                  className="relative w-full rounded-2xl shadow-2xl object-cover object-top"
                  style={{ maxHeight: "460px" }}
                />
              </div>
            </motion.div>

            {/* Text — RIGHT on desktop */}
            <motion.div
              className="lg:w-3/5 w-full flex flex-col"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={VIEW}
            >
              <motion.p
                variants={fadeRight}
                className="inline-flex self-start items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-extrabold text-xs uppercase tracking-wider mb-4"
              >
                Cape Town Digital Agency
              </motion.p>

              <motion.h2
                id="services-overview-heading"
                variants={fadeRight}
                className="text-3xl lg:text-4xl font-extrabold text-primary-dark mb-4"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Solutions Built for Growth
              </motion.h2>

              <motion.p variants={fadeRight} className="text-text-muted text-base leading-relaxed mb-8">
                From focused one-off execution to complete business growth packages, every service is engineered to generate real leads and measurable outcomes.
              </motion.p>

              {/* Stats */}
              <motion.div ref={statsRef} variants={fadeRight} className="flex gap-8 mb-8">
                {[
                  { end: general.length, label: "Individual\nServices"  },
                  { end: bundles.length, label: "Growth\nPackages"      },
                  { end: services.length,label: "Total\nSolutions"      },
                ].map(({ end, label }) => (
                  <div key={label}>
                    <p className="text-4xl font-extrabold text-primary-dark leading-none mb-1"
                       aria-label={`${end} ${label.replace("\n", " ")}`}>
                      {statsInView ? <CountUp end={end} duration={1.6} /> : 0}
                    </p>
                    <p className="text-text-muted text-xs whitespace-pre-line leading-tight">{label}</p>
                  </div>
                ))}
              </motion.div>

              {/* Feature chips */}
              <motion.div variants={stagger} className="flex flex-wrap gap-3">
                {HERO_FEATURES.map(({ Icon, label }) => (
                  <motion.div
                    key={label}
                    variants={fadeUp}
                    className="flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-lg px-3 py-2 text-sm font-semibold text-primary-dark"
                  >
                    <Icon className="text-primary shrink-0" aria-hidden="true" />
                    {label}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          Section 2 — General Services  (light)
      ════════════════════════════════════════════════ */}
      <section className="py-16 bg-bg" aria-labelledby="general-services-heading">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={VIEW}
            className="mb-8"
          >
            <motion.div variants={fadeUp} className="flex flex-col">
              <SectionLabel>Individual Services</SectionLabel>
              <h2
                id="general-services-heading"
                className="text-2xl lg:text-3xl font-extrabold text-primary-dark mb-2"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                General Services
              </h2>
              <p className="text-text-muted text-sm max-w-xl">
                Flexible individual services tailored to your business needs.
              </p>
            </motion.div>
          </motion.div>

          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={VIEW}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 list-none p-0 m-0"
          >
            {(showAllGeneral ? general : general.slice(0, INITIAL_VISIBLE)).map((s) => renderCard(s, false))}
          </motion.ul>

          {general.length > INITIAL_VISIBLE && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={VIEW}
              className="text-center mt-8"
            >
              <button
                className="px-6 py-2.5 rounded-xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all duration-200"
                onClick={() => setShowAllGeneral((p) => !p)}
              >
                {showAllGeneral ? "Show Less" : `See All ${general.length} General Services`}
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          Section 3 — Bundle Services  (white)
      ════════════════════════════════════════════════ */}
      <section className="py-16 bg-white border-t border-primary/8" aria-labelledby="bundle-services-heading">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={VIEW}
            className="mb-8"
          >
            <motion.div variants={fadeUp} className="flex flex-col">
              <SectionLabel>Growth Packages</SectionLabel>
              <h2
                id="bundle-services-heading"
                className="text-2xl lg:text-3xl font-extrabold text-primary-dark mb-2"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Bundled Services
              </h2>
              <p className="text-text-muted text-sm max-w-xl">
                Strategic packages designed for end-to-end growth and execution.
              </p>
            </motion.div>
          </motion.div>

          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={VIEW}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0 m-0"
          >
            {(showAllBundles ? bundles : bundles.slice(0, INITIAL_VISIBLE)).map((s) => renderCard(s, true))}
          </motion.ul>

          {bundles.length > INITIAL_VISIBLE && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={VIEW}
              className="text-center mt-8"
            >
              <button
                className="px-6 py-2.5 rounded-xl border-2 border-accent text-[#b8860b] font-bold text-sm hover:bg-accent hover:text-primary-dark transition-all duration-200"
                onClick={() => setShowAllBundles((p) => !p)}
              >
                {showAllBundles ? "Show Less" : `See All ${bundles.length} Bundle Packages`}
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          Section 4 — Pricing  (dark)
      ════════════════════════════════════════════════ */}
      <section className="py-16 bg-[#0d1f16]" aria-labelledby="pricing-heading">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={VIEW}
            className="mb-8"
          >
            <motion.div variants={fadeUp} className="flex flex-col">
              <p className="inline-flex self-start items-center px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-accent font-extrabold text-xs uppercase tracking-wider mb-3">
                Transparent Pricing
              </p>
              <h2
                id="pricing-heading"
                className="text-2xl lg:text-3xl font-extrabold text-white mb-2"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Pricing &amp; Payment Options
              </h2>
              <p className="text-white/55 text-sm max-w-xl">
                Starting prices and flexible payment plans for all services and bundles.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEW}
            className="overflow-x-auto rounded-2xl border border-white/10 shadow-xl"
          >
            <table className="w-full text-sm border-collapse">
              <caption className="sr-only">Pricing and payment options for Tishbite Digital services and bundles</caption>
              <thead>
                <tr className="bg-white/10 text-white">
                  {["Service / Bundle", "Starting Price", "Subscription / Installments", "Maintenance / Support", "Notes", ""].map((h) => (
                    <th key={h} scope="col" className="text-left px-4 py-3.5 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRICING_ROWS.map((row, i) => (
                  <tr
                    key={row.service}
                    className={`${i % 2 === 0 ? "bg-white/4" : "bg-transparent"} border-b border-white/8 hover:bg-white/8 transition-colors`}
                  >
                    <td className="px-4 py-3.5 font-semibold text-white whitespace-nowrap">{row.service}</td>
                    <td className="px-4 py-3.5 text-accent font-bold whitespace-nowrap">{row.startingPrice}</td>
                    <td className="px-4 py-3.5 text-white/65">{row.subscription}</td>
                    <td className="px-4 py-3.5 text-white/65">{row.maintenance}</td>
                    <td className="px-4 py-3.5 text-white/50 text-xs">{row.notes}</td>
                    <td className="px-4 py-3.5">
                      {row.checkoutService ? (
                        <button
                          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-accent text-primary-dark hover:bg-accent-light transition-colors whitespace-nowrap"
                          onClick={() => goCheckout(row.checkoutService, row.price)}
                          aria-label={`Get started with ${row.service}`}
                        >
                          Get Started <FaArrowRight size={9} />
                        </button>
                      ) : (
                        <Link
                          href="/contact"
                          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors whitespace-nowrap no-underline"
                        >
                          Enquire <FaArrowRight size={9} />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          Section 5 — CTA  (gradient)
      ════════════════════════════════════════════════ */}
      <section className="py-16 bg-linear-to-r from-primary-dark via-primary to-primary-light">
        <motion.div
          className="container mx-auto px-4 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={VIEW}
        >
          <motion.div variants={fadeLeft}>
            <h3
              className="text-xl lg:text-2xl font-bold text-white mb-1"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Not sure where to start?
            </h3>
            <p className="text-white/70 text-sm m-0">
              See exactly how we turn your goals into a clear growth plan — step by step.
            </p>
          </motion.div>
          <motion.div variants={fadeRight} className="shrink-0">
            <Link
              href="/how-we-work"
              className="flex items-center gap-2 bg-accent hover:bg-accent-light text-primary-dark font-bold px-7 py-3.5 rounded-xl text-sm transition-colors duration-200 no-underline whitespace-nowrap shadow-lg"
            >
              See How We Work <FaArrowRight aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
