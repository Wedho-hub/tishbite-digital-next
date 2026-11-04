"use client";

import { createContext, useContext } from "react";

// ── Surface tokens ──────────────────────────────────────────────────────
// Four section surfaces, each resolving its own background, body text,
// heading color, and "kicker" pill style. Section and Card both read from
// this table via SurfaceContext, so a card dropped into any surface picks
// up correct contrast automatically instead of each page hand-wiring it.
export const SURFACES = {
  dark: {
    section: "bg-surface-dark text-white/75",
    heading: "text-white",
    kicker: "bg-white/10 border border-white/15 text-accent",
    cardSurface: "bg-white/6 border border-white/10 text-white",
    cardMuted: "text-white/60",
  },
  light: {
    section: "bg-surface-light text-text-muted",
    heading: "text-primary-dark",
    kicker: "bg-primary/10 border border-primary/20 text-primary",
    cardSurface: "bg-white border border-primary/8 text-text-dark",
    cardMuted: "text-text-muted",
  },
  tint: {
    section: "bg-surface-tint text-text-muted",
    heading: "text-primary-dark",
    kicker: "bg-white/70 border border-primary/15 text-primary",
    cardSurface: "bg-white border border-primary/8 text-text-dark",
    cardMuted: "text-text-muted",
  },
  break: {
    section: "bg-surface-break text-primary-dark/80",
    heading: "text-primary-dark",
    kicker: "bg-primary-dark/10 border border-primary-dark/15 text-primary-dark",
    cardSurface: "bg-white/85 border border-primary-dark/10 text-text-dark",
    cardMuted: "text-primary-dark/65",
  },
};

const SurfaceContext = createContext("light");
export const useSurface = () => SURFACES[useContext(SurfaceContext)] ?? SURFACES.light;
export const useSurfaceName = () => useContext(SurfaceContext);

// Subtle low-opacity texture — dot grid on light/tint (visible as dark
// dots), reversed to light dots on dark. Decorative only (aria-hidden),
// never affects layout (absolutely positioned, pointer-events: none).
function Texture({ surface }) {
  const dot = surface === "dark" ? "rgba(255,255,255,0.08)" : "rgba(27,67,50,0.06)";
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(circle, ${dot} 1.5px, transparent 1.5px)`,
        backgroundSize: "24px 24px",
      }}
    />
  );
}

// Angled divider — painted INSIDE the section's own box (never positioned
// outside it, so it can't be clipped by the section's own overflow-hidden)
// using the color of the ADJACENT section. A "bottom" divider sits in this
// section's last ~48px filled with the color of whatever comes NEXT,
// which is what actually creates the illusion of an angled seam between
// the two bands — painting a shape in your own color against your own
// background would simply be invisible. Pass the neighboring surface
// explicitly (dividerNext / dividerPrev) since a section has no way to
// know its siblings on its own.
function Divider({ fillSurface, position }) {
  const fill = `var(--color-surface-${fillSurface === "light" ? "light" : fillSurface})`;
  const isTop = position === "top";
  return (
    <svg
      aria-hidden="true"
      className={`absolute left-0 w-full h-8 sm:h-12 ${isTop ? "top-0" : "bottom-0"}`}
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
    >
      <path d={isTop ? "M0,0 L1440,48 L0,48 Z" : "M0,48 L1440,0 L1440,48 Z"} fill={fill} />
    </svg>
  );
}

/**
 * Section — the page-rhythm building block. One surface per section,
 * never the same surface twice in a row (enforced by how pages compose
 * Sections, not by this component). Provides SurfaceContext so Card and
 * SectionHeading inherit the right colors automatically.
 *
 * Props:
 *  - surface: "dark" | "light" | "tint" | "break" (default "light")
 *  - as: element/tag to render (default "section")
 *  - dividerPrev: surface name of the section immediately BEFORE this one
 *                 — paints an angled cut across this section's own top
 *                 ~48px in that surface's color, so the seam above reads
 *                 as a diagonal instead of a flat line. Omit for none.
 *  - dividerNext: same idea, for the section immediately AFTER this one,
 *                 painted across this section's own bottom ~48px.
 *  - texture: boolean — dot-grid overlay, intended for dark/tint surfaces
 */
export default function Section({
  surface = "light",
  as: Tag = "section",
  dividerPrev,
  dividerNext,
  texture = false,
  className = "",
  children,
  ...rest
}) {
  const tone = SURFACES[surface] ?? SURFACES.light;
  const showTexture = texture && (surface === "dark" || surface === "tint");

  return (
    <SurfaceContext.Provider value={surface}>
      <Tag
        className={`relative isolate overflow-hidden py-16 ${tone.section} ${className}`}
        data-surface={surface}
        {...rest}
      >
        {showTexture && <Texture surface={surface} />}
        {dividerPrev && <Divider fillSurface={dividerPrev} position="top" />}
        <div className="relative z-10 container mx-auto px-4 max-w-7xl">{children}</div>
        {dividerNext && <Divider fillSurface={dividerNext} position="bottom" />}
      </Tag>
    </SurfaceContext.Provider>
  );
}

/**
 * SectionHeading — reads the ambient surface, so the same markup produces
 * a white heading on a dark section and a primary-dark heading on light/
 * tint/break, with no per-page color props.
 */
export function SectionHeading({ id, kicker, center = false, children, className = "" }) {
  const tone = useSurface();
  return (
    <div className={`flex flex-col mb-10 ${center ? "items-center text-center" : ""}`}>
      {kicker && (
        <p className={`inline-flex self-start items-center px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-3 ${tone.kicker} ${center ? "self-center" : ""}`}>
          {kicker}
        </p>
      )}
      <h2
        id={id}
        className={`text-3xl lg:text-4xl font-extrabold leading-tight ${tone.heading} ${className}`}
        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
      >
        {children}
      </h2>
    </div>
  );
}
