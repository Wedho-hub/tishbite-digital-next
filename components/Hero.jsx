"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import { motion } from "framer-motion";
import { FaArrowRight, FaCheckCircle, FaWhatsapp } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

export default function Hero() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !bgRef.current) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(bgRef.current, { scale: 1.15 });
      gsap.to(bgRef.current, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${spaceGrotesk.variable} relative overflow-hidden isolate bg-[#102015] pt-1 pb-14`}
      aria-label="Tishbite Digital helping South African businesses get more clients online"
    >
      {/* Background photo — lightly scrimmed only enough to keep text readable, with a subtle scroll parallax */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          ref={bgRef}
          src="/assets/hero-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover"
          style={{ objectPosition: "center 32%", filter: "saturate(0.9) brightness(1)" }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#0d2318]/85 via-[#153726]/55 to-primary-dark/15" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0a1b12]/55 via-transparent to-[#0a1b12]/15" />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col items-start min-h-[clamp(460px,58vh,660px)] py-10 justify-center">

          {/* ── Text content ── */}
          <motion.div
            className="max-w-2xl w-full"
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

        </div>
      </div>
    </section>
  );
}
