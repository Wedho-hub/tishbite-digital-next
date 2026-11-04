"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import {
  FaBullhorn,
  FaBlog,
  FaArrowRight,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaSearch,
  FaWhatsapp,
  FaGlobeAfrica,
  FaRocket,
  FaShoppingCart,
  FaBriefcase,
  FaUserMd,
  FaHammer,
  FaBuilding,
  FaCode,
  FaPaintBrush,
  FaPen,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import { useSwipeCarousel } from "@/hooks/useSwipeCarousel";

/* ── Animation variants ─────────────────────────────────── */
const spring = { type: "spring", stiffness: 120, damping: 18 };
const springFast = { type: "spring", stiffness: 160, damping: 20 };

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: spring },
};
const fadeLeft = {
  hidden: { opacity: 0, x: -36 },
  visible: { opacity: 1, x: 0, transition: spring },
};
const fadeRight = {
  hidden: { opacity: 0, x: 36 },
  visible: { opacity: 1, x: 0, transition: spring },
};
const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: springFast },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const VIEW = { once: true, amount: 0.2 };

/* ── Data ───────────────────────────────────────────────── */
const GROWTH_PILLARS = [
  {
    Icon: FaSearch,
    title: "Rank for searches your buyers are already making",
    description:
      "Get found when customers across South Africa search for what you sell or offer, with SEO-ready pages and conversion-focused structure built for your market.",
  },
  {
    Icon: FaWhatsapp,
    title: "Turn clicks into enquiries and sales",
    description:
      "Make it easy for new customers to contact you, place an order, or book a consultation — with fast, mobile-first flows and clear next steps.",
  },
  {
    Icon: FaGlobeAfrica,
    title: "Build a business asset that keeps working",
    description:
      "We create websites and digital systems that support enquiries, follow-up, trust-building, and long-term growth — not just a once-off launch.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Do you only work with businesses in Cape Town?",
    answer:
      "No. We're based in Cape Town, but we work with small businesses and entrepreneurs across South Africa — our web design, SEO, and digital growth services are fully remote-friendly, wherever your business is based.",
  },
  {
    question: "What does the free Website and SEO audit include?",
    answer:
      "We review your website speed, mobile experience, offer clarity, conversion flow, Google visibility, and lead capture opportunities so you know what is blocking enquiries.",
  },
  {
    question: "Can you help if I need more than just a website?",
    answer:
      "Yes. We build complete growth systems including websites, SEO, Google Business optimization, Meta ads support, WhatsApp lead handling, and CRM automation.",
  },
  {
    question: "How much does a website cost in South Africa?",
    answer:
      "Our general services start from R2,500 and our bundled growth packages start from R8,500. Every project is scoped to your specific goals — we offer flexible installment plans so you can get started without paying everything upfront.",
  },
  {
    question: "How long does it take to build a website?",
    answer:
      "A standard lead-generating website typically takes 2 to 4 weeks from strategy to launch. More complex builds with integrations or e-commerce can take 4 to 8 weeks. We give you a clear timeline before we start.",
  },
  {
    question: "Do you offer payment plans or installments?",
    answer:
      "Yes. Most of our packages include 3 to 6 monthly installment options so your business can invest in growth without a large upfront cost.",
  },
  {
    question: "Can I see examples of your work before hiring you?",
    answer:
      "Absolutely. Visit our Projects page to see websites and digital systems we have built for South African businesses. We are happy to walk you through the results each project achieved.",
  },
];

const PROJECTS = [
  {
    img: "/assets/MaffyPic.png",
    name: "Maffy Online",
    desc: "Corporate HR & recruitment website",
    link: "https://maffyonline.netlify.app/",
  },
  {
    img: "/assets/fogPic.png",
    name: "FOG Educare",
    desc: "Early childhood education website",
    link: null,
  },
  {
    img: "/assets/toolTrackPic.png",
    name: "Tool Tracking App",
    desc: "Full-stack inventory management system",
    link: "https://tooltracking.netlify.app/",
  },
  {
    img: "/assets/churchWebPic.png",
    name: "Church Website",
    desc: "Community & ministry web presence",
    link: "https://inkosiyezasdachurch.netlify.app/",
  },
  {
    img: "/assets/kupumaPic.png",
    name: "Kupuma",
    desc: "Funeral & repatriation services website",
    link: "https://kupuma.vercel.app/",
  },
];

