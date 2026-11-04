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
import Section, { SectionHeading } from "@/components/Section";
import Card, { CardMuted } from "@/components/Card";
import { useSwipeCarousel } from "@/hooks/useSwipeCarousel";

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
      "Our individual services start from R1,299, a full 5-page lead-generating website is R7,500, and our bundled packages start from R3,999 (Get Found Starter: one-page website, Google Business Profile and WhatsApp setup). Monthly plans start from R399/month. Most packages can be paid in 3 to 6 monthly instalments, and our growth bundles include 1 month free maintenance & support.",
  },
  {
    question: "How long does it take to build a website?",
    answer:
      "A standard lead-generating website typically takes 2 to 4 weeks from strategy to launch. More complex builds with integrations or e-commerce can take 4 to 8 weeks. We give you a clear timeline before we start.",
  },
  {
    question: "Do you offer payment plans or instalments?",
    answer:
      "Yes. Most of our packages include 3 to 6 monthly instalment options so your business can invest in growth without a large upfront cost.",
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

const STATS = [
  { end: 50, suffix: "+", label: "Businesses supported with online growth systems" },
  { end: 120, suffix: "%", label: "Average traffic uplift achieved through SEO and structured pages" },
  { end: 24, suffix: "", label: "Lead capture & automation systems deployed" },
];

/* ── Page ───────────────────────────────────────────────────────────────
   Section rhythm: Hero (dark, own component) → Digital Growth Intro
   (light) → What We Improve (tint) → Who We Serve (dark) → Lead Magnets
   (break) → Stats (light) → Testimonials (tint) → FAQ (dark) → Selected
   Projects (light). Never the same surface twice in a row. ──────────── */
export default function HomePageContent() {
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const {
    containerRef: projectsContainerRef,
    trackRef: projectsTrackRef,
    activeIndex: projectsActiveIndex,
    goTo: projectsGoTo,
    next: projectsNext,
    prev: projectsPrev,
    canPrev: projectsCanPrev,
    canNext: projectsCanNext,
  } = useSwipeCarousel(PROJECTS.length);

  return (
    <>
      <Hero />

      {/* ── Digital Growth Intro (light) ── */}
      <Section surface="light" dividerNext="tint">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEW}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:w-1/2 w-full order-1"
          >
            <Link href="/about" className="block no-underline group">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="rounded-2xl border border-primary/10 bg-white shadow-xl group-hover:shadow-2xl transition-shadow duration-300 p-8"
              >
                <p className="text-primary-dark font-bold text-lg mb-1" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                  A small team, built for big results
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

          <motion.div
            initial={{ opacity: 0, x: 36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEW}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            className="lg:w-1/2 order-2 flex flex-col"
          >
            <SectionHeading id="home-about-heading" kicker="Digital Growth for Small Businesses">
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
            </SectionHeading>
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
              <motion.div whileHover="hover" initial="rest" whileTap={{ scale: 0.97 }}>
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

              <motion.div whileHover="hover" initial="rest" whileTap={{ scale: 0.97 }}>
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
        </div>
      </Section>

      {/* ── What We Improve (tint) ── */}
      <Section surface="tint" texture dividerNext="dark">
        <SectionHeading kicker="What We Improve" center>
          Built for rankings, trust, and lead flow — wherever your customers search
        </SectionHeading>
        <p className="text-text-muted max-w-2xl text-base text-center mx-auto -mt-6 mb-8">
          We strengthen location signals, service relevance, trust content, and
          conversion paths so both search engines and AI-driven discovery tools
          can understand who you help, where you help them, and why your
          business is worth contacting.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {GROWTH_PILLARS.map((pillar, i) => (
            <Card key={pillar.title} variant="product" index={i} icon={pillar.Icon}>
              <h3 className="text-base font-bold text-primary-dark mb-2" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                {pillar.title}
              </h3>
              <CardMuted>{pillar.description}</CardMuted>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {LOCAL_SEO_POINTS.map((point) => (
            <div
              key={point}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white border border-primary/8 text-text-dark text-sm font-medium"
            >
              <FaMapMarkerAlt className="text-primary shrink-0" aria-hidden="true" />
              {point}
            </div>
          ))}
        </div>
      </Section>

      {/* ── Who We Serve (dark) ── */}
      <Section surface="dark" texture dividerNext="break">
        <SectionHeading kicker="Who We Serve" center>
          Built for every business,{" "}
          <span
            style={{
              backgroundImage: "linear-gradient(135deg, #40916c 0%, #f4c95d 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            not just one kind
          </span>
        </SectionHeading>
        <p className="text-white/60 max-w-xl text-base text-center mx-auto -mt-6 mb-10">
          Whether you are just starting out or scaling an existing brand, we
          have a path that fits where you are right now.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {WHO_WE_HELP.map((item, i) => (
            <Card key={item.label} variant="info" index={i} icon={item.Icon}>
              <p className="font-bold text-sm leading-snug mb-1" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                {item.label}
              </p>
              <CardMuted>{item.desc}</CardMuted>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── Lead Magnets (break — pattern isolation) ── */}
      <Section surface="break" dividerNext="light">
        <SectionHeading kicker="Lead Magnets That Convert" center>
          Turn website traffic into conversations and clients
        </SectionHeading>
        <p className="text-primary-dark/70 max-w-xl text-base text-center mx-auto -mt-6 mb-10">
          Strong SEO and GEO performance starts with clear offers, answer-first
          content, and fast next steps for high-intent visitors.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <motion.article
            whileHover={{ y: -6, boxShadow: "0 16px 36px rgba(27,67,50,0.45)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="rounded-2xl p-7 flex flex-col cursor-pointer bg-linear-to-br from-primary-dark to-primary text-white shadow-xl"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-white/15">
              <FaBullhorn size={24} className="text-accent" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
              FREE Website &amp; SEO Audit
            </h3>
            <p className="text-sm leading-relaxed mb-3 flex-1 text-white/80">
              We review your website, search visibility, mobile user journey,
              and lead-capture flow so you know exactly what is stopping more
              enquiries.
            </p>
            <p className="text-xs mb-4 text-white/60">
              For small businesses and entrepreneurs ready to attract and convert more customers
            </p>
            <Link
              href="/contact"
              className="cta-break group inline-flex items-center justify-center gap-1.5 font-bold text-sm no-underline text-primary-dark rounded-xl px-4 py-2.5"
            >
              Claim Your Free Audit <FaArrowRight size={11} className="transition-transform duration-200 group-hover:translate-x-1.5" />
            </Link>
          </motion.article>

          <Card variant="product" index={1} icon={FaBlog}>
            <h3 className="text-xl font-bold mb-2 text-primary-dark" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
              Read Client-Attracting Insights
            </h3>
            <p className="text-sm leading-relaxed mb-3 text-text-muted">
              Practical content on SEO, websites, automation, and digital
              growth strategies for small businesses and new entrepreneurs
              building their presence online.
            </p>
            <p className="text-xs mb-4 text-text-muted/70">
              Built to answer the questions your future customers are already searching
            </p>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-1.5 font-bold text-sm no-underline text-primary hover:text-primary-dark transition-colors"
            >
              Read Latest Insights <FaArrowRight size={11} className="transition-transform duration-200 group-hover:translate-x-1.5" />
            </Link>
          </Card>
        </div>
      </Section>

      {/* ── Stats (light) ── */}
      <Section surface="light" dividerNext="tint">
        <SectionHeading center>Focused on measurable business growth</SectionHeading>
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATS.map(({ end, suffix, label }, i) => (
            <Card key={label} variant="stat" index={i} icon={FaRocket}>
              <p
                className="text-4xl lg:text-5xl font-extrabold text-primary-dark mb-2"
                aria-label={`${end}${suffix} ${label}`}
              >
                {statsInView ? <CountUp end={end} duration={2.2} /> : end}
                {suffix}
              </p>
              <CardMuted className="max-w-55 mx-auto">{label}</CardMuted>
            </Card>
          ))}
        </div>
      </Section>

      {/* Testimonials — tint surface, handled inside the component */}
      <Testimonials />

      {/* ── FAQ (dark) ── */}
      <Section surface="dark" texture dividerNext="light">
        <SectionHeading kicker="Questions We Solve" center>
          Questions from small businesses and first-time entrepreneurs
        </SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FAQ_ITEMS.map((item, i) => (
            <Card key={item.question} variant="info" index={i}>
              <div className="w-7 h-7 rounded-lg bg-white/10 text-accent flex items-center justify-center text-xs font-extrabold mb-3">
                {i + 1}
              </div>
              <h3 className="text-sm font-bold mb-2 leading-snug" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                {item.question}
              </h3>
              <CardMuted>{item.answer}</CardMuted>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── Selected Projects (light) ── */}
      <Section surface="light">
        <SectionHeading center>Selected Projects</SectionHeading>
        <div ref={projectsContainerRef} className="overflow-hidden -mx-4 px-4 mb-6">
          <div
            ref={projectsTrackRef}
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
            onClick={projectsPrev}
            disabled={!projectsCanPrev}
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
                aria-selected={i === projectsActiveIndex}
                aria-label={`Show project ${i + 1}`}
                onClick={() => projectsGoTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === projectsActiveIndex ? "w-6 bg-primary" : "w-2 bg-primary/20 hover:bg-primary/40"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={projectsNext}
            disabled={!projectsCanNext}
            aria-label="Next project"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/8 border border-primary/15 text-primary-dark hover:bg-primary/15 disabled:opacity-30 disabled:hover:bg-primary/8 transition-colors duration-200"
          >
            <FaChevronRight size={13} />
          </button>
        </div>

        <div className="text-center">
          <motion.div whileHover="hover" initial="rest" whileTap={{ scale: 0.97 }}>
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
      </Section>
    </>
  );
}
