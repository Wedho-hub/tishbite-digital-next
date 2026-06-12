"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaArrowRight, FaComments, FaClipboardList,
  FaLaptopCode, FaRocket, FaCheckCircle, FaWhatsapp,
} from "react-icons/fa";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const STEPS = [
  {
    number: "01",
    Icon: FaComments,
    title: "Discovery & Consultation",
    body: "We start with a focused conversation about your business goals, target audience, and what you want digital to do for you. No jargon, no long forms — just a clear picture of where you are and where you want to go.",
    bullets: [
      "Free 30-min audit or strategy call",
      "We assess your website, SEO, and current lead flow",
      "You receive honest feedback before any commitment",
    ],
  },
  {
    number: "02",
    Icon: FaClipboardList,
    title: "Strategy & Planning",
    body: "We map out a tailored plan with clear deliverables, timelines, and milestones. You'll know exactly what you're getting, when, and what it costs — no surprises.",
    bullets: [
      "Scoped proposal with itemised deliverables",
      "Installment payment plan options available",
      "Project timeline agreed before work begins",
    ],
  },
  {
    number: "03",
    Icon: FaLaptopCode,
    title: "Design & Development",
    body: "We build your website, SEO structure, or growth system using modern tools and conversion-focused design principles. You're kept in the loop at every stage with updates and review checkpoints.",
    bullets: [
      "Mobile-first, fast-loading builds",
      "Regular progress check-ins via WhatsApp or email",
      "Content, copy, and imagery review included",
    ],
  },
  {
    number: "04",
    Icon: FaRocket,
    title: "Launch & Ongoing Support",
    body: "We review everything together, make final adjustments, and launch with confidence. Our support continues after launch — we don't disappear once the project goes live.",
    bullets: [
      "1 month free post-launch support on all packages",
      "SEO monitoring and ranking checks",
      "Ongoing retainer or update plans available",
    ],
  },
];

export default function HowWeWorkPageContent() {
  return (
    <motion.section
      className="py-8 bg-bg"
      role="region"
      aria-labelledby="how-we-work-heading"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
    >
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center flex flex-col items-center py-14">
          <p className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-wider mb-4">
            Our Process
          </p>
          <h1
            id="how-we-work-heading"
            className="text-4xl lg:text-5xl font-extrabold text-primary-dark mb-4"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            How We Work
          </h1>
          <p className="text-text-muted text-base max-w-2xl">
            Transparent, collaborative, and focused on measurable outcomes — every step is designed to keep you informed and get real results.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {STEPS.map((step) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="bg-white rounded-2xl p-7 border border-primary/8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl font-extrabold text-primary/20 leading-none">
                  {step.number}
                </span>
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <step.Icon className="text-primary text-lg" aria-hidden="true" />
                </div>
              </div>
              <h2
                className="text-lg font-bold text-primary-dark mb-2"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                {step.title}
              </h2>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                {step.body}
              </p>
              <ul className="space-y-2 list-none p-0 m-0">
                {step.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-text-muted">
                    <FaCheckCircle className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Trust bar */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {[
            "No lock-in contracts",
            "Clear pricing upfront",
            "Installment plans available",
            "1 month free post-launch support",
          ].map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-primary/10 rounded-full text-sm font-semibold text-primary-dark shadow-sm"
            >
              ✅ {t}
            </span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={itemVariants}
          className="bg-linear-to-r from-primary-dark via-primary to-primary-light rounded-2xl p-10 text-center"
        >
          <h2
            className="text-2xl lg:text-3xl font-extrabold text-white mb-3"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Ready to start the conversation?
          </h2>
          <p className="text-white/70 text-base max-w-lg mx-auto mb-6">
            Tell us about your business and we'll map out the right growth plan — no pressure, no obligation.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <motion.div
              whileHover="hover"
              initial="rest"
              whileTap={{ scale: 0.97 }}
            >
              <motion.div
                variants={{
                  rest: { y: 0, boxShadow: "0 4px 12px rgba(244,201,93,0.18)" },
                  hover: { y: -4, boxShadow: "0 12px 28px rgba(244,201,93,0.5)" },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="rounded-xl"
              >
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-primary-dark font-bold no-underline">
                  Get My Free Audit
                  <motion.span variants={{ rest: { x: 0 }, hover: { x: 5 } }} transition={{ type: "spring", stiffness: 300, damping: 18 }} aria-hidden="true">
                    <FaArrowRight />
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>

            <motion.a
              href="https://wa.me/27791684548?text=Hi%20Tishbite%20Digital,%20I%20want%20to%20understand%20your%20process%20and%20see%20if%20we%20are%20a%20good%20fit."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold border border-white/20 no-underline"
              whileHover="hover"
              initial="rest"
              whileTap={{ scale: 0.97 }}
              variants={{
                rest: { y: 0, backgroundColor: "rgba(255,255,255,0.08)" },
                hover: { y: -4, backgroundColor: "rgba(255,255,255,0.18)", boxShadow: "0 8px 22px rgba(37,211,102,0.35)" },
              }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <motion.span variants={{ rest: { scale: 1 }, hover: { scale: 1.2 } }} transition={{ type: "spring", stiffness: 300, damping: 18 }} aria-hidden="true">
                <FaWhatsapp />
              </motion.span>
              Chat on WhatsApp
            </motion.a>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
