"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Two deliberate entrance patterns used site-wide, so motion reads as a
// consistent design language rather than random per-component choices:
//   "slide"  — directional, alternates left/right by index. Used for
//              informational/feature cards (calmer, reads left-to-right).
//   "bounce" — scale + overshoot. Used for product/pricing/stat cards,
//              where we want a little more "pop" to grab attention.
export default function Reveal({
  children,
  variant = "slide",
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
          : { opacity: 0, x: index % 2 === 0 ? 44 : -44 };

      const to =
        variant === "bounce"
          ? { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.8)" }
          : { opacity: 1, x: 0, duration: 0.65, ease: "power3.out" };

      gsap.set(el, from);
      gsap.to(el, {
        ...to,
        delay: (index % 4) * 0.09,
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
