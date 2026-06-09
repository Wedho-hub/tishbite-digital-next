"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowRight, FaCheckCircle, FaWhatsapp } from "react-icons/fa";

const containerVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const PROOF_ITEMS = [
  "More qualified leads",
  "Better Google visibility",
  "Faster WhatsApp follow-up",
];

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-[#f3f9f5] via-white to-[#e6f2eb] pt-1 pb-12"
      aria-label="Tishbite Digital helping Cape Town businesses get more clients online"
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[15%] left-[10%] w-72 h-72 rounded-full bg-accent/14 blur-3xl" />
        <div className="absolute bottom-[15%] right-[10%] w-72 h-72 rounded-full bg-primary/14 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 min-h-[clamp(440px,60vh,680px)]">

          {/* ── Text content ── */}
          <motion.div
            className="lg:w-1/2 flex flex-col justify-center order-2 lg:order-1 w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={itemVariants}
              className="inline-flex self-start items-center px-3 py-1.5 rounded-full bg-accent/22 border border-accent/45 text-[#173828] text-[0.78rem] font-extrabold uppercase tracking-wider mb-4"
            >
              Cape Town Web Design, SEO, Ads and WhatsApp Lead Generation
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
              className="text-[1.05rem] text-[#2e4037] max-w-[540px] mb-4 leading-relaxed"
            >
              Websites. SEO. Ads. Built to generate leads, calls, bookings, and
              WhatsApp enquiries — not just look good. We help Cape Town service
              businesses build high-converting websites, improve Google
              visibility, and turn digital traffic into real client
              opportunities.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-2 mb-5"
              aria-label="Business growth benefits"
            >
              {PROOF_ITEMS.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 border border-primary-dark/10 shadow-sm text-[#173828] text-sm font-semibold"
                >
                  <FaCheckCircle className="text-primary" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-between gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-primary-dark via-primary to-primary-light text-[#f9f7ef] font-bold text-[0.98rem] shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 no-underline"
              >
                <span>Get Free Website &amp; SEO Audit</span>
                <FaArrowRight className="text-xs" aria-hidden="true" />
              </Link>
              <a
                href="https://wa.me/27791684548?text=Hello%20Tishbite%20Digital,%20I%20want%20a%20free%20website%20and%20SEO%20audit."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-accent to-accent-light text-primary-dark border border-[rgba(196,146,28,0.35)] font-bold text-[0.98rem] shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 no-underline"
              >
                <span>Chat With Us on WhatsApp</span>
                <FaWhatsapp className="text-sm" aria-hidden="true" />
              </a>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="mt-3 text-[#486154] text-sm leading-relaxed max-w-[560px]"
            >
              Serving Cape Town, the Western Cape, and South African businesses
              that want growth systems, not brochure websites.
            </motion.p>
          </motion.div>

          {/* ── Image ── */}
          <motion.div
            className="lg:w-1/2 flex items-center justify-center order-1 lg:order-2 w-full"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.02, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/assets/tishbiteHero.png"
              alt="Cape Town digital professional surrounded by analytics dashboards, social media growth metrics and website results — Tishbite Digital"
              width={700}
              height={500}
              priority
              className="w-full rounded-2xl shadow-2xl object-cover hover:-translate-y-1 hover:shadow-[0_30px_50px_rgba(27,67,50,0.16)] transition-all duration-400"
              style={{ minHeight: "clamp(280px,45vh,520px)", maxHeight: "520px", objectFit: "cover" }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
