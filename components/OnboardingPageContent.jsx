"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaPaperPlane, FaClipboardList } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";

const MARKETING_CHANNELS = ["Google/SEO", "Facebook/Instagram", "WhatsApp", "Referrals", "Print/Flyers", "None yet", "Other"];
const GOALS = ["More leads/enquiries", "Better Google visibility", "Professional rebrand", "Automate follow-up", "Sell products online", "Other"];
const SERVICES = [
  "Website Development",
  "Local SEO",
  "Brand Identity",
  "Paid Ads",
  "CRM/Automation",
  "Business Registration",
  "Social Media",
  "Full Growth Bundle",
  "Not sure — recommend",
];
const BUDGET_RANGES = ["Under R5,000", "R5,000–R10,000", "R10,000–R20,000", "R20,000–R30,000", "R30,000+", "Not sure yet"];

const INITIAL_FORM = {
  fullName: "", businessName: "", role: "", email: "", phone: "", location: "",
  businessDescription: "", yearsOperating: "",
  hasWebsite: "no", websiteUrl: "", whatsWorking: "", whatsNotWorking: "",
  marketingChannels: [], hasGoogleBusinessProfile: "not_sure",
  goals: [], servicesInterested: [], successDefinition: "", timeline: "", urgencyReason: "",
  idealCustomer: "", customerLocations: "", competitors: "", competitorLikesDislikes: "",
  hasLogo: "no", hasBrandColors: "no", hasMedia: "no", hasCopyReady: "no",
  budgetRange: "", openToInstallments: "maybe", decisionMakers: "",
  additionalNotes: "",
};

