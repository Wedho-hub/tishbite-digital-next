"use client";

import Link from "next/link";
import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import { motion } from "framer-motion";
import { FaArrowRight, FaCheckCircle, FaWhatsapp } from "react-icons/fa";

// Loaded locally so the bolder, more distinctive display face stays scoped
// to the hero headline instead of changing heading type site-wide.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, staggerChildren: 0.14 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const proofVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 220, damping: 18 },
  },
};

const PROOF_ITEMS = [
  "More qualified leads",
  "Better Google visibility",
  "Faster WhatsApp follow-up",
];

// Relative bar heights for the small chart shape inside the browser mockup.
const CHART_BARS = [40, 65, 48, 85, 60];

export default function Hero() {
  return (
    <section
      className={`${spaceGrotesk.variable} relative overflow-hidden isolate bg-[#102015] pt-1 pb-14`}
      aria-label="Tishbite Digital helping South African businesses get more clients online"
    >
      {/* Background photo, deliberately subdued so it reads as atmosphere, not subject */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/assets/hero-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover"
          style={{ objectPosition: "center 32%", filter: "saturate(0.55) brightness(0.8)" }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#0d2318]/96 via-[#153726]/90 to-primary-dark/68" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0a1b12]/80 via-transparent to-[#0a1b12]/35" />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10 min-h-[clamp(500px,68vh,740px)]">

          {/* ── Text content ── */}
          <motion.div
            className="lg:w-[44%] flex flex-col justify-center order-2 lg:order-1 w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={itemVariants}
              className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-[#17281f] text-[0.78rem] font-extrabold uppercase tracking-wider mb-4 shadow-sm"
            >
              <motion.span
                className="w-2 h-2 rounded-full bg-[#17281f] shrink-0"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              Web Design, SEO, Ads and WhatsApp Lead Generation
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="text-[clamp(2.1rem,4vw,3.2rem)] font-bold leading-[1.16] tracking-tight text-white mb-4 text-balance"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              We Help South African Businesses Get More Clients Online
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-[1.05rem] text-white/85 max-w-135 mb-5 leading-relaxed"
            >
              Websites. SEO. Ads. Built to generate leads, sales, bookings, and
              WhatsApp enquiries — not just look good. Whether you are a small
              business owner, a new entrepreneur, or a growing brand, we help
              you build a digital presence that turns online attention into real
              clients.
            </motion.p>

            <motion.div
              variants={containerVariants}
              className="flex flex-wrap gap-2 mb-6"
              aria-label="Business growth benefits"
            >
              {PROOF_ITEMS.map((item) => (
                <motion.span
                  key={item}
                  variants={proofVariants}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/92 border border-white/40 shadow-sm text-[#173828] text-sm font-semibold"
                >
                  <FaCheckCircle className="text-primary" aria-hidden="true" />
                  {item}
                </motion.span>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              <motion.div
                whileHover="hover"
                initial="rest"
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                <motion.div
                  variants={{
                    rest: { y: 0, boxShadow: "0 4px 14px rgba(0,0,0,0.3)" },
                    hover: { y: -5, boxShadow: "0 14px 36px rgba(0,0,0,0.45)" },
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="rounded-xl"
                >
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-linear-to-r from-primary to-primary-light text-white ring-1 ring-white/20 font-bold text-[0.98rem] no-underline"
                  >
                    <span>Get Free Website &amp; SEO Audit</span>
                    <motion.span
                      variants={{ rest: { x: 0 }, hover: { x: 5 } }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      aria-hidden="true"
                    >
                      <FaArrowRight className="text-xs" />
                    </motion.span>
                  </Link>
                </motion.div>
              </motion.div>

              <motion.a
                href="https://wa.me/27640584229?text=Hello%20Tishbite%20Digital,%20I%20want%20a%20free%20website%20and%20SEO%20audit."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-linear-to-r from-accent to-accent-light text-primary-dark border border-[rgba(196,146,28,0.35)] font-bold text-[0.98rem] no-underline"
                whileHover="hover"
                initial="rest"
                whileTap={{ scale: 0.97 }}
                variants={{
                  rest: { y: 0, boxShadow: "0 4px 14px rgba(244,201,93,0.2)" },
                  hover: { y: -5, boxShadow: "0 12px 30px rgba(244,201,93,0.5)" },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                <span>Chat With Us on WhatsApp</span>
                <motion.span
                  variants={{ rest: { scale: 1 }, hover: { scale: 1.2 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  aria-hidden="true"
                >
                  <FaWhatsapp className="text-sm" />
                </motion.span>
              </motion.a>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="mt-3 text-white/65 text-sm leading-relaxed max-w-140"
            >
              Serving small businesses, startups, and entrepreneurs across
              South Africa — from Cape Town to anywhere in the country, at
              any stage.
            </motion.p>
          </motion.div>

          {/* ── Desktop + mobile device pairing ── */}
          <motion.div
            className="lg:w-[56%] flex items-center justify-center order-1 lg:order-2 w-full"
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative w-full max-w-125 py-10 px-6"
              role="img"
              aria-label="A website displayed on both a desktop browser and a mobile phone, representing Tishbite Digital's responsive web design"
            >
              {/* Ambient glow */}
              <motion.div
                className="absolute inset-10 rounded-full bg-linear-to-br from-primary-light/30 to-accent/25 blur-3xl"
                animate={{ opacity: [0.5, 0.85, 0.5] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Browser window */}
              <motion.div
                className="relative mx-auto w-full max-w-110 rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden -rotate-2"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-1.5 px-4 py-3 bg-[#eef3f0] border-b border-black/5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f0a3a3]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-light" />
                  <div className="ml-3 flex-1 h-5 rounded-full bg-white border border-black/5" />
                </div>
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="h-20 sm:h-24 rounded-xl bg-linear-to-br from-primary-dark via-primary to-primary-light" />
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="h-12 sm:h-14 rounded-lg bg-[#eef3f0]" />
                    <div className="h-12 sm:h-14 rounded-lg bg-[#eef3f0]" />
                    <div className="h-12 sm:h-14 rounded-lg bg-accent/30" />
                  </div>
                  <div className="flex items-end gap-1.5 h-14 sm:h-16 pt-1">
                    {CHART_BARS.map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className="flex-1 rounded-t-sm bg-linear-to-t from-primary to-accent"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Phone, overlapping bottom-right */}
              <motion.div
                className="absolute bottom-2 right-2 sm:right-6 w-27 sm:w-32 rounded-[1.6rem] bg-[#173828] p-1.5 shadow-2xl ring-1 ring-black/10 rotate-6"
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              >
                <div className="rounded-[1.25rem] bg-white overflow-hidden">
                  <div className="h-4 flex items-center justify-center bg-[#eef3f0]">
                    <div className="w-8 h-1.5 rounded-full bg-black/15" />
                  </div>
                  <div className="p-2 space-y-1.5">
                    <div className="h-14 sm:h-16 rounded-lg bg-linear-to-br from-accent to-accent-light" />
                    <div className="h-1.5 rounded-full bg-[#eef3f0] w-4/5" />
                    <div className="h-1.5 rounded-full bg-[#eef3f0] w-3/5" />
                    <div className="h-5 sm:h-6 rounded-lg bg-primary" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
