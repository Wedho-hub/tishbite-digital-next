"use client";

import Link from "next/link";
import {
  FaArrowRight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaKey,
  FaLightbulb,
} from "react-icons/fa";
import LiteYouTube from "@/components/blog/LiteYouTube";
import { trackEvent } from "@/lib/analytics";

// Render components for the custom remark-directive blocks authors can
// type straight into Markdown (":::pullquote", "::youtube{id=...}" etc
// — parsed by remarkDirectiveToHast in lib/blog.js into plain elements
// named after the directive, which react-markdown's `components` prop
// maps to these).
//
// Named exports only, each used directly as a value in react-markdown's
// `components` map (built in app/blog/[slug]/page.js, a Server
// Component). A plain object aggregating them here and spread at the
// call site does NOT work: this module is "use client", and Next only
// proxies individual named component exports across the server/client
// boundary — a plain object export carrying those functions as values
// does not survive that boundary the same way, so the server component
// must import each one by name and build the map itself.
export function Pullquote({ children, cite }) {
  return (
    <blockquote className="not-prose my-10 border-y-2 border-accent/40 py-6 text-center [&>p]:font-editorial [&>p]:text-2xl [&>p]:lg:text-3xl [&>p]:italic [&>p]:text-primary-dark [&>p]:leading-snug [&>p]:m-0">
      {children}
      {cite && <cite className="block mt-3 text-sm text-text-muted not-italic">— {cite}</cite>}
    </blockquote>
  );
}

const CALLOUT_STYLES = {
  tip: { icon: FaLightbulb, border: "border-accent", bg: "bg-accent/10", iconColor: "text-accent-dark" },
  warning: { icon: FaExclamationTriangle, border: "border-red-400", bg: "bg-red-50", iconColor: "text-red-500" },
  note: { icon: FaInfoCircle, border: "border-primary/40", bg: "bg-primary/5", iconColor: "text-primary" },
  success: { icon: FaCheckCircle, border: "border-primary-light", bg: "bg-primary/10", iconColor: "text-primary" },
};

export function Callout({ type, title, children }) {
  const style = CALLOUT_STYLES[type] || CALLOUT_STYLES.note;
  const Icon = style.icon;
  const defaultTitle = type ? type.charAt(0).toUpperCase() + type.slice(1) : "Note";
  return (
    <aside className={`not-prose my-8 rounded-xl border-l-4 ${style.border} ${style.bg} p-5`}>
      <p className="flex items-center gap-2 font-bold text-text-dark m-0 mb-2">
        <Icon className={style.iconColor} aria-hidden="true" />
        {title || defaultTitle}
      </p>
      <div className="text-sm text-text-dark/90 [&>p]:m-0 [&>p+p]:mt-2">{children}</div>
    </aside>
  );
}

export function Keypoints({ title, children }) {
  return (
    <div className="not-prose my-8 rounded-2xl bg-surface-tint border border-primary/15 p-6">
      <p className="flex items-center gap-2 font-bold text-primary-dark text-sm uppercase tracking-wide m-0 mb-3">
        <FaKey aria-hidden="true" /> {title || "Key takeaways"}
      </p>
      <div className="[&_ul]:m-0 [&_ul]:space-y-2 [&_ul]:list-none [&_li]:flex [&_li]:gap-2 [&_li]:items-start [&_li]:before:content-['✓'] [&_li]:before:font-bold [&_li]:before:text-primary">
        {children}
      </div>
    </div>
  );
}

export function Cta({ title, button, href = "/contact" }) {
  const isWhatsapp = href.includes("wa.me");
  const handleClick = () => {
    trackEvent("cta_click", { placement: "inline", href });
    if (isWhatsapp) trackEvent("whatsapp_click", { placement: "inline-cta" });
  };
  return (
    <div className="not-prose my-10 rounded-2xl bg-linear-to-br from-primary-dark to-primary p-6 lg:p-8 text-center">
      {title && <p className="text-white font-bold text-lg lg:text-xl m-0 mb-4">{title}</p>}
      <Link
        href={href}
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-primary-dark font-bold text-sm no-underline hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
      >
        {button || "Get a Free Audit"} <FaArrowRight size={12} aria-hidden="true" />
      </Link>
    </div>
  );
}

export function DirectiveYoutube({ id, title }) {
  if (!id) return null;
  return (
    <div className="not-prose my-8">
      <LiteYouTube id={id} title={title || "Video"} />
    </div>
  );
}
