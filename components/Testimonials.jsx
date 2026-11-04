"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaStar, FaGoogle, FaCheckCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSwipeCarousel } from "@/hooks/useSwipeCarousel";
import Section, { SectionHeading } from "@/components/Section";

// Real reviews from Tishbite Digital's Google Business Profile.
const FALLBACK_REVIEWS = [
  {
    _id: "google-sam",
    name: "Anthon Sam",
    rating: 5,
    quote:
      "Tishbite Digital did an amazing job with my website. As a small business owner, I really appreciated their professionalism and support. Highly recommend!",
    source: "Google Review",
  },
  {
    _id: "google-gambinga",
    name: "Mavis Gambinga",
    rating: 5,
    quote: "We hired Tishbite to build our company website from scratch.",
    source: "Google Review",
  },
  {
    _id: "google-muchati",
    name: "Philemon Muchati",
    rating: 5,
    quote: "We have been with Tishbite Digital so well, very reliable and highly recommended.",
    source: "Google Review",
  },
  {
    _id: "google-chishiri",
    name: "Tendai Chishiri",
    rating: 5,
    quote: "Tishbite Digital delivered beyond expectations.",
    source: "Google Review",
  },
  {
    _id: "google-mutiramanja",
    name: "Benson Mutiramanja",
    rating: 5,
    quote: "Thank you for doing best bro.",
    source: "Google Review",
  },
];

const GOOGLE_REVIEW_URL = "https://g.page/r/CcbaVAYMBDDAEBM/review";

// Same 3-step accent rotation Card.jsx uses, applied here by hand since
// these cards live inside a GSAP-Draggable track rather than a Reveal grid.
const ACCENT_BORDER = ["border-t-primary", "border-t-primary-light", "border-t-accent"];

function StarRating({ count }) {
  return (
    <div className="flex gap-1 mb-2" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <FaStar key={i} className="text-accent text-sm" aria-hidden="true" />
      ))}
    </div>
  );
}

function getInitials(name = "") {
  return name.slice(0, 2).toUpperCase();
}

export default function Testimonials() {
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS);
  const { containerRef, trackRef, activeIndex, goTo, next, prev, canPrev, canNext } =
    useSwipeCarousel(reviews.length);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/testimonials");
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        if (mounted && list.length > 0) setReviews(list);
      } catch {
        /* fallback stays */
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <Section surface="tint" dividerNext="dark">
      <SectionHeading kicker="Client Results" center>
        What South African businesses say about us
      </SectionHeading>
      <p className="text-text-muted max-w-xl mx-auto text-base text-center -mt-6 mb-10">
        Real outcomes from real businesses. Here&apos;s what our clients achieved
        after working with Tishbite Digital.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "power2.out" }}
      >
        <div ref={containerRef} className="overflow-hidden -mx-4 px-4">
          <div
            ref={trackRef}
            className="flex w-max gap-5 cursor-grab active:cursor-grabbing select-none"
            style={{ touchAction: "pan-y" }}
          >
            {reviews.map((review, i) => (
              <article
                key={review._id || review.name}
                className={`flex flex-col w-[85vw] sm:w-90 shrink-0 bg-white border-t-4 ${ACCENT_BORDER[i % ACCENT_BORDER.length]} border border-primary/8 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300`}
              >
                {/* Avatar + meta */}
                <div className="flex items-center gap-3 mb-4">
                  {review.image ? (
                    <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 relative">
                      <Image
                        src={review.image}
                        alt={review.name}
                        fill
                        className="object-cover"
                        sizes="44px"
                        draggable={false}
                      />
                    </div>
                  ) : (
                    <div
                      className="w-11 h-11 rounded-full bg-accent/25 border border-accent/40 flex items-center justify-center text-[#8a6500] font-bold text-sm shrink-0"
                      aria-hidden="true"
                    >
                      {getInitials(review.name)}
                    </div>
                  )}
                  <div>
                    <p className="text-text-dark font-semibold text-sm m-0">
                      {review.name}
                    </p>
                    {(review.role || review.company) && (
                      <p className="text-text-muted text-xs m-0">
                        {[review.role, review.company].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                </div>

                <StarRating count={review.rating || 5} />

                <blockquote className="flex-1 text-text-muted text-sm leading-relaxed italic m-0 mb-4">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-1.5 text-text-muted/70 text-xs border-t border-primary/8 pt-3">
                  {review.source === "Google Review" ? (
                    <FaGoogle aria-hidden="true" />
                  ) : (
                    <FaCheckCircle aria-hidden="true" />
                  )}
                  <span>{review.source || "Client Feedback"}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {reviews.length > 1 && (
          <div className="flex items-center justify-center gap-5 mt-8">
            <button
              type="button"
              onClick={prev}
              disabled={!canPrev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/8 border border-primary/15 text-primary-dark hover:bg-primary/15 disabled:opacity-30 disabled:hover:bg-primary/8 transition-colors duration-200"
            >
              <FaChevronLeft size={13} />
            </button>

            <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial slides">
              {reviews.map((review, i) => (
                <button
                  key={review._id || review.name}
                  type="button"
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-label={`Show testimonial ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex ? "w-6 bg-primary" : "w-2 bg-primary/20 hover:bg-primary/40"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              disabled={!canNext}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/8 border border-primary/15 text-primary-dark hover:bg-primary/15 disabled:opacity-30 disabled:hover:bg-primary/8 transition-colors duration-200"
            >
              <FaChevronRight size={13} />
            </button>
          </div>
        )}
      </motion.div>

      <div className="text-center mt-10">
        <p className="text-text-muted text-sm mb-4">
          Worked with us? We&rsquo;d love your feedback.
        </p>
        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Leave us a Google review (opens in a new tab)"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-primary/5 border border-primary/15 text-primary-dark font-semibold text-sm transition-all duration-200 no-underline shadow-sm"
        >
          <FaGoogle />
          Leave a Google Review
        </a>
      </div>
    </Section>
  );
}
