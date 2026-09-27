"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { ZOHO_LISTS, isZohoConfigured } from "@/lib/zohoLists";

const NEED_OPTIONS = ["Website", "Social Media", "Branding", "Ads", "Not sure"];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];

// Zoho's embedded-form action URL lives on their domain, so a plain fetch()
// would be blocked by CORS and we can't read a cross-origin response anyway.
// Submitting into a hidden iframe is the standard way to post straight to a
// free-plan Zoho Campaigns form while staying on our own page and controlling
// our own thank-you experience. We can't confirm Zoho accepted it (no
// readable response), so "success" here means "the request left the
// browser" — that's the trade-off of the no-API approach.
export default function LeadForm({ offer }) {
  const router = useRouter();
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const iframeName = `zf-${rawId}`;
  const formRef = useRef(null);

  const [form, setForm] = useState({ firstName: "", email: "", whatsapp: "", need: "", preferredTime: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [utm, setUtm] = useState({ utm_source: "", utm_medium: "", utm_campaign: "", utm_content: "" });
  const honeypotRef = useRef(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const next = {};
      UTM_KEYS.forEach((key) => {
        next[key] = params.get(key) || "";
      });
      setUtm(next);
    } catch {
      /* no-op: URL parsing can't fail here, but never block the form on it */
    }
  }, []);

  const zoho = ZOHO_LISTS[offer.listKey];
  const configured = isZohoConfigured(offer.listKey);

  const validate = (name, value) => {
    if (name === "firstName") return value.trim() ? "" : "Please enter your first name.";
    if (name === "email") {
      if (!value.trim()) return "Please enter your email address.";
      return emailRegex.test(value) ? "" : "Enter a valid email address.";
    }
    return "";
  };

  // Keyed off data-field (our internal state key), not the DOM `name` — the
  // visible inputs' `name` attributes are display-only placeholders so they
  // never collide with the hidden inputs that actually carry Zoho's field
  // names, so we can't rely on e.target.name here.
  const handleChange = (e) => {
    const { field } = e.target.dataset;
    const { value } = e.target;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
    }
  };

  const handleBlur = (e) => {
    const { field } = e.target.dataset;
    const { value } = e.target;
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = {
      firstName: validate("firstName", form.firstName),
      email: validate("email", form.email),
    };
    setErrors(nextErrors);
    setTouched({ firstName: true, email: true });
    if (nextErrors.firstName || nextErrors.email) return;

    setSubmitting(true);

    const isBot = Boolean(honeypotRef.current?.value);
    if (!isBot) {
      formRef.current?.submit();
    }

    // Give the hidden-iframe POST a moment to actually leave the browser
    // before we navigate away from this page.
    window.setTimeout(() => {
      router.push(`/thank-you?offer=${encodeURIComponent(offer.slug)}`);
    }, 700);
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-primary/10 shadow-lg">
      {!configured && (
        <p className="mb-2.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
          Zoho list not connected yet — update <code>lib/zohoLists.js</code> with the real embed values for &ldquo;{zoho.label}&rdquo;.
        </p>
      )}

      <h2 className="text-base sm:text-lg font-bold text-primary-dark mb-2.5 sm:mb-4" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
        {offer.formHeading}
      </h2>

      <iframe name={iframeName} title="" hidden />

      <form
        ref={formRef}
        action={zoho.actionUrl}
        method="POST"
        target={iframeName}
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-2"
      >
        {zoho.hiddenFields.map((field) => (
          <input key={field.name} type="hidden" name={field.name} value={field.value} />
        ))}
        <input type="hidden" name={zoho.fieldNames.firstName} value={form.firstName} />
        <input type="hidden" name={zoho.fieldNames.email} value={form.email} />
        <input type="hidden" name={zoho.fieldNames.whatsapp} value={form.whatsapp} />
        <input type="hidden" name={zoho.fieldNames.need} value={form.need} />
        <input type="hidden" name={zoho.fieldNames.utmSource} value={utm.utm_source} />
        <input type="hidden" name={zoho.fieldNames.utmMedium} value={utm.utm_medium} />
        <input type="hidden" name={zoho.fieldNames.utmCampaign} value={utm.utm_campaign} />
        <input type="hidden" name={zoho.fieldNames.utmContent} value={utm.utm_content} />

        {/* Honeypot — hidden from sighted users, real browsers never fill it in.
            Off-screen instead of display:none so simple bots that skip hidden
            fields still see (and fill) it. */}
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
            name="firstName_display"
            data-field="firstName"
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
            name="email_display"
            data-field="email"
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
            name="whatsapp_display"
            data-field="whatsapp"
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
              name="preferredTime_display"
              data-field="preferredTime"
              value={form.preferredTime}
              onChange={handleChange}
              placeholder="e.g. Weekday mornings"
              className="w-full rounded-xl border border-primary/15 bg-white px-3.5 py-2.5 text-sm text-text-dark placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
            />
            <input type="hidden" name={zoho.fieldNames.preferredTime || "preferred_time_fallback"} value={form.preferredTime} />
          </div>
        )}

        <div>
          <label htmlFor={`${rawId}-need`} className="block text-sm font-semibold text-text-dark mb-1">
            What do you need most?
          </label>
          <select
            id={`${rawId}-need`}
            name="need_display"
            data-field="need"
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
