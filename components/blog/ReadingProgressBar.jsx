"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

const MILESTONES = [25, 50, 75, 100];

export default function ReadingProgressBar({ targetId }) {
  const barRef = useRef(null);
  const firedRef = useRef(new Set());

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return undefined;

    const handleScroll = () => {
      const rect = target.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const pct = Math.round(scrolled * 100);
      if (barRef.current) barRef.current.style.width = `${pct}%`;

      for (const milestone of MILESTONES) {
        if (pct >= milestone && !firedRef.current.has(milestone)) {
          firedRef.current.add(milestone);
          trackEvent("scroll_depth", { percent: milestone });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [targetId]);

  return <div ref={barRef} className="reading-progress-bar no-print" aria-hidden="true" />;
}
