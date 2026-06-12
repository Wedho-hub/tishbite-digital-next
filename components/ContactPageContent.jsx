"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaPaperPlane, FaClock, FaCalendarAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://tishbitedigital-api.onrender.com";

const SERVICES_OPTIONS = [
  "Lead-Generating Website Development",
  "Google Business Profile & Local SEO",
  "Brand Identity & Market Positioning",
  "Meta Suite Setup & Social Integration",
  "Paid Ads & Lead Generation Campaigns",
  "CRM, Automation & Conversion Systems",
  "Business Registration & Compliance Setup",
  "Social Media Growth Strategy & Execution",
  "Growth Bundle / Full Package",
  "Free Website & SEO Audit",
  "Other / Not Sure Yet",
];

const validate = (name, value) => {
  const v = String(value || "").trim();
  if (name === "name") return v ? "" : "Please enter your full name.";
  if (name === "email") {
    if (!v) return "Please enter your email address.";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address.";
  }
  if (name === "message") {
    if (!v) return "Please enter your message.";
    return v.length < 10 ? "Your message should be at least 10 characters." : "";
  }
  return "";
};

export default function ContactPageContent() {
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState({ name: false, email: false, message: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (touched[name]) {
      setErrors((p) => ({ ...p, [name]: validate(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    const nextErrors = {
      name: validate("name", form.name),
      email: validate("email", form.email),
      message: validate("message", form.message),
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.email || nextErrors.message) return;

    setLoading(true);
    setSuccess(false);
    setSubmitError("");
    try {
      const res = await fetch(`${API_URL}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Submission failed. Please try again.");
      setSuccess(true);
      setForm({ name: "", email: "", service: "", message: "" });
      setErrors({ name: "", email: "", message: "" });
      setTouched({ name: false, email: false, message: false });
    } catch (err) {
      setSubmitError(err?.message || "Failed to submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-text-dark placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200";
  const errorBase =
    "w-full rounded-xl border-red-400 bg-red-50 px-4 py-3 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-200";

  return (
    <>
      <PageHeader
        title="Contact Us"
        subtitle="Tell us what your business needs — we'll map out the best path forward"
      />
      <section className="py-14 bg-bg">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">

            {/* ── Info panel ── */}
            <motion.div
              className="lg:w-5/12 w-full"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-linear-to-br from-primary-dark to-primary rounded-2xl p-7 text-white mb-4">
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  Start Your Digital Transformation
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-5">
                  Whether you need a professional website, CRM integration, automation system, or SEO-driven marketing strategy — we structure systems that scale your business.
                </p>
                <div className="space-y-3 mb-5">
                  <a href="tel:+27791684548" className="flex items-center gap-3 text-white/80 hover:text-accent transition-colors no-underline text-sm">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <FaPhone size={14} aria-hidden="true" />
                    </div>
                    +27 79 168 4548
                  </a>
                  <a href="mailto:info@tishbitedigital.co.za" className="flex items-center gap-3 text-white/80 hover:text-accent transition-colors no-underline text-sm">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <FaEnvelope size={14} aria-hidden="true" />
                    </div>
                    info@tishbitedigital.co.za
                  </a>
                </div>
                <motion.a
                  href="https://wa.me/27791684548?text=Hello%20Tishbite%20Digital,%20I%20want%20a%20free%20website%20and%20SEO%20audit."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25d366] text-white font-bold py-3 rounded-xl no-underline text-sm"
                  whileHover="hover"
                  initial="rest"
                  whileTap={{ scale: 0.96 }}
                  variants={{
                    rest: { y: 0, backgroundColor: "#25d366", boxShadow: "0 2px 8px rgba(37,211,102,0.2)" },
                    hover: { y: -3, backgroundColor: "#1db954", boxShadow: "0 8px 22px rgba(37,211,102,0.5)" },
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                >
                  <motion.span variants={{ rest: { scale: 1 }, hover: { scale: 1.2 } }} transition={{ type: "spring", stiffness: 300, damping: 18 }} aria-hidden="true">
                    <FaWhatsapp size={16} />
                  </motion.span>
                  Chat on WhatsApp
                </motion.a>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-primary/8 shadow-sm">
                <h4 className="font-bold text-primary-dark text-sm flex items-center gap-2 mb-3">
                  <FaClock className="text-primary" aria-hidden="true" />
                  Operating Times
                </h4>
                <ul className="space-y-2 list-none p-0 m-0 text-sm text-text-muted">
                  <li className="flex items-start gap-2">
                    <FaCalendarAlt className="text-primary mt-0.5 shrink-0" aria-hidden="true" />
                    Working hours: <strong className="text-text-dark ml-1">0500hrs to 2000hrs</strong>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCalendarAlt className="text-primary mt-0.5 shrink-0" aria-hidden="true" />
                    Availability pause: <strong className="text-text-dark ml-1">Friday sunset to Saturday sunset</strong>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* ── Form ── */}
            <motion.div
              className="lg:w-7/12 w-full"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl p-7 border border-primary/8 shadow-sm">
                <form
                  onSubmit={handleSubmit}
                  aria-labelledby="contact-form-title"
                  noValidate
                >
                  <h3 id="contact-form-title" className="sr-only">Contact Form</h3>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-text-dark mb-1.5" htmlFor="contact-name">
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="name"
                      required
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "contact-name-error" : undefined}
                      placeholder="Your full name"
                      className={errors.name && touched.name ? errorBase : inputBase}
                    />
                    {errors.name && touched.name && (
                      <p id="contact-name-error" className="mt-1 text-red-500 text-xs" role="alert">{errors.name}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-text-dark mb-1.5" htmlFor="contact-service">
                      What are you interested in? <span className="text-text-muted font-normal">(optional)</span>
                    </label>
                    <select
                      id="contact-service"
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className={inputBase}
                    >
                      <option value="">— Select a service —</option>
                      {SERVICES_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-text-dark mb-1.5" htmlFor="contact-email">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="email"
                      required
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "contact-email-error" : undefined}
                      placeholder="your@email.com"
                      className={errors.email && touched.email ? errorBase : inputBase}
                    />
                    {errors.email && touched.email && (
                      <p id="contact-email-error" className="mt-1 text-red-500 text-xs" role="alert">{errors.email}</p>
                    )}
                  </div>

                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-text-dark mb-1.5" htmlFor="contact-message">
                      Your Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows="5"
                      value={form.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? "contact-message-error" : undefined}
                      placeholder="Tell us about your business and what you need..."
                      className={`${errors.message && touched.message ? errorBase : inputBase} resize-none`}
                    />
                    {errors.message && touched.message && (
                      <p id="contact-message-error" className="mt-1 text-red-500 text-xs" role="alert">{errors.message}</p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-primary-dark to-primary-light text-white font-bold py-3.5 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
                    whileHover={loading ? {} : { y: -3, boxShadow: "0 10px 24px rgba(27,67,50,0.4)" }}
                    whileTap={loading ? {} : { scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  >
                    {loading ? "Sending Message..." : "Send Message"}
                    <FaPaperPlane size={14} aria-hidden="true" />
                  </motion.button>

                  {success && (
                    <motion.div
                      className="mt-4 bg-green-50 border border-green-200 rounded-xl p-5"
                      role="status"
                      aria-live="polite"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <p className="font-bold text-green-700 mb-1">✅ Message received!</p>
                      <p className="text-green-600 text-sm mb-3">
                        We'll be in touch within <strong>24 hours</strong>. Want a faster response?
                      </p>
                      <motion.a
                        href="https://wa.me/27791684548?text=Hi%20Tishbite%20Digital,%20I%20just%20submitted%20an%20enquiry%20and%20would%20love%20to%20chat."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#25d366] text-white font-bold px-4 py-2 rounded-lg text-sm no-underline"
                        whileHover={{ y: -2, backgroundColor: "#1db954", boxShadow: "0 6px 16px rgba(37,211,102,0.45)" }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      >
                        <FaWhatsapp /> Chat on WhatsApp now
                      </motion.a>
                    </motion.div>
                  )}

                  {submitError && (
                    <motion.div
                      className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4"
                      role="alert"
                      aria-live="assertive"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {submitError}
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
