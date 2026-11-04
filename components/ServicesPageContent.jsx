"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Code-split react-markdown into this route's own chunk instead of a
// shared/common one — it was previously loading on every page site-wide.
// SSR stays on (default), so rendered output/SEO is unaffected.
const ReactMarkdown = dynamic(() => import("react-markdown"));
import CountUp from "react-countup";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaBullhorn, FaCode, FaSearch, FaCogs, FaLayerGroup, FaRocket,
  FaArrowRight, FaCheckCircle, FaMapMarkerAlt, FaCalendarCheck, FaShieldAlt,
  FaUsers, FaPaintBrush, FaPen, FaMoneyBillWave,
} from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import { PRODUCTS, getProductByTitle } from "@/lib/products";

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

const getServicePrice = (s) => s?.price || getProductByTitle(s?.title)?.price || "Custom pricing";

// Numeric amount to send to checkout; null for monthly plans (not a
// once-off PayFast purchase) so the card can route those to "Enquire" instead.
const getCheckoutPrice = (s) => getProductByTitle(s?.title)?.numericPrice ?? null;

const getDescription = (s) => {
  const b = getProductByTitle(s?.title);
  if (b?.blueprint) return b.blueprint;
  return s?.category === "bundle"
    ? "**Problem:** Growth stalls when critical functions are handled in isolation.\n\n**Solution:** This bundle combines key systems into one coordinated execution plan.\n\n**Result Focus:** Better consistency, higher lead quality, and clearer growth momentum."
    : "**Problem:** Businesses struggle to turn visibility into qualified enquiries.\n\n**Solution:** This service strengthens one core growth function with practical execution support.\n\n**Result Focus:** Better trust, stronger conversion readiness, and improved business outcomes.";
};

const getDisplayTitle = (s) => (s?.displayTitle || s?.title || "Service").replace(/^The\s+/i,"").replace(/™/g,"").trim();

const getBadge = (s) => getProductByTitle(s?.title)?.badge || null;

/* ── Fallback data — mirrors lib/products.js so the page renders the full
   catalog correctly even before any services exist in the database ── */
const FALLBACK_GENERAL = PRODUCTS
  .filter((p) => p.category === "general")
  .map((p) => ({ _id: `fb-${p.slug}`, title: p.title, category: "general", price: p.price }));
const FALLBACK_BUNDLES = PRODUCTS
  .filter((p) => p.category === "bundle")
  .sort((a, b) => (a.tier === b.tier ? 0 : a.tier === "lead" ? -1 : 1))
  .map((p) => ({ _id: `fb-${p.slug}`, title: p.title, category: "bundle", price: p.price }));
const FALLBACK_SERVICES = [...FALLBACK_GENERAL, ...FALLBACK_BUNDLES];

const PRICING_ROWS = PRODUCTS.map((p) => ({
  service: p.title,
  startingPrice: p.price,
  subscription: p.installment
    ? `${p.installment.months} monthly installments (R${p.installment.amount.toLocaleString("en-ZA")} each)`
    : p.numericPrice
      ? "Once-off, or ask about installments"
      : "Ongoing — no long-term contract",
  maintenance: p.tier === "advanced" ? "Free maintenance/support period included" : "—",
  notes: p.shortDescription,
  checkoutService: p.numericPrice ? p.title : null,
  price: p.numericPrice,
}));

const TEAM_CAPABILITIES = [
  { Icon: FaCode, label: "Web Development & Engineering" },
  { Icon: FaBullhorn, label: "SEO & Digital Marketing" },
  { Icon: FaPaintBrush, label: "Design & Brand Identity" },
  { Icon: FaPen, label: "Content & Copywriting" },
];

const HERO_FEATURES = [
  { Icon:FaMapMarkerAlt,  label:"Serving All of South Africa" },
  { Icon:FaCalendarCheck, label:"Installment Plans"     },
  { Icon:FaShieldAlt,     label:"1 Month Free Support"  },
  { Icon:FaCheckCircle,   label:"Results Focused"       },
];

