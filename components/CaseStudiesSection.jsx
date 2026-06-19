"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaSearch,
  FaLightbulb,
  FaChartLine,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
} from "react-icons/fa";

const FALLBACK_CASE_STUDIES = [
  {
    _id: "fallback-home-services",
    title: "Cape Comfort Home Services",
    industry: "Home Services",
    challenge:
      "A well-established local business was invisible online — no website, inconsistent Google presence, and enquiries relying entirely on word of mouth.",
    solution:
      "Identified the gap between their strong reputation and weak digital footprint. Built a lead-focused website with a Google Business Profile optimisation pass and a WhatsApp-first enquiry flow matched to how their customers actually communicate.",
    result:
      "The business gained a consistent, predictable stream of weekly enquiries within the first month — replacing word-of-mouth as their primary growth channel with a system that runs without their daily input.",
    metrics: ["Weekly inbound enquiries", "1st page local visibility", "WhatsApp-first conversion flow"],
    image: "/assets/tishbiteHero.png",
    link: "",
  },
  {
    _id: "fallback-education",
    title: "FOG Educare",
    industry: "Early Childhood Education",
    challenge:
      "Parents researching childcare options couldn't find the centre online, and enrolment enquiries depended entirely on referrals from existing families.",
    solution:
      "Recognised that trust and local discoverability were the two missing pieces. Delivered a parent-friendly website with clear programme information alongside local SEO work targeting nearby family searches.",
    result:
      "Enrolment enquiries became noticeably more consistent, with new families reporting they found the centre directly through Google rather than referral alone.",
    metrics: ["New organic enquiry channel", "Stronger first impression for parents", "Local search visibility"],
    image: "/assets/fogPic.png",
    link: "",
  },
  {
    _id: "fallback-operations",
    title: "Tool Tracking System",
    industry: "Operations & Field Services",
    challenge:
      "A team was repeatedly losing track of tools and equipment across job sites, creating replacement costs and accountability gaps with no system to trace what went where.",
    solution:
      "Diagnosed the root cause as a lack of structured record-keeping, not a staffing problem. Built a full-stack tracking system giving the team a single source of truth for tool assignment and movement.",
    result:
      "Tool losses dropped and accountability became traceable to a person and a date — turning a recurring cost centre into a managed, visible process.",
    metrics: ["Fewer tool losses", "Clear accountability trail", "Faster operational decisions"],
    image: "/assets/toolTrackPic.png",
    link: "",
  },
];

const AUTOPLAY_MS = 6000;

function MetricChip({ label }) {
  return (
    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-[#173828] text-xs font-bold">
      {label}
    </span>
  );
}

function StoryBlock({ icon: Icon, label, text }) {
  return (
    <div className="flex gap-3">
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="text-primary" size={14} aria-hidden="true" />
      </div>
      <div>
        <p className="text-primary-dark font-bold text-sm mb-1">{label}</p>
        <p className="text-text-muted text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

export default function CaseStudiesSection() {
  const [caseStudies, setCaseStudies] = useState(FALLBACK_CASE_STUDIES);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/case-studies");
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        if (mounted && list.length > 0) setCaseStudies(list);
      } catch {
        /* fallback stays */
      }
    })();
    return () => { mounted = false; };
  }, []);

  const goTo = useCallback((nextIndex, dir) => {
    setDirection(dir);
    setIndex((prev) => {
      const len = caseStudies.length;
      return (nextIndex + len) % len;
    });
  }, [caseStudies.length]);

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  useEffect(() => {
    if (paused || caseStudies.length <= 1) return;
    timerRef.current = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(timerRef.current);
  }, [index, paused, caseStudies.length, next]);

  if (caseStudies.length === 0) return null;
  const current = caseStudies[index];

  const slideVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <section
      className="py-16 bg-white border-t border-primary/8"
      aria-labelledby="case-studies-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-10 flex flex-col items-center">
          <p className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-wider mb-4">
            Case Studies
          </p>
          <h2
            id="case-studies-heading"
            className="text-3xl lg:text-4xl font-extrabold text-primary-dark mb-3"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Identifying Problems, Delivering Value
          </h2>
          <p className="text-text-muted text-base max-w-xl">
            A closer look at how specific business problems were diagnosed and solved — not just what was built, but why it mattered.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-primary/10 shadow-sm bg-bg">
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              <motion.div
                key={current._id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 lg:grid-cols-2"
              >
                <div className="relative h-64 lg:h-auto min-h-[280px]">
                  <Image
                    src={current.image || "/assets/tishbiteHero.png"}
                    alt={current.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-primary-dark/60 via-transparent to-transparent lg:bg-linear-to-r" />
                  <div className="absolute bottom-4 left-4 lg:bottom-6 lg:left-6">
                    {current.industry && (
                      <span className="inline-block px-3 py-1 rounded-full bg-white/90 text-primary-dark text-xs font-bold mb-2">
                        {current.industry}
                      </span>
                    )}
                    <h3
                      className="text-white text-xl lg:text-2xl font-extrabold leading-tight"
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                      {current.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 lg:p-9 flex flex-col gap-5">
                  <StoryBlock icon={FaSearch} label="The Challenge" text={current.challenge} />
                  <StoryBlock icon={FaLightbulb} label="The Solution" text={current.solution} />
                  <StoryBlock icon={FaChartLine} label="The Result" text={current.result} />

                  {Array.isArray(current.metrics) && current.metrics.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {current.metrics.map((m) => (
                        <MetricChip key={m} label={m} />
                      ))}
                    </div>
                  )}

                  {current.link && (
                    <a
                      href={current.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:text-primary-dark transition-colors no-underline mt-1"
                    >
                      View live result <FaArrowRight size={11} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {caseStudies.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous case study"
                className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-primary/15 shadow-md items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-200"
              >
                <FaChevronLeft size={13} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next case study"
                className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-primary/15 shadow-md items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-200"
              >
                <FaChevronRight size={13} />
              </button>
            </>
          )}
        </div>

        {caseStudies.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6" role="tablist" aria-label="Case study navigation">
            {caseStudies.map((cs, i) => (
              <button
                key={cs._id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show case study: ${cs.title}`}
                onClick={() => goTo(i, i > index ? 1 : -1)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-primary" : "w-2.5 bg-primary/20 hover:bg-primary/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