const WHO_WE_HELP = [
  {
    Icon: FaRocket,
    label: "New Entrepreneurs",
    desc: "Launch your idea with a credible brand, website, and digital presence from day one.",
  },
  {
    Icon: FaShoppingCart,
    label: "Retail & Product Businesses",
    desc: "Drive traffic to your store or online shop and turn browsers into paying customers.",
  },
  {
    Icon: FaBriefcase,
    label: "Freelancers & Consultants",
    desc: "Build authority, attract better clients, and stop relying on word-of-mouth alone.",
  },
  {
    Icon: FaUserMd,
    label: "Health & Wellness Providers",
    desc: "Connect with clients searching for your treatments, sessions, or products online.",
  },
  {
    Icon: FaHammer,
    label: "Trades, Crafts & Creatives",
    desc: "Show your work professionally and get enquiries from clients who value quality.",
  },
  {
    Icon: FaBuilding,
    label: "Growing SMEs & Startups",
    desc: "Scale your systems, reach new markets, and compete with bigger players digitally.",
  },
];

const TEAM_SKILLS = [
  { Icon: FaCode, label: "Web Development" },
  { Icon: FaBullhorn, label: "Digital Marketing" },
  { Icon: FaPaintBrush, label: "Design & Branding" },
  { Icon: FaPen, label: "Content & Editing" },
];

const LOCAL_SEO_POINTS = [
  "Service-area messaging tuned for South Africa-wide search intent",
  "Answer-focused copy for users searching in Google and AI assistants",
  "Lead magnets and WhatsApp conversion paths that reduce friction",
];

/* ── Shared sub-components ──────────────────────────────── */
function SectionKicker({ children, center = false }) {
  return (
    <p
      className={`inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-extrabold text-xs uppercase tracking-wider mb-3 ${center ? "self-center" : ""}`}
    >
      {children}
    </p>
  );
}

function SectionTitle({ id, children, light = false }) {
  return (
    <h2
      id={id}
      className={`text-3xl lg:text-4xl font-extrabold leading-tight mb-4 ${light ? "text-white" : "text-primary-dark"}`}
      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
    >
      {children}
    </h2>
  );
}

