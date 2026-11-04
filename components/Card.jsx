"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { useSurface } from "@/components/Section";

// ── Accent rotation ──────────────────────────────────────────────────────
// Three brand accents, fixed order, cycling by card index — the pattern a
// grid reads is predictable (1-2-3-1-2-3...), never random. Deliberately
// stays inside the existing 2-hue brand (green + gold) rather than
// introducing a third, unestablished color; primary/primary-light give
// two distinct green steps so the rotation doesn't just alternate.
const ACCENT_ROTATION = ["primary", "primary-light", "accent"];

const ACCENTS = {
  primary: {
    border: "border-t-primary",
    iconBg: "bg-primary",
    iconText: "text-white",
    glow: "rgba(45,106,79,0.32)",
  },
  "primary-light": {
    border: "border-t-primary-light",
    iconBg: "bg-primary-light",
    iconText: "text-white",
    glow: "rgba(64,145,108,0.32)",
  },
  accent: {
    border: "border-t-accent",
    iconBg: "bg-accent",
    iconText: "text-primary-dark",
    glow: "rgba(244,201,93,0.4)",
  },
};

// ── Variants ──────────────────────────────────────────────────────────────
// Padding/layout differences only — color comes from the ambient surface
// (via useSurface) and the accent rotation, never hardcoded per variant.
const VARIANT_CLASS = {
  service: "p-6",
  product: "p-7",
  info: "p-5",
  testimonial: "p-6",
  stat: "p-6 text-center",
};

/**
 * Card — the one card component for the Section/Card design system.
 * Adapts to whichever Section surface it's rendered inside (light cards
 * stay white on tint sections, go translucent-on-dark inside a dark
 * section) and cycles through ACCENT_ROTATION by `index` for the border/
 * icon/hover-glow color, so a grid of N cards reads as one deliberate
 * repeating pattern instead of N independent choices.
 *
 * Props:
 *  - variant: "service" | "product" | "info" | "testimonial" | "stat"
 *  - index: position in its grid — drives both accent rotation and the
 *           Reveal stagger delay
 *  - icon: optional react-icons component, rendered in an accent chip
 *  - noAccent: true to render a plain card with no top-border/icon accent
 *              (e.g. a card that already carries its own imagery)
 */
export default function Card({
  variant = "info",
  index = 0,
  icon: Icon,
  noAccent = false,
  className = "",
  children,
  ...rest
}) {
  const tone = useSurface();
  const accentKey = ACCENT_ROTATION[index % ACCENT_ROTATION.length];
  const accent = ACCENTS[accentKey];

  return (
    <Reveal variant="up" index={index}>
      <motion.div
        whileHover={{ y: -6, boxShadow: `0 16px 34px ${accent.glow}` }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className={`relative rounded-2xl shadow-sm ${tone.cardSurface} ${
          noAccent ? "" : `border-t-4 ${accent.border}`
        } ${VARIANT_CLASS[variant]} ${className}`}
        {...rest}
      >
        {Icon && !noAccent && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${accent.iconBg} ${variant === "stat" ? "mx-auto" : ""}`}>
            <Icon className={`text-lg ${accent.iconText}`} aria-hidden="true" />
          </div>
        )}
        {children}
      </motion.div>
    </Reveal>
  );
}

/** Small helper so card body copy picks up the right muted tone per surface. */
export function CardMuted({ className = "", children }) {
  const tone = useSurface();
  return <p className={`text-sm leading-relaxed ${tone.cardMuted} ${className}`}>{children}</p>;
}