function SectionCard({ number, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-primary/8 shadow-sm mb-5">
      <div className="flex items-center gap-3 mb-5">
        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
          {number}
        </span>
        <div>
          <h3 className="font-bold text-primary-dark text-base leading-snug" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            {title}
          </h3>
          {subtitle && <p className="text-text-muted text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({ label, optional, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-text-dark mb-1.5">
        {label} {optional && <span className="text-text-muted font-normal">(optional)</span>}
      </label>
      {children}
    </div>
  );
}

function CheckboxGroup({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            aria-pressed={active}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 ${
              active
                ? "bg-primary text-white border-primary"
                : "bg-white text-text-muted border-primary/15 hover:border-primary/40"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function OnboardingPageContent() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const set = (name, value) => setForm((p) => ({ ...p, [name]: value }));
  const handleChange = (e) => set(e.target.name, e.target.value);
  const toggleMulti = (name, value) =>
    setForm((p) => ({
      ...p,
      [name]: p[name].includes(value) ? p[name].filter((v) => v !== value) : [...p[name], value],
    }));

  const inputBase =
    "w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-text-dark placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200";
  const errorBase =
    "w-full rounded-xl border-red-400 bg-red-50 px-4 py-3 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-200";

  const validateRequired = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Please enter your full name.";
    if (!form.businessName.trim()) errs.businessName = "Please enter your business name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = "Enter a valid email address.";
    if (!form.phone.trim()) errs.phone = "Please enter a phone or WhatsApp number.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateRequired();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setSuccess(false);
    setSubmitError("");
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Submission failed. Please try again.");
      setSuccess(true);
      setForm(INITIAL_FORM);
      setFieldErrors({});
    } catch (err) {
      setSubmitError(err?.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <PageHeader title="Onboarding" subtitle="New client onboarding" />
        <section className="py-20 bg-bg">
          <div className="container mx-auto px-4 max-w-lg text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl border border-green-200 p-8"
            >
              <p className="text-4xl mb-3">✅</p>
              <h2 className="font-bold text-primary-dark text-xl mb-2" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                Thank you — we&apos;ve got everything we need
              </h2>
              <p className="text-text-muted text-sm mb-5">
                We&apos;ll review your answers and come back to you within 24 hours with next steps and a tailored quote.
              </p>
              <motion.a
                href="https://wa.me/27791684548?text=Hi%20Tishbite%20Digital,%20I%20just%20completed%20the%20onboarding%20form."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25d366] text-white font-bold px-5 py-3 rounded-xl text-sm no-underline"
                whileHover={{ y: -2, backgroundColor: "#1db954", boxShadow: "0 8px 22px rgba(37,211,102,0.45)" }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                <FaWhatsapp /> Chat with us now on WhatsApp
              </motion.a>
            </motion.div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="New Client Onboarding"
        subtitle="Tell us about your business so we can prepare an accurate quote and a real growth strategy — not a guess"
      />
      <section className="py-14 bg-bg">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6 px-5 py-4 rounded-xl bg-primary/8 border border-primary/15"
          >
            <FaClipboardList className="text-primary text-xl shrink-0" aria-hidden="true" />
            <p className="text-text-dark text-sm m-0">
              Takes about 5–7 minutes. The more detail you give us, the more accurate your quote and strategy will be.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} noValidate>
            <SectionCard number={1} title="Contact & Business Basics">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name">
                  <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Your full name"
                    className={fieldErrors.fullName ? errorBase : inputBase} />
                  {fieldErrors.fullName && <p className="mt-1 text-red-500 text-xs">{fieldErrors.fullName}</p>}
                </Field>
                <Field label="Business Name">
                  <input name="businessName" value={form.businessName} onChange={handleChange} placeholder="Your business name"
                    className={fieldErrors.businessName ? errorBase : inputBase} />
                  {fieldErrors.businessName && <p className="mt-1 text-red-500 text-xs">{fieldErrors.businessName}</p>}
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Your Role" optional>
                  <input name="role" value={form.role} onChange={handleChange} placeholder="e.g. Owner, Manager" className={inputBase} />
                </Field>
                <Field label="Email Address">
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com"
                    className={fieldErrors.email ? errorBase : inputBase} />
                  {fieldErrors.email && <p className="mt-1 text-red-500 text-xs">{fieldErrors.email}</p>}
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Phone / WhatsApp">
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+27 ..."
                    className={fieldErrors.phone ? errorBase : inputBase} />
                  {fieldErrors.phone && <p className="mt-1 text-red-500 text-xs">{fieldErrors.phone}</p>}
                </Field>
                <Field label="Where is the business based?" optional>
                  <input name="location" value={form.location} onChange={handleChange} placeholder="City / area served" className={inputBase} />
                </Field>
              </div>
              <Field label="What does the business do?" optional>
                <textarea name="businessDescription" value={form.businessDescription} onChange={handleChange} rows={3}
                  placeholder="Briefly describe your business" className={`${inputBase} resize-none`} />
              </Field>
              <Field label="How long has the business been operating?" optional>
                <input name="yearsOperating" value={form.yearsOperating} onChange={handleChange} placeholder="e.g. 3 years" className={inputBase} />
              </Field>
            </SectionCard>

            <SectionCard number={2} title="Current Digital Presence">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Do you have an existing website?">
                  <select name="hasWebsite" value={form.hasWebsite} onChange={handleChange} className={inputBase}>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </Field>
                {form.hasWebsite === "yes" && (
                  <Field label="Website URL">
                    <input name="websiteUrl" value={form.websiteUrl} onChange={handleChange} placeholder="https://..." className={inputBase} />
                  </Field>
                )}
              </div>
              <Field label="What's working well about your current online presence?" optional>
                <textarea name="whatsWorking" value={form.whatsWorking} onChange={handleChange} rows={2} className={`${inputBase} resize-none`} />
              </Field>
              <Field label="What's frustrating or not working?" optional>
                <textarea name="whatsNotWorking" value={form.whatsNotWorking} onChange={handleChange} rows={2} className={`${inputBase} resize-none`} />
              </Field>
              <Field label="Current marketing channels in use">
                <CheckboxGroup options={MARKETING_CHANNELS} selected={form.marketingChannels} onToggle={(v) => toggleMulti("marketingChannels", v)} />
              </Field>
              <Field label="Do you have a Google Business Profile?">
                <select name="hasGoogleBusinessProfile" value={form.hasGoogleBusinessProfile} onChange={handleChange} className={inputBase}>
                  <option value="not_sure">Not sure</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </Field>
            </SectionCard>

            <SectionCard number={3} title="Goals & Project Scope">
              <Field label="What are you hoping to achieve?">
                <CheckboxGroup options={GOALS} selected={form.goals} onToggle={(v) => toggleMulti("goals", v)} />
              </Field>
              <Field label="Which service(s) are you interested in?">
                <CheckboxGroup options={SERVICES} selected={form.servicesInterested} onToggle={(v) => toggleMulti("servicesInterested", v)} />
              </Field>
              <Field label="What does success look like for this project?" optional>
                <textarea name="successDefinition" value={form.successDefinition} onChange={handleChange} rows={2}
                  placeholder="e.g. 10 new enquiries a month, ranking on page 1 for..." className={`${inputBase} resize-none`} />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="When do you need this live by?" optional>
                  <input name="timeline" value={form.timeline} onChange={handleChange} placeholder="e.g. Within 4 weeks" className={inputBase} />
                </Field>
                <Field label="Any urgency or trigger event?" optional>
                  <input name="urgencyReason" value={form.urgencyReason} onChange={handleChange} placeholder="e.g. Launch event, rebrand" className={inputBase} />
                </Field>
              </div>
            </SectionCard>

            <SectionCard number={4} title="Target Audience & Competitors">
              <Field label="Who is your ideal customer?" optional>
                <textarea name="idealCustomer" value={form.idealCustomer} onChange={handleChange} rows={2} className={`${inputBase} resize-none`} />
              </Field>
              <Field label="Where are most of your customers located?" optional>
                <input name="customerLocations" value={form.customerLocations} onChange={handleChange} className={inputBase} />
              </Field>
              <Field label="1–3 competitors or businesses you admire online" optional>
                <textarea name="competitors" value={form.competitors} onChange={handleChange} rows={2}
                  placeholder="Names or links" className={`${inputBase} resize-none`} />
              </Field>
              <Field label="What do you like/dislike about their online presence?" optional>
                <textarea name="competitorLikesDislikes" value={form.competitorLikesDislikes} onChange={handleChange} rows={2} className={`${inputBase} resize-none`} />
              </Field>
            </SectionCard>

            <SectionCard number={5} title="Brand & Content Assets">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Do you have a logo?">
                  <select name="hasLogo" value={form.hasLogo} onChange={handleChange} className={inputBase}>
                    <option value="no">No, need one</option>
                    <option value="yes">Yes</option>
                  </select>
                </Field>
                <Field label="Do you have brand colors/fonts?">
                  <select name="hasBrandColors" value={form.hasBrandColors} onChange={handleChange} className={inputBase}>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Do you have photos/videos ready?">
                  <select name="hasMedia" value={form.hasMedia} onChange={handleChange} className={inputBase}>
                    <option value="no">No</option>
                    <option value="some">Some</option>
                    <option value="yes">Yes</option>
                  </select>
                </Field>
                <Field label="Do you have website copy ready?">
                  <select name="hasCopyReady" value={form.hasCopyReady} onChange={handleChange} className={inputBase}>
                    <option value="no">No, need copywriting help</option>
                    <option value="yes">Yes</option>
                  </select>
                </Field>
              </div>
            </SectionCard>

            <SectionCard number={6} title="Budget & Decision Process">
              <Field label="Estimated budget range">
                <select name="budgetRange" value={form.budgetRange} onChange={handleChange} className={inputBase}>
                  <option value="">— Select a range —</option>
                  {BUDGET_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Open to an installment plan?">
                  <select name="openToInstallments" value={form.openToInstallments} onChange={handleChange} className={inputBase}>
                    <option value="maybe">Maybe</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </Field>
                <Field label="Who else approves this project?" optional>
                  <input name="decisionMakers" value={form.decisionMakers} onChange={handleChange} placeholder="e.g. Just me, Partner, Team" className={inputBase} />
                </Field>
              </div>
            </SectionCard>

            <SectionCard number={7} title="Anything Else">
              <Field label="Anything else we should know before we get started?" optional>
                <textarea name="additionalNotes" value={form.additionalNotes} onChange={handleChange} rows={3} className={`${inputBase} resize-none`} />
              </Field>
            </SectionCard>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-primary-dark to-primary-light text-white font-bold py-3.5 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
              whileHover={loading ? {} : { y: -3, boxShadow: "0 10px 24px rgba(27,67,50,0.4)" }}
              whileTap={loading ? {} : { scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              {loading ? "Submitting..." : "Submit Onboarding Form"}
              <FaPaperPlane size={14} aria-hidden="true" />
            </motion.button>

            {submitError && (
              <motion.div
                className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4"
                role="alert"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {submitError}
              </motion.div>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