const INITIAL_VISIBLE = 4;

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
        const res = await fetch("/api/services");
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
    const Icon          = getServiceIcon(service);
    const isExpanded    = expanded[service._id];
    const badge         = getBadge(service);
    const checkoutPrice = getCheckoutPrice(service);
    return (
      <motion.li
        key={service._id}
        variants={cardVar}
        whileTap={{ scale: 0.98 }}
        className={`relative flex flex-col bg-white rounded-2xl p-6 border ${isBundle ? "border-accent/30" : "border-primary/10"} shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}
      >
        {badge && (
          <span className="absolute -top-2.5 left-5 text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full bg-primary-dark text-white shadow-sm">
            {badge}
          </span>
        )}

        <div className="flex items-start justify-between mb-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isBundle ? "bg-accent/15" : "bg-primary/10"}`}>
            <Icon className={`text-lg ${isBundle ? "text-[#b8860b]" : "text-primary"}`} aria-hidden="true" />
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isBundle ? "bg-accent/15 text-[#b8860b]" : "bg-primary/10 text-primary"}`}>
            {isBundle ? "Bundle" : "General"}
          </span>
        </div>

        <p className={`text-sm font-bold mb-1 ${isBundle ? "text-[#8a6500]" : "text-primary"}`}>
          {getServicePrice(service)}
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
          {checkoutPrice ? (
            <motion.button
              className={`ml-auto flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg ${isBundle ? "bg-accent text-primary-dark" : "bg-primary text-white"}`}
              onClick={() => goCheckout(getDisplayTitle(service), checkoutPrice)}
              aria-label={`Get started with ${getDisplayTitle(service)}`}
              whileHover="hover"
              initial="rest"
              whileTap={{ scale: 0.95 }}
              variants={isBundle ? {
                rest: { y: 0, backgroundColor: "#f4c95d", boxShadow: "0 2px 6px rgba(244,201,93,0.2)" },
                hover: { y: -2, backgroundColor: "#ffe08a", boxShadow: "0 6px 18px rgba(244,201,93,0.5)" },
              } : {
                rest: { y: 0, backgroundColor: "#2d6a4f", boxShadow: "0 2px 6px rgba(27,67,50,0.15)" },
                hover: { y: -2, backgroundColor: "#1b4332", boxShadow: "0 6px 18px rgba(27,67,50,0.38)" },
              }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              Get Started
              <motion.span variants={{ rest: { x: 0 }, hover: { x: 3 } }} transition={{ type: "spring", stiffness: 300, damping: 18 }} aria-hidden="true">
                <FaArrowRight size={10} />
              </motion.span>
            </motion.button>
          ) : (
            <Link
              href="/contact"
              className={`ml-auto flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg no-underline ${isBundle ? "bg-accent text-primary-dark" : "bg-primary text-white"}`}
              aria-label={`Enquire about ${getDisplayTitle(service)}`}
            >
              Enquire <FaArrowRight size={10} />
            </Link>
          )}
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

            {/* Team capability card — LEFT on desktop */}
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
                <div className="relative rounded-2xl shadow-2xl bg-white border border-primary/10 p-7">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <FaUsers className="text-primary text-lg" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-primary-dark mb-2" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                    A Small Team, Full Capability
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-5">
                    Every service on this page is delivered by a small, skilled
                    team — not outsourced piecemeal.
                  </p>
                  <ul className="space-y-3 list-none p-0 m-0">
                    {TEAM_CAPABILITIES.map(({ Icon, label }) => (
                      <li key={label} className="flex items-center gap-3 text-sm font-semibold text-text-dark">
                        <Icon className="text-primary shrink-0" aria-hidden="true" />
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>
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
                South African Digital Agency
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
                      {statsInView ? <CountUp end={end} duration={1.6} /> : end}
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
          Positioning strip — the path a customer actually takes
      ════════════════════════════════════════════════ */}
      <section className="py-10 bg-primary-dark" aria-label="How our products work together">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-4">
            {[
              { Icon: FaSearch, title: "Get Found", body: "Google profile + SEO put you in front of buyers already searching" },
              { Icon: FaCheckCircle, title: "Get Chosen", body: "A fast, trustworthy website and reviews turn lookers into leads" },
              { Icon: FaMoneyBillWave, title: "Get Paid", body: "WhatsApp and clear next steps turn leads into booked customers" },
            ].map(({ Icon, title, body }, i, arr) => (
              <motion.div
                key={title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={VIEW}
                className="flex items-center gap-4 sm:gap-3"
              >
                <div className="flex flex-col items-center text-center max-w-50">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-2.5">
                    <Icon className="text-accent text-lg" aria-hidden="true" />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">{title}</h3>
                  <p className="text-white/55 text-xs leading-relaxed m-0">{body}</p>
                </div>
                {i < arr.length - 1 && (
                  <FaArrowRight className="hidden sm:block text-accent/50 text-lg shrink-0" aria-hidden="true" />
                )}
              </motion.div>
            ))}
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
              <motion.button
                className="px-6 py-2.5 rounded-xl border-2 border-primary text-primary font-bold text-sm"
                onClick={() => setShowAllGeneral((p) => !p)}
                whileHover={{ y: -2, backgroundColor: "#2d6a4f", color: "#ffffff", boxShadow: "0 6px 16px rgba(27,67,50,0.3)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                {showAllGeneral ? "Show Less" : `See All ${general.length} General Services`}
              </motion.button>
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
              <motion.button
                className="px-6 py-2.5 rounded-xl border-2 border-accent text-[#b8860b] font-bold text-sm"
                onClick={() => setShowAllBundles((p) => !p)}
                whileHover={{ y: -2, backgroundColor: "#f4c95d", color: "#1b4332", boxShadow: "0 6px 18px rgba(244,201,93,0.45)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                {showAllBundles ? "Show Less" : `See All ${bundles.length} Bundle Packages`}
              </motion.button>
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
                        <motion.button
                          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-accent text-primary-dark whitespace-nowrap"
                          onClick={() => goCheckout(row.checkoutService, row.price)}
                          aria-label={`Get started with ${row.service}`}
                          whileHover={{ scale: 1.06, backgroundColor: "#ffe08a", boxShadow: "0 4px 12px rgba(244,201,93,0.45)" }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        >
                          Get Started <FaArrowRight size={9} />
                        </motion.button>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.06, backgroundColor: "rgba(255,255,255,0.22)" }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 300, damping: 18 }}
                          className="rounded-lg border border-white/20 bg-white/10 inline-flex"
                        >
                          <Link
                            href="/contact"
                            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white whitespace-nowrap no-underline"
                          >
                            Enquire <FaArrowRight size={9} />
                          </Link>
                        </motion.div>
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
          <motion.div
            variants={fadeRight}
            className="shrink-0"
            whileHover="hover"
            initial="rest"
            whileTap={{ scale: 0.97 }}
          >
            <motion.div
              variants={{
                rest: { y: 0, boxShadow: "0 4px 14px rgba(244,201,93,0.25)" },
                hover: { y: -4, boxShadow: "0 12px 28px rgba(244,201,93,0.55)" },
              }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="rounded-xl"
            >
              <Link
                href="/how-we-work"
                className="flex items-center gap-2 bg-accent text-primary-dark font-bold px-7 py-3.5 rounded-xl text-sm no-underline whitespace-nowrap"
              >
                See How We Work
                <motion.span
                  variants={{ rest: { x: 0 }, hover: { x: 5 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  aria-hidden="true"
                >
                  <FaArrowRight />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
