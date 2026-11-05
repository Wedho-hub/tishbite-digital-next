"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRight, FaListUl } from "react-icons/fa";
import { trackEvent } from "@/lib/analytics";

function CtaCard() {
  return (
    <div className="rounded-xl bg-linear-to-br from-primary-dark to-primary p-5 text-center">
      <p className="text-white font-bold text-sm m-0 mb-3">Not getting found online?</p>
      <p className="text-white/80 text-xs m-0 mb-4">
        Get a free, no-pressure audit of your website and Google presence.
      </p>
      <Link
        href="/contact"
        onClick={() => trackEvent("cta_click", { placement: "sidebar" })}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-primary-dark font-bold text-xs no-underline hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
      >
        Get a Free Audit <FaArrowRight size={10} aria-hidden="true" />
      </Link>
    </div>
  );
}

export default function ArticleSidebar({ headings }) {
  const [activeId, setActiveId] = useState(headings[0]?.id || "");

  useEffect(() => {
    if (!headings.length) return undefined;
    const elements = headings.map((h) => document.getElementById(h.id)).filter(Boolean);
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) {
    return (
      <div className="article-sidebar hidden lg:block sticky top-24">
        <CtaCard />
      </div>
    );
  }

  const tocList = (
    <nav className="article-toc" aria-label="Table of contents">
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={h.depth === 3 ? "toc-h3" : ""}
          data-active={h.id === activeId ? "true" : "false"}
          onClick={() => trackEvent("toc_click", { heading_id: h.id })}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );

  return (
    <div className="article-sidebar">
      <details className="lg:hidden mb-6 rounded-xl border border-primary/15 bg-surface-tint open:pb-2">
        <summary className="flex items-center gap-2 px-4 py-3 font-bold text-primary-dark text-sm cursor-pointer list-none">
          <FaListUl aria-hidden="true" /> In this article
        </summary>
        <div className="px-4">{tocList}</div>
      </details>

      <div className="hidden lg:block sticky top-24 space-y-6">
        <div className="rounded-xl border border-primary/15 bg-surface-tint p-4">
          <p className="flex items-center gap-2 font-bold text-primary-dark text-sm m-0 mb-2">
            <FaListUl aria-hidden="true" /> In this article
          </p>
          {tocList}
        </div>
        <CtaCard />
      </div>
    </div>
  );
}
