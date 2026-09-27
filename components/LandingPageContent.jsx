"use client";

import { motion } from "framer-motion";
import { FaCheckCircle, FaQuoteLeft, FaStar } from "react-icons/fa";
import LeadForm from "@/components/LeadForm";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// `quizSlot` lets /scorecard drop its quiz UI in above the form instead of
// jumping straight to it — everything else about the template stays shared.
export default function LandingPageContent({ offer, quizSlot = null }) {
  return (
    <>
      <section className="pt-3 pb-8 lg:pt-8 lg:pb-14 bg-linear-to-br from-[#f3f9f5] via-white to-[#e6f2eb]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 lg:items-center">
            {/* Copy column */}
            <motion.div
              className="lg:w-1/2 flex flex-col"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              <motion.p
                variants={fadeUp}
                className="inline-flex self-start items-center gap-2 px-2.5 py-1 rounded-full bg-accent/22 border border-accent/45 text-[#173828] text-[0.7rem] font-extrabold uppercase tracking-wider mb-2.5"
              >
                {offer.eyebrow}
              </motion.p>

              <motion.h1
                variants={fadeUp}
                className="text-[clamp(1.5rem,4.5vw,2.5rem)] font-extrabold leading-[1.15] tracking-tight text-primary-dark mb-2"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                {offer.headline}
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="hidden sm:block text-[0.98rem] text-[#2e4037] max-w-120 mb-3 leading-relaxed"
              >
                {offer.subheadline}
              </motion.p>

              <motion.div variants={stagger} className="flex flex-wrap gap-1.5 mb-4 lg:mb-0">
                {offer.bullets.map((bullet) => (
                  <motion.span
                    key={bullet}
                    variants={fadeUp}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/80 border border-primary-dark/10 shadow-sm text-[#173828] text-xs font-semibold"
                  >
                    <FaCheckCircle className="text-primary shrink-0" size={11} aria-hidden="true" />
                    {bullet}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>

            {/* Form column */}
            <motion.div
              className="lg:w-1/2 w-full"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {quizSlot || <LeadForm offer={offer} />}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Proof — below the fold, real existing client testimonial */}
      <section className="py-12 lg:py-16 bg-white border-t border-primary/8">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="flex justify-center gap-1 mb-4" aria-label="5 out of 5 stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar key={i} className="text-accent text-sm" aria-hidden="true" />
            ))}
          </div>
          <FaQuoteLeft className="text-primary/20 text-3xl mx-auto mb-3" aria-hidden="true" />
          <blockquote className="text-lg lg:text-xl text-primary-dark font-medium leading-relaxed mb-4 m-0">
            &ldquo;{offer.proof.quote}&rdquo;
          </blockquote>
          <p className="text-text-muted text-sm font-semibold m-0">
            {offer.proof.name} <span className="font-normal">— {offer.proof.role}</span>
          </p>
        </div>
      </section>
    </>
  );
}
