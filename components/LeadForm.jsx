"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const NEED_OPTIONS = ["Website", "Social Media", "Branding", "Ads", "Not sure"];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];

// `extraData` carries offer-specific fields beyond the standard form (e.g.
// the scorecard's computed score/band), merged straight into the POST body.
export default function LeadForm({ offer, extraData }) {
  const router = useRouter();
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");

  const [form, setForm] = useState({ firstName: "", email: "", whatsapp: "", need: "", preferredTime: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const honeypotRef = useRef(null);

  const validate = (field, value) => {
    if (field === "firstName") return value.trim() ? "" : "Please enter your first name.";
    if (field === "email") {
      if (!value.trim()) return "Please enter your email address.";
      return emailRegex.test(value) ? "" : "Enter a valid email address.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const nextErrors = {
      firstName: validate("firstName", form.firstName),
      email: validate("email", form.email),
    };
    setErrors(nextErrors);
    setTouched({ firstName: true, email: true });
    if (nextErrors.firstName || nextErrors.email) return;

    if (honeypotRef.current?.value) {
      // Bot caught by the honeypot — fake a normal success without hitting
      // the API, so it has no signal it was blocked.
      router.push(`/thank-you?offer=${encodeURIComponent(offer.slug)}`);
      return;
    }

    setSubmitting(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const utm = {};
      UTM_KEYS.forEach((key) => { utm[key] = params.get(key) || ""; });

      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          offerSlug: offer.slug,
          ...utm,
          ...extraData,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(data?.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      router.push(`/thank-you?offer=${encodeURIComponent(offer.slug)}`);
    } catch {
      setSubmitError("Couldn't reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-primary/10 shadow-lg">
      <h2 className="text-base sm:text-lg font-bold text-primary-dark mb-2.5 sm:mb-4" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
        {offer.formHeading}
      </h2>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2">
        {/* Honeypot — hidden from sighted users, real browsers never fill it in. */}
        <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
          <label htmlFor={`${rawId}-company`}>Company</label>
          <input
            ref={honeypotRef}
            id={`${rawId}-company`}
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor={`${rawId}-firstName`} className="block text-sm font-semibold text-text-dark mb-1">
            First Name
          </label>
          <input
            id={`${rawId}-firstName`}
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="given-name"
            required
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? `${rawId}-firstName-error` : undefined}
            placeholder="Your first name"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-text-dark placeholder-text-muted/60 focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.firstName && touched.firstName
                ? "border-red-400 bg-red-50 focus:ring-red-300"
                : "border-primary/15 bg-white focus:ring-primary/30 focus:border-primary"
            }`}
          />
          {errors.firstName && touched.firstName && (
            <p id={`${rawId}-firstName-error`} className="mt-1 text-red-500 text-xs" role="alert">
              {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${rawId}-email`} className="block text-sm font-semibold text-text-dark mb-1">
            Email
          </label>
          <input
            id={`${rawId}-email`}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${rawId}-email-error` : undefined}
            placeholder="your@email.com"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-text-dark placeholder-text-muted/60 focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.email && touched.email
                ? "border-red-400 bg-red-50 focus:ring-red-300"
                : "border-primary/15 bg-white focus:ring-primary/30 focus:border-primary"
            }`}
          />
          {errors.email && touched.email && (
            <p id={`${rawId}-email-error`} className="mt-1 text-red-500 text-xs" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${rawId}-whatsapp`} className="block text-sm font-semibold text-text-dark mb-1">
            WhatsApp Number <span className="text-text-muted font-normal">(optional)</span>
          </label>
          <input
            id={`${rawId}-whatsapp`}
            type="tel"
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            autoComplete="tel"
            placeholder="e.g. 079 168 4548"
            className="w-full rounded-xl border border-primary/15 bg-white px-3.5 py-2.5 text-sm text-text-dark placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
          />
        </div>

        {offer.showPreferredTime && (
          <div>
            <label htmlFor={`${rawId}-preferredTime`} className="block text-sm font-semibold text-text-dark mb-1">
              Best day/time to call <span className="text-text-muted font-normal">(optional)</span>
            </label>
            <input
              id={`${rawId}-preferredTime`}
              type="text"
              name="preferredTime"
              value={form.preferredTime}
              onChange={handleChange}
              placeholder="e.g. Weekday mornings"
              className="w-full rounded-xl border border-primary/15 bg-white px-3.5 py-2.5 text-sm text-text-dark placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
            />
          </div>
        )}

        <div>
          <label htmlFor={`${rawId}-need`} className="block text-sm font-semibold text-text-dark mb-1">
            What do you need most?
          </label>
          <select
            id={`${rawId}-need`}
            name="need"
            value={form.need}
            onChange={handleChange}
            className="w-full rounded-xl border border-primary/15 bg-white px-3.5 py-2.5 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
          >
            <option value="">— Select an option —</option>
            {NEED_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <motion.button
          type="submit"
          disabled={submitting}
          className="mt-1 w-full flex items-center justify-center gap-2 bg-linear-to-r from-primary-dark to-primary-light text-white font-bold py-3 rounded-xl text-base disabled:opacity-60 disabled:cursor-not-allowed"
          whileHover={submitting ? {} : { y: -2, boxShadow: "0 10px 24px rgba(27,67,50,0.4)" }}
          whileTap={submitting ? {} : { scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
        >
          {submitting ? "Sending..." : offer.ctaText}
          {!submitting && <FaArrowRight size={14} aria-hidden="true" />}
        </motion.button>

        {submitError && (
          <p className="text-red-500 text-xs text-center" role="alert">
            {submitError}
          </p>
        )}

        <p className="text-text-muted text-xs text-center leading-relaxed m-0">
          We&rsquo;ll email you the {offer.offerLabel}. Unsubscribe anytime.{" "}
          <a href="/privacy-policy" className="text-primary font-semibold underline underline-offset-2">
            Privacy Policy
          </a>
        </p>
      </form>
    </div>
  );
}
