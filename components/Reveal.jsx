"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Named motion tokens for the Section/Card design system — one duration,
// one easing, one translate distance, used identically by every card so
// the rhythm reads as deliberate rather than per-component guesswork.
// Pattern-break motion (CTA pulse/gradient-shift) is defined separately
// in globals.css (.cta-break) and is the only thing allowed to deviate.
export const MOTION = {
  duration: 0.5,
  ease: "power2.out",
  distance: 28,
  stagger: 0.08,
};

// Entrance patterns:
//   "up"     — fade + slide up, MOTION tokens exactly as specified.
//              The default for the Section/Card system — every card
//              uses this same reveal so the motion is predictable.
//   "slide"  — directional, alternates left/right by index. Pre-dates
//              the Card system; kept for components not yet migrated.
//   "bounce" — scale + overshoot. Same — kept for backward compat.
export default function Reveal({
  children,
  variant = "up",
  index = 0,
  className = "",
  as: Tag = "div",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const from =
        variant === "bounce"
          ? { opacity: 0, y: 36, scale: 0.86 }
          : variant === "slide"
            ? { opacity: 0, x: index % 2 === 0 ? 44 : -44 }
            : { opacity: 0, y: MOTION.distance };

      const to =
        variant === "bounce"
          ? { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.8)" }
          : variant === "slide"
            ? { opacity: 1, x: 0, duration: 0.65, ease: "power3.out" }
            : { opacity: 1, y: 0, duration: MOTION.duration, ease: MOTION.ease };

      gsap.set(el, from);
      gsap.to(el, {
        ...to,
        delay: (index % 4) * MOTION.stagger,
        scrollTrigger: { trigger: el, start: "top 90%" },
      });
    });

    return () => mm.revert();
  }, [variant, index]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