/* ── Page ───────────────────────────────────────────────── */
export default function HomePageContent() {
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const projectsCarousel = useSwipeCarousel(PROJECTS.length);

  return (
    <>
      <Hero />

      {/* ── About ── */}
      <section
        className="py-16 bg-bg"
        role="region"
        aria-labelledby="home-about-heading"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(27,67,50,0.055) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={VIEW}
            className="flex flex-col lg:flex-row items-center gap-10"
          >
            <motion.div
              variants={fadeLeft}
              className="lg:w-1/2 w-full order-1"
            >
              <Link href="/about" className="block no-underline group">
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="rounded-2xl border border-primary/10 bg-white shadow-xl group-hover:shadow-2xl transition-shadow duration-300 p-8"
                >
                  <p className="text-primary-dark font-bold text-lg mb-1" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                    A small team, built for results
                  </p>
                  <p className="text-text-muted text-sm leading-relaxed mb-6">
                    Led by our founder and backed by a growing team covering every
                    part of your digital presence — from code to content.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {TEAM_SKILLS.map(({ Icon, label }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2.5 bg-bg border border-primary/8 rounded-xl px-3.5 py-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="text-primary text-sm" aria-hidden="true" />
                        </div>
                        <span className="text-text-dark text-sm font-semibold leading-tight">{label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-6 text-primary font-semibold text-sm group-hover:text-primary-dark transition-colors duration-200">
                    Meet the team behind it →
                  </p>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div variants={fadeRight} className="lg:w-1/2 order-2 flex flex-col">
              <SectionKicker>Digital Growth for Small Businesses</SectionKicker>
              <h2
                id="home-about-heading"
                className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4 text-primary-dark"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                We help{" "}
                <span
                  style={{
                    backgroundImage: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 45%, #c49219 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  small businesses &amp; entrepreneurs
                </span>{" "}
                get found and grow online
              </h2>
              <p className="text-text-muted text-base leading-relaxed mb-4">
                Whether you are launching your first business, selling products,
                running a service, or scaling an existing brand — your website
                and digital presence should be working for you around the clock.
                We combine persuasive messaging, SEO structure, ad-ready pages,
                and automation to turn online attention into real revenue.
              </p>
              <ul className="space-y-2 mb-6 list-none p-0 m-0">
                {[
                  "Position your business clearly so customers know why to choose you",
                  "Capture more leads and sales with strong calls to action and WhatsApp paths",
                  "Improve search visibility for high-intent buyers across South Africa",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-text-muted text-sm">
                    <FaCheckCircle className="text-primary mt-0.5 shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <motion.div
                  whileHover="hover"
                  initial="rest"
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.div
                    variants={{
                      rest: { y: 0, boxShadow: "0 4px 12px rgba(27,67,50,0.18)" },
                      hover: { y: -4, boxShadow: "0 12px 28px rgba(27,67,50,0.42)" },
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="rounded-xl"
                  >
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-primary-dark to-primary-light text-white font-bold text-sm no-underline"
                    >
                      Get My Free Audit
                      <motion.span variants={{ rest: { x: 0 }, hover: { x: 5 } }} transition={{ type: "spring", stiffness: 300, damping: 18 }} aria-hidden="true">
                        <FaArrowRight />
                      </motion.span>
                    </Link>
                  </motion.div>
                </motion.div>

                <motion.div
                  whileHover="hover"
                  initial="rest"
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.div
                    variants={{
                      rest: { y: 0, backgroundColor: "transparent", color: "var(--color-primary)" },
                      hover: { y: -3, backgroundColor: "var(--color-primary)", color: "#ffffff", boxShadow: "0 8px 20px rgba(27,67,50,0.3)" },
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="rounded-xl border-2 border-primary"
                  >
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm no-underline"
                      style={{ color: "inherit" }}
                    >
                      View Services
                      <motion.span variants={{ rest: { x: 0 }, hover: { x: 5 } }} transition={{ type: "spring", stiffness: 300, damping: 18 }} aria-hidden="true">
                        <FaArrowRight />
                      </motion.span>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* What We Improve + South Africa focus (merged from two former standalone sections) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEW}
            className="mt-16 pt-16 border-t border-primary/8"
          >
            <div className="text-center flex flex-col items-center mb-10">
              <SectionKicker center>What We Improve</SectionKicker>
              <h3
                className="text-2xl lg:text-3xl font-extrabold leading-tight mb-4 text-primary-dark"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Built for rankings, trust, and lead flow — wherever your customers search
              </h3>
              <p className="text-text-muted max-w-2xl text-base">
                We strengthen location signals, service relevance, trust
                content, and conversion paths so both search engines and
                AI-driven discovery tools can understand who you help, where
                you help them, and why your business is worth contacting.
              </p>
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={VIEW}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              {GROWTH_PILLARS.map((pillar) => (
                <motion.article
                  key={pillar.title}
                  variants={cardVariants}
                  whileHover={{ y: -6, boxShadow: "0 16px 36px rgba(196,146,28,0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 280, damping: 20 }}
                  className="bg-linear-to-br from-accent to-accent-light rounded-2xl p-7 shadow-md"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/35 backdrop-blur-sm flex items-center justify-center mb-4">
                    <pillar.Icon className="text-primary-dark text-xl" aria-hidden="true" />
                  </div>
                  <h4
                    className="text-base font-bold text-primary-dark mb-2"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {pillar.title}
                  </h4>
                  <p className="text-primary-dark/75 text-sm leading-relaxed m-0">
                    {pillar.description}
                  </p>
                </motion.article>
              ))}
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={VIEW}
              className="flex flex-wrap justify-center gap-3"
            >
              {LOCAL_SEO_POINTS.map((point) => (
                <motion.div
                  key={point}
                  variants={fadeUp}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white border border-primary/8 text-text-dark text-sm font-medium"
                >
                  <FaMapMarkerAlt className="text-primary shrink-0" aria-hidden="true" />
                  {point}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Who We Help ── */}
      <section
        className="py-16 bg-white"
        role="region"
        aria-labelledby="who-we-help-heading"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center flex flex-col items-center mb-10">
            <SectionKicker center>Who We Serve</SectionKicker>
            <h2
              id="who-we-help-heading"
              className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4 text-primary-dark"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Built for every business,{" "}
              <span
                style={{
                  backgroundImage: "linear-gradient(135deg, #2d6a4f 0%, #c49219 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                not just one kind
              </span>
            </h2>
            <p className="text-text-muted max-w-xl text-base">
              Whether you are just starting out or scaling an existing brand, we
              have a path that fits where you are right now.
            </p>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={VIEW}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6"
          >
            {WHO_WE_HELP.map((item) => (
              <motion.div
                key={item.label}
                variants={cardVariants}
                whileHover={{ y: -5, boxShadow: "0 14px 32px rgba(27,67,50,0.12)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="flex flex-col items-start gap-3 p-5 rounded-2xl border border-primary/8 bg-bg hover:bg-white transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, rgba(27,67,50,0.10) 0%, rgba(27,67,50,0.04) 100%)" }}>
                  <item.Icon className="text-primary text-base" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-bold text-primary-dark text-sm leading-snug mb-1" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                    {item.label}
                  </p>
                  <p className="text-text-muted text-xs leading-relaxed m-0">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Lead Magnets / Promo ── */}
      <section
        className="py-16 bg-bg"
        role="region"
        aria-labelledby="home-promo-heading"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(27,67,50,0.055) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10 flex flex-col items-center">
            <SectionKicker center>Lead Magnets That Convert</SectionKicker>
            <SectionTitle id="home-promo-heading">
              Turn website traffic into conversations and clients
            </SectionTitle>
            <p className="text-text-muted max-w-xl text-base">
              Strong SEO and GEO performance starts with clear offers,
              answer-first content, and fast next steps for high-intent
              visitors.
            </p>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={VIEW}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              {
                Icon: FaBullhorn,
                title: "FREE Website & SEO Audit",
                body: "We review your website, search visibility, mobile user journey, and lead-capture flow so you know exactly what is stopping more enquiries.",
                meta: "For small businesses and entrepreneurs ready to attract and convert more customers",
                cta: "Claim Your Free Audit",
                href: "/contact",
                highlight: true,
              },
              {
                Icon: FaBlog,
                title: "Read Client-Attracting Insights",
                body: "Practical content on SEO, websites, automation, and digital growth strategies for small businesses and new entrepreneurs building their presence online.",
                meta: "Built to answer the questions your future customers are already searching",
                cta: "Read Latest Insights",
                href: "/blog",
                highlight: false,
              },
            ].map((card) => (
              <motion.article
                key={card.title}
                variants={card.highlight ? fadeLeft : fadeRight}
                whileHover={{ y: -6, boxShadow: card.highlight ? "0 16px 36px rgba(27,67,50,0.45)" : "0 12px 28px rgba(27,67,50,0.15)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={`rounded-2xl p-7 flex flex-col cursor-pointer ${card.highlight ? "bg-linear-to-br from-primary-dark to-primary text-white shadow-xl" : "bg-bg border border-primary/10"}`}
              >
                <card.Icon
                  size={48}
                  className={`mb-4 ${card.highlight ? "text-accent" : "text-primary"}`}
                  aria-hidden="true"
                />
                <h4
                  className={`text-xl font-bold mb-2 ${card.highlight ? "text-white" : "text-primary-dark"}`}
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {card.title}
                </h4>
                <p className={`text-sm leading-relaxed mb-3 flex-1 ${card.highlight ? "text-white/80" : "text-text-muted"}`}>
                  {card.body}
                </p>
                <p className={`text-xs mb-4 ${card.highlight ? "text-white/60" : "text-text-muted/70"}`}>
                  {card.meta}
                </p>
                <Link
                  href={card.href}
                  className={`group inline-flex items-center gap-1.5 font-bold text-sm no-underline ${card.highlight ? "text-accent hover:text-accent-light" : "text-primary hover:text-primary-dark"} transition-colors`}
                >
                  {card.cta} <FaArrowRight size={11} className="transition-transform duration-200 group-hover:translate-x-1.5" />
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section
        className="py-16 bg-linear-to-r from-primary-dark via-primary to-primary-light"
        role="region"
        aria-labelledby="home-stats-heading"
      >
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <motion.h2
            id="home-stats-heading"
            className="text-3xl lg:text-4xl font-extrabold text-white mb-12"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEW}
          >
            Focused on measurable business growth
          </motion.h2>
          <motion.div
            ref={statsRef}
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={VIEW}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                end: 50,
                suffix: "+",
                label: "Businesses supported with online growth systems",
              },
              {
                end: 120,
                suffix: "%",
                label: "Average traffic uplift achieved through SEO and structured pages",
              },
              {
                end: 24,
                suffix: "",
                label: "Lead capture & automation systems deployed",
              },
            ].map(({ end, suffix, label }) => (
              <motion.div key={label} variants={fadeUp}>
                <p
                  className="text-5xl lg:text-6xl font-extrabold text-accent mb-3"
                  aria-label={`${end}${suffix} ${label}`}
                >
                  {statsInView ? <CountUp end={end} duration={2.2} /> : end}
                  {suffix}
                </p>
                <p className="text-white/70 text-sm max-w-50 mx-auto">
                  {label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Testimonials />

      {/* ── FAQ ── */}
      <section
        className="py-16 bg-bg"
        role="region"
        aria-labelledby="home-faq-heading"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(27,67,50,0.055) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center flex flex-col items-center mb-10">
            <SectionKicker center>Questions We Solve</SectionKicker>
            <SectionTitle id="home-faq-heading">
              Questions from small businesses and first-time entrepreneurs
            </SectionTitle>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={VIEW}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FAQ_ITEMS.map((item) => (
              <motion.article
                key={item.question}
                variants={cardVariants}
                whileTap={{ scale: 0.97 }}
                className="bg-white rounded-2xl p-6 border border-primary/8 hover:shadow-md transition-shadow duration-300"
              >
                <h3
                  className="text-sm font-bold text-primary-dark mb-2 leading-snug"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {item.question}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed m-0">
                  {item.answer}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section
        className="py-16 bg-white"
        role="region"
        aria-labelledby="home-projects-heading"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.h2
            id="home-projects-heading"
            className="text-3xl lg:text-4xl font-extrabold text-primary-dark text-center mb-10"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEW}
          >
            Selected Projects
          </motion.h2>
          <div ref={projectsCarousel.containerRef} className="overflow-hidden -mx-4 px-4 mb-6">
            <div
              ref={projectsCarousel.trackRef}
              className="flex w-max gap-4 cursor-grab active:cursor-grabbing select-none"
              style={{ touchAction: "pan-y" }}
            >
              {PROJECTS.map((project) => {
                const card = (
                  <motion.div
                    whileHover="hover"
                    initial="rest"
                    whileTap={{ scale: 0.96 }}
                    className="group overflow-hidden rounded-2xl bg-bg border border-primary/8"
                  >
                    <motion.div
                      variants={{ rest: { y: 0, boxShadow: "0 2px 8px rgba(27,67,50,0.08)" }, hover: { y: -5, boxShadow: "0 14px 30px rgba(27,67,50,0.28)" } }}
                      transition={{ type: "spring", stiffness: 280, damping: 20 }}
                      className="rounded-2xl"
                    >
                      <div className="relative aspect-4/3 overflow-hidden">
                        <Image
                          src={project.img}
                          alt={`${project.name} — ${project.desc}`}
                          width={300}
                          height={225}
                          sizes="(max-width: 640px) 70vw, 220px"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          draggable={false}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-primary-dark/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-3 text-center">
                        <p className="font-bold text-primary-dark text-sm m-0 group-hover:text-primary transition-colors duration-200">{project.name}</p>
                        <p className="text-text-muted text-xs m-0">{project.desc}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                );
                return project.link ? (
                  <a
                    key={project.name}
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.name} live project (opens in a new tab)`}
                    className="no-underline block w-45 sm:w-55 shrink-0"
                  >
                    {card}
                  </a>
                ) : (
                  <div key={project.name} className="w-45 sm:w-55 shrink-0">
                    {card}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-center gap-5 mb-8">
            <button
              type="button"
              onClick={projectsCarousel.prev}
              disabled={!projectsCarousel.canPrev}
              aria-label="Previous project"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/8 border border-primary/15 text-primary-dark hover:bg-primary/15 disabled:opacity-30 disabled:hover:bg-primary/8 transition-colors duration-200"
            >
              <FaChevronLeft size={13} />
            </button>

            <div className="flex items-center gap-2" role="tablist" aria-label="Project slides">
              {PROJECTS.map((project, i) => (
                <button
                  key={project.name}
                  type="button"
                  role="tab"
                  aria-selected={i === projectsCarousel.activeIndex}
                  aria-label={`Show project ${i + 1}`}
                  onClick={() => projectsCarousel.goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === projectsCarousel.activeIndex ? "w-6 bg-primary" : "w-2 bg-primary/20 hover:bg-primary/40"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={projectsCarousel.next}
              disabled={!projectsCarousel.canNext}
              aria-label="Next project"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/8 border border-primary/15 text-primary-dark hover:bg-primary/15 disabled:opacity-30 disabled:hover:bg-primary/8 transition-colors duration-200"
            >
              <FaChevronRight size={13} />
            </button>
          </div>

          <div className="text-center">
            <motion.div
              whileHover="hover"
              initial="rest"
              whileTap={{ scale: 0.97 }}
            >
              <motion.div
                variants={{
                  rest: { y: 0, boxShadow: "0 4px 12px rgba(27,67,50,0.18)" },
                  hover: { y: -4, boxShadow: "0 12px 28px rgba(27,67,50,0.42)" },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="rounded-xl"
              >
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-primary-dark to-primary-light text-white font-bold no-underline"
                >
                  View All Projects
                  <motion.span variants={{ rest: { x: 0 }, hover: { x: 5 } }} transition={{ type: "spring", stiffness: 300, damping: 18 }} aria-hidden="true">
                    <FaArrowRight />
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
