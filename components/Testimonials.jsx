"use client";

import { motion } from "framer-motion";
import { FaStar, FaGoogle } from "react-icons/fa";

const REVIEWS = [
  {
    name: "Thandi M.",
    role: "HR Business Partner",
    company: "Maffy Online",
    service: "Lead-Generating Website",
    rating: 5,
    quote:
      "Our WhatsApp enquiries doubled within the first month of launching our new site. Tishbite Digital didn't just build a website — they built us a lead machine that works around the clock.",
    initials: "TM",
  },
  {
    name: "Mr. F. Nkosi",
    role: "Principal",
    company: "FOG Educare",
    service: "Local SEO & Google Visibility",
    rating: 5,
    quote:
      "Parents started finding us through Google within weeks. Enrolment enquiries increased noticeably and we now appear for the local searches that matter most to our community.",
    initials: "FN",
  },
  {
    name: "Leon V.",
    role: "Owner",
    company: "Cape Comfort Home Services",
    service: "Business Starter Pack",
    rating: 5,
    quote:
      "They made the whole process simple and clear. I didn't know where to start online, but within a short time I had a professional site and was getting weekly WhatsApp enquiries.",
    initials: "LV",
  },
];

const GOOGLE_REVIEW_URL = "https://g.page/r/CcbaVAYMBDDAEBM/review";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65 } },
};

function StarRating({ count }) {
  return (
    <div className="flex gap-1 mb-2" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <FaStar key={i} className="text-accent text-sm" aria-hidden="true" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      className="py-16 bg-gradient-to-b from-[#0f2016] to-[#1a3527]"
      role="region"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <p className="inline-flex items-center px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-extrabold uppercase tracking-wider mb-4">
            Client Results
          </p>
          <h2
            id="testimonials-heading"
            className="text-3xl lg:text-4xl font-extrabold text-white mb-3"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            What Cape Town businesses say about us
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-base">
            Real outcomes from real businesses. Here's what our clients achieved
            after working with Tishbite Digital.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {REVIEWS.map((review) => (
            <motion.article
              key={review.name}
              variants={fadeUp}
              className="flex flex-col bg-white/[0.06] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.09] transition-colors duration-300"
            >
              {/* Avatar + meta */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-bold text-sm flex-shrink-0"
                  aria-hidden="true"
                >
                  {review.initials}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm m-0">
                    {review.name}
                  </p>
                  <p className="text-white/50 text-xs m-0">
                    {review.role} &middot; {review.company}
                  </p>
                </div>
              </div>

              <StarRating count={review.rating} />

              <span className="inline-block mb-3 px-2.5 py-1 rounded-full bg-primary/30 text-primary-light text-xs font-semibold">
                {review.service}
              </span>

              <blockquote className="flex-1 text-white/70 text-sm leading-relaxed italic m-0 mb-4">
                &ldquo;{review.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-1.5 text-white/30 text-xs border-t border-white/10 pt-3">
                <FaGoogle aria-hidden="true" />
                <span>Google Review</span>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <div className="text-center mt-10">
          <p className="text-white/50 text-sm mb-4">
            Worked with us? We&rsquo;d love your feedback.
          </p>
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Leave us a Google review (opens in a new tab)"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm transition-all duration-200 no-underline"
          >
            <FaGoogle />
            Leave a Google Review
          </a>
        </div>
      </div>
    </section>
  );
}
