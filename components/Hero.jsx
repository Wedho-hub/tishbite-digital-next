"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowRight, FaCheckCircle, FaWhatsapp } from "react-icons/fa";

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

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-linear-to-br from-[#f3f9f5] via-white to-[#e6f2eb] pt-1 pb-14"
      aria-label="Tishbite Digital helping Cape Town businesses get more clients online"
    >
      {/* Animated background glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute top-[15%] left-[10%] w-80 h-80 rounded-full bg-accent/14 blur-3xl"
          animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[15%] right-[10%] w-80 h-80 rounded-full bg-primary/14 blur-3xl"
          animate={{ x: [0, -24, 0], y: [0, 18, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-[45%] left-[45%] w-64 h-64 rounded-full bg-primary/8 blur-3xl"
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
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
              className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full bg-accent/22 border border-accent/45 text-[#173828] text-[0.78rem] font-extrabold uppercase tracking-wider mb-4"
            >
              <motion.span
                className="w-2 h-2 rounded-full bg-accent shrink-0"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              Web Design, SEO, Ads and WhatsApp Lead Generation
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="text-[clamp(2.1rem,4vw,3.2rem)] font-extrabold leading-[1.18] tracking-tight text-primary-dark mb-4"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              We Help Cape Town Businesses Get More Clients Online
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-[1.05rem] text-[#2e4037] max-w-135 mb-5 leading-relaxed"
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
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 border border-primary-dark/10 shadow-sm text-[#173828] text-sm font-semibold"
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
                    rest: { y: 0, boxShadow: "0 4px 14px rgba(27,67,50,0.2)" },
                    hover: { y: -5, boxShadow: "0 14px 36px rgba(27,67,50,0.45)" },
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="rounded-xl"
                >
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-linear-to-r from-primary-dark via-primary to-primary-light text-[#f9f7ef] font-bold text-[0.98rem] no-underline"
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
                href="https://wa.me/27791684548?text=Hello%20Tishbite%20Digital,%20I%20want%20a%20free%20website%20and%20SEO%20audit."
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
              className="mt-3 text-[#486154] text-sm leading-relaxed max-w-140"
            >
              Serving small businesses, startups, and entrepreneurs across Cape
              Town, the Western Cape, and South Africa — at any stage.
            </motion.p>
          </motion.div>

          {/* ── Image ── */}
          <motion.div
            className="lg:w-[56%] flex items-center justify-center order-1 lg:order-2 w-full"
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative w-full">
              {/* Animated glow behind image */}
              <motion.div
                className="absolute -inset-3 rounded-3xl bg-linear-to-br from-primary/25 to-accent/25 blur-2xl"
                animate={{ opacity: [0.45, 0.8, 0.45] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Floating image */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <Image
                  src="/assets/tishbiteHero.png"
                  alt="Cape Town digital professional surrounded by analytics dashboards, social media growth metrics and website results — Tishbite Digital"
                  width={860}
                  height={640}
                  priority
                  className="w-full rounded-2xl shadow-2xl object-cover hover:shadow-[0_36px_60px_rgba(27,67,50,0.2)] transition-shadow duration-500"
                  style={{
                    minHeight: "clamp(340px,52vh,620px)",
                    maxHeight: "640px",
                    objectFit: "cover",
                  }}
                />
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
