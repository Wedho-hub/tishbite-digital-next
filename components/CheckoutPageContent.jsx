"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaLock,
  FaArrowLeft,
  FaArrowRight,
  FaCreditCard,
  FaCheckCircle,
  FaShieldAlt,
} from "react-icons/fa";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://tishbitedigital-api.onrender.com";

const INSTALLMENT_INFO = {
  "Business Launch Suite": { amount: 2900, months: 3 },
  "Digital Foundation Suite": { amount: 3400, months: 3 },
  "Growth Acceleration Suite": { amount: 2500, months: 5 },
  "Revenue Automation Suite": { amount: 3000, months: 5 },
  "Tishbite Enterprise Growth System": { amount: 4700, months: 6 },
};

const SERVICES_CATALOGUE = [
  {
    name: "Business Launch Suite",
    price: 8700,
    badge: "Most Popular",
    description: "Website + branding + local SEO foundation",
  },
  {
    name: "Digital Foundation Suite",
    price: 10200,
    badge: null,
    description: "Website + SEO + Google Business setup",
  },
  {
    name: "Growth Acceleration Suite",
    price: 12500,
    badge: null,
    description: "Full digital system with lead automation",
  },
  {
    name: "Revenue Automation Suite",
    price: 15000,
    badge: null,
    description: "Advanced automation + ads + CRM integration",
  },
  {
    name: "Tishbite Enterprise Growth System",
    price: 28200,
    badge: "Premium",
    description: "Complete enterprise digital growth system",
  },
  {
    name: "Brand Identity & Market Positioning Design",
    price: 4500,
    badge: null,
    description: "Logo, colours, brand guidelines & positioning",
  },
  {
    name: "Business Registration & Compliance Setup",
    price: 2500,
    badge: null,
    description: "Company registration & compliance documentation",
  },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

function validate(form) {
  const e = {};
  if (!form.firstName.trim()) e.firstName = "First name is required.";
  if (!form.lastName.trim()) e.lastName = "Last name is required.";
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    e.email = "A valid email address is required.";
  if (form.phone && !/^[\d\s+()-]{7,15}$/.test(form.phone))
    e.phone = "Enter a valid phone number.";
  return e;
}

function submitToPayFast(pfUrl, params) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = pfUrl;
  Object.entries(params).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
}

/* ── Service picker ─────────────────────────────── */
function ServicePicker({ onSelect }) {
  return (
    <div className="min-h-screen bg-bg py-14">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-primary font-semibold text-sm no-underline hover:text-primary-dark mb-8"
        >
          <FaArrowLeft size={12} /> Back to Services
        </Link>

        <h1
          className="text-3xl lg:text-4xl font-extrabold text-primary-dark mb-3"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          Choose a Service
        </h1>
        <p className="text-text-muted mb-10 max-w-xl">
          Select the package you want to pay for. You will be redirected to
          PayFast's secure payment portal to complete your purchase.
        </p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {SERVICES_CATALOGUE.map((svc) => {
            const info = INSTALLMENT_INFO[svc.name];
            const isFeatured = svc.badge === "Most Popular";
            return (
              <motion.button
                key={svc.name}
                type="button"
                variants={fadeUp}
                onClick={() => onSelect({ name: svc.name, price: svc.price })}
                whileHover={{ y: -4, boxShadow: isFeatured ? "0 12px 28px rgba(27,67,50,0.45)" : "0 10px 24px rgba(27,67,50,0.2)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className={`relative text-left rounded-2xl p-5 border-2 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                  isFeatured
                    ? "border-accent bg-linear-to-br from-primary-dark to-primary text-white"
                    : "border-primary/15 bg-white hover:border-primary/40 transition-colors duration-200"
                }`}
              >
                {svc.badge && (
                  <span
                    className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-3 ${
                      isFeatured
                        ? "bg-accent text-primary-dark"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {svc.badge}
                  </span>
                )}
                <p
                  className={`font-bold leading-snug mb-1 text-sm ${
                    isFeatured ? "text-white" : "text-primary-dark"
                  }`}
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {svc.name}
                </p>
                <p className={`text-xs mb-3 ${isFeatured ? "text-white/80" : "text-text-muted"}`}>
                  {svc.description}
                </p>
                <p
                  className={`text-xl font-extrabold mb-1 ${
                    isFeatured ? "text-accent" : "text-primary-dark"
                  }`}
                >
                  R{svc.price.toLocaleString("en-ZA")}
                </p>
                {info && (
                  <p className={`text-xs mb-3 ${isFeatured ? "text-white/70" : "text-text-muted"}`}>
                    or {info.months} × R{info.amount.toLocaleString("en-ZA")}/mo
                  </p>
                )}
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold ${
                    isFeatured ? "text-accent" : "text-primary"
                  }`}
                >
                  Select &amp; Continue <FaArrowRight size={10} />
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        <div className="mt-10 flex items-center justify-center gap-2 text-text-muted text-xs">
          <FaLock aria-hidden="true" />
          <span>
            Payments secured by <strong>PayFast</strong> · SSL Encrypted · ZAR
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Checkout form ──────────────────────────────── */
function CheckoutForm({ selectedService, onBack }) {
  const { name: service, price: rawPrice } = selectedService;
  const installInfo = INSTALLMENT_INFO[service] || null;

  const [paymentType, setPaymentType] = useState("once-off");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const displayAmount =
    paymentType === "installment" && installInfo ? installInfo.amount : rawPrice;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/payments/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, service, amount: displayAmount, paymentType }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to initiate payment.");
      }
      const { pfUrl, params } = await res.json();
      submitToPayFast(pfUrl, params);
    } catch (err) {
      setApiError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl border bg-white text-text-dark text-sm placeholder-text-muted/60 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  return (
    <div className="min-h-screen bg-bg py-14">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-start">
          {/* ── Left: Order summary ── */}
          <aside>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-primary font-semibold text-sm no-underline hover:text-primary-dark mb-6 bg-transparent border-0 cursor-pointer p-0"
            >
              <FaArrowLeft size={12} /> Change Service
            </button>

            <div className="bg-linear-to-br from-primary-dark to-primary rounded-2xl p-6 text-white sticky top-[calc(var(--nav-height)+1rem)]">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <FaCreditCard size={20} />
              </div>
              <h2
                className="text-lg font-extrabold mb-5"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Order Summary
              </h2>

              <div className="mb-4">
                <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Service</p>
                <p className="font-bold text-sm leading-snug">{service}</p>
              </div>

              {installInfo && (
                <div className="mb-4">
                  <p className="text-white/60 text-xs uppercase tracking-wide mb-2">
                    Payment Option
                  </p>
                  <div className="flex gap-2">
                    {["once-off", "installment"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPaymentType(type)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                          paymentType === type
                            ? "bg-accent text-primary-dark"
                            : "bg-white/10 text-white/80 hover:bg-white/20"
                        }`}
                      >
                        {type === "once-off" ? "Once-Off" : "Installment"}
                      </button>
                    ))}
                  </div>
                  {paymentType === "installment" && (
                    <p className="text-white/70 text-xs mt-2">
                      {installInfo.months} monthly payments of R
                      {installInfo.amount.toLocaleString("en-ZA")} each
                    </p>
                  )}
                </div>
              )}

              <div className="border-t border-white/15 pt-4 mb-5">
                <p className="text-white/60 text-xs uppercase tracking-wide mb-1">
                  {paymentType === "installment" ? "Today's Payment" : "Total Amount"}
                </p>
                <p className="text-3xl font-extrabold text-accent">
                  R{displayAmount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-4 border-t border-white/15">
                {["SSL Encrypted", "PayFast Secured", "South African Rand (ZAR)"].map((b) => (
                  <span key={b} className="flex items-center gap-2 text-xs text-white/80">
                    <FaCheckCircle size={10} className="text-accent shrink-0" />
                    {b}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-5 text-white/60 text-xs pt-4 border-t border-white/15">
                <FaLock size={10} />
                <span>
                  Secured by <strong className="text-white/80">PayFast</strong>
                </span>
              </div>
            </div>
          </aside>

          {/* ── Right: Form ── */}
          <main className="bg-white rounded-2xl border border-primary/10 shadow-sm p-6 lg:p-8">
            <h1
              className="text-2xl font-extrabold text-primary-dark mb-1"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Your Details
            </h1>
            <p className="text-text-muted text-sm mb-6">
              Enter your details below to proceed to secure payment.
            </p>

            {apiError && (
              <div
                role="alert"
                className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
              >
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-semibold text-text-dark mb-1.5"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Your first name"
                    disabled={loading}
                    className={`${inputBase} ${errors.firstName ? "border-red-400 focus:ring-red-200" : "border-primary/20"}`}
                  />
                  {errors.firstName && (
                    <p role="alert" className="text-red-600 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-semibold text-text-dark mb-1.5"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Your last name"
                    disabled={loading}
                    className={`${inputBase} ${errors.lastName ? "border-red-400 focus:ring-red-200" : "border-primary/20"}`}
                  />
                  {errors.lastName && (
                    <p role="alert" className="text-red-600 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-text-dark mb-1.5"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  disabled={loading}
                  className={`${inputBase} ${errors.email ? "border-red-400 focus:ring-red-200" : "border-primary/20"}`}
                />
                {errors.email && (
                  <p role="alert" className="text-red-600 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-text-dark mb-1.5"
                >
                  Phone Number{" "}
                  <span className="text-text-muted font-normal text-xs">(optional)</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+27 79 168 4548"
                  disabled={loading}
                  className={`${inputBase} ${errors.phone ? "border-red-400 focus:ring-red-200" : "border-primary/20"}`}
                />
                {errors.phone && (
                  <p role="alert" className="text-red-600 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-linear-to-r from-primary-dark to-primary-light text-white font-bold text-base disabled:opacity-60 disabled:cursor-not-allowed"
                whileHover={loading ? {} : { y: -3, boxShadow: "0 10px 24px rgba(27,67,50,0.4)" }}
                whileTap={loading ? {} : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Redirecting to PayFast...
                  </>
                ) : (
                  <>
                    <FaLock size={14} />
                    Pay R{displayAmount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })} Securely
                  </>
                )}
              </button>

              <p className="text-text-muted text-xs text-center leading-relaxed">
                By proceeding, you agree to our terms. Payments are processed
                securely by PayFast. You will be redirected to their payment portal.
              </p>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────────── */
export default function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const paramService = searchParams.get("service");
  const paramPrice = searchParams.get("price");

  const [selectedService, setSelectedService] = useState(() =>
    paramService && paramPrice
      ? { name: paramService, price: parseFloat(paramPrice) }
      : null
  );

  if (!selectedService) {
    return (
      <ServicePicker
        onSelect={(svc) => {
          setSelectedService(svc);
        }}
      />
    );
  }

  return (
    <CheckoutForm
      selectedService={selectedService}
      onBack={() => setSelectedService(null)}
    />
  );
}
