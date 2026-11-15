import Image from "next/image";
import PageHeader from "@/components/PageHeader";

// Internal reference only (not a page visitors are meant to land on),
// same pattern as app/blog/style-guide/page.js — noindex, but still a
// real route so it's always one click away instead of a PDF that goes
// stale in someone's downloads folder.
export const metadata = {
  title: "Tishbite Digital — Brand Guide",
  robots: { index: false, follow: false },
};

// Every value below is pulled from the same source the rest of the
// site actually renders from (app/globals.css's `@theme` tokens), not
// retyped by hand — if a color ever changes there, update the hex
// string here to match. Keeping this as plain data (rather than
// reading the CSS file at build time) is a deliberate tradeoff: it's
// one extra line to update per color change, in exchange for a page
// that has zero build-time coupling to how globals.css is structured.
const COLORS = [
  {
    group: "Primary — brand green",
    swatches: [
      { name: "Primary", className: "bg-primary", hex: "#2d6a4f", usage: "Default brand color — links, icons, primary accents." },
      { name: "Primary Dark", className: "bg-primary-dark", hex: "#1b4332", usage: "Headings, dark surfaces, buttons, the logo's dark green." },
      { name: "Primary Light", className: "bg-primary-light", hex: "#40916c", usage: "Gradients and hover states paired with Primary." },
    ],
  },
  {
    group: "Accent — brand gold",
    swatches: [
      { name: "Accent", className: "bg-accent", hex: "#f4c95d", usage: "Calls to action, highlights, the logo's gold." },
      { name: "Accent Light", className: "bg-accent-light", hex: "#ffe08a", usage: "Hover state for gold buttons/badges." },
      { name: "Accent Dark", className: "bg-accent-dark", hex: "#c49219", usage: "Text ON a light gold background (contrast-safe)." },
    ],
  },
  {
    group: "Neutrals",
    swatches: [
      { name: "Background", className: "bg-bg border border-primary/15", hex: "#f5faf7", usage: "Default page background." },
      { name: "Text Dark", className: "bg-text-dark", hex: "#122820", usage: "Body copy on light backgrounds." },
      { name: "Text Muted", className: "bg-text-muted", hex: "#5b6f67", usage: "Secondary/supporting copy." },
      { name: "Surface Dark", className: "bg-surface-dark", hex: "#0f2016", usage: "Dark section backgrounds (hero, footer)." },
      { name: "Surface Tint", className: "bg-surface-tint border border-primary/15", hex: "#eaf4ee", usage: "Subtle card/panel backgrounds on a light page." },
    ],
  },
];

const FONTS = [
  {
    name: "Montserrat",
    role: "UI & headings — the default face everywhere outside the blog",
    sample: "Tishbite Digital",
    style: { fontFamily: "var(--font-montserrat), sans-serif", fontWeight: 700 },
  },
  {
    name: "Inter",
    role: "Body copy, form labels, small print — the default base font",
    sample: "Websites, SEO and growth systems built to bring real enquiries.",
    style: { fontFamily: "var(--font-inter), sans-serif" },
  },
  {
    name: "Space Grotesk",
    role: "Hero headline only — a bolder, more distinctive display face reserved for first impressions",
    sample: "We Help South African Businesses Get More Clients Online",
    style: { fontFamily: "var(--font-space-grotesk), sans-serif", fontWeight: 700 },
  },
  {
    name: "Fraunces",
    role: "Blog article headlines only (the editorial/magazine template)",
    sample: "What Is This Altar For?",
    style: { fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontStyle: "italic" },
  },
];

function ColorSwatch({ name, className, hex, usage }) {
  return (
    <div className="flex flex-col">
      <div className={`h-16 rounded-lg mb-2 ${className}`} />
      <p className="font-bold text-primary-dark text-sm mb-0.5">{name}</p>
      <p className="font-mono text-xs text-text-muted mb-1">{hex}</p>
      <p className="text-text-muted text-xs leading-snug">{usage}</p>
    </div>
  );
}

export default function BrandGuidePage() {
  return (
    <>
      <PageHeader
        title="Tishbite Digital — Brand Guide"
        subtitle="The one-page reference for our own colors, fonts, logo rules and voice — so every future design decision has something to check against instead of being guessed from scratch."
        background="light"
      />

      <article className="py-14 bg-bg">
        <div className="container mx-auto px-4 max-w-4xl space-y-14">

          {/* ── Logo & tagline ── */}
          <section aria-labelledby="logo-heading">
            <h2 id="logo-heading" className="text-2xl font-extrabold text-primary-dark mb-4" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
              Logo &amp; Tagline
            </h2>
            <div className="flex flex-wrap items-center gap-10">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-white rounded-xl border border-primary/15 p-4">
                  <Image src="/assets/tishbiteFullLogo.png" alt="Tishbite Digital full logo" width={120} height={120} />
                </div>
                <p className="text-text-muted text-xs">Full logo — light backgrounds</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-surface-dark rounded-xl p-4">
                  <Image src="/assets/tishbiteIcon.png" alt="Tishbite Digital icon mark" width={64} height={64} />
                </div>
                <p className="text-text-muted text-xs">Icon mark — favicon, dark surfaces, small spaces</p>
              </div>
              <div>
                <p className="font-bold text-primary-dark text-sm mb-1">Tagline</p>
                <p className="text-[#8a6500] font-semibold text-lg italic">&ldquo;Growing Together&rdquo;</p>
                <p className="text-text-muted text-xs mt-1 max-w-56">
                  Used under the logo in the footer and navbar — not restated in page body copy.
                </p>
              </div>
            </div>
          </section>

          {/* ── Colors ── */}
          <section aria-labelledby="colors-heading">
            <h2 id="colors-heading" className="text-2xl font-extrabold text-primary-dark mb-4" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
              Color Palette
            </h2>
            <div className="space-y-8">
              {COLORS.map((group) => (
                <div key={group.group}>
                  <p className="text-xs font-bold uppercase tracking-wide text-primary mb-3">{group.group}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    {group.swatches.map((s) => <ColorSwatch key={s.name} {...s} />)}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-text-muted text-xs mt-4">
              Defined once in <code className="bg-primary/8 px-1.5 py-0.5 rounded">app/globals.css</code> under <code className="bg-primary/8 px-1.5 py-0.5 rounded">@theme</code> — never hardcode a hex value in a component when one of these tokens already matches.
            </p>
          </section>

          {/* ── Typography ── */}
          <section aria-labelledby="type-heading">
            <h2 id="type-heading" className="text-2xl font-extrabold text-primary-dark mb-4" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
              Typography
            </h2>
            <div className="space-y-6">
              {FONTS.map((f) => (
                <div key={f.name} className="border-l-4 border-l-accent pl-4">
                  <p className="font-bold text-primary-dark text-sm mb-0.5">{f.name}</p>
                  <p className="text-text-muted text-xs mb-2">{f.role}</p>
                  <p className="text-xl text-text-dark" style={f.style}>{f.sample}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Logo usage rules ── */}
          <section aria-labelledby="rules-heading">
            <h2 id="rules-heading" className="text-2xl font-extrabold text-primary-dark mb-4" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
              Logo Usage Rules
            </h2>
            <ul className="space-y-2 text-text-muted text-sm list-none pl-0">
              <li className="flex gap-2"><span className="text-primary font-bold" aria-hidden="true">✓</span> Use the full logo on light backgrounds, the icon mark alone only where space is tight (favicon, social avatar, app icon).</li>
              <li className="flex gap-2"><span className="text-primary font-bold" aria-hidden="true">✓</span> Keep clear space around the logo of at least the height of the &ldquo;T&rdquo; icon mark on every side.</li>
              <li className="flex gap-2"><span className="text-primary font-bold" aria-hidden="true">✓</span> On dark surfaces (hero, footer), place it against Surface Dark or Primary Dark, never a busy photo without a scrim.</li>
              <li className="flex gap-2"><span className="text-red-500 font-bold" aria-hidden="true">✗</span> Never recolor the logo outside Primary/Accent, stretch it off its original aspect ratio, or add a drop shadow/outline not already part of the file.</li>
              <li className="flex gap-2"><span className="text-red-500 font-bold" aria-hidden="true">✗</span> Never place the full logo smaller than roughly 32px tall — below that, use the icon mark instead.</li>
            </ul>
          </section>

          {/* ── Voice ── */}
          <section aria-labelledby="voice-heading">
            <h2 id="voice-heading" className="text-2xl font-extrabold text-primary-dark mb-4" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
              Voice
            </h2>
            <p className="text-text-muted text-sm leading-relaxed mb-4">
              This describes how the site already writes, consistently, across the homepage, services and about pages — it&rsquo;s a record of the existing pattern to stay consistent with, not a new rulebook:
            </p>
            <ul className="space-y-2 text-text-muted text-sm list-none pl-0">
              <li className="flex gap-2"><span className="text-accent-dark font-bold" aria-hidden="true">—</span> <strong className="text-text-dark">Direct, not hypey.</strong> Lead with the specific problem a service solves, then the specific thing we do about it (see every service&rsquo;s Problem/Solution/Result structure in <code className="bg-primary/8 px-1 rounded text-xs">lib/products.js</code>).</li>
              <li className="flex gap-2"><span className="text-accent-dark font-bold" aria-hidden="true">—</span> <strong className="text-text-dark">Trade-honest.</strong> &ldquo;Measured, tested, made to last&rdquo; — the founder&rsquo;s background as a tradesman before a developer shows up as a preference for concrete claims over vague ones.</li>
              <li className="flex gap-2"><span className="text-accent-dark font-bold" aria-hidden="true">—</span> <strong className="text-text-dark">Results over aesthetics.</strong> Copy consistently points at outcomes — enquiries, leads, bookings — rather than describing the work as merely good-looking.</li>
              <li className="flex gap-2"><span className="text-accent-dark font-bold" aria-hidden="true">—</span> <strong className="text-text-dark">South African and specific.</strong> Real currency (ZAR), real local context (Google Business Profile, WhatsApp as a sales channel, load-shedding-aware hosting choices) rather than generic global SaaS language.</li>
            </ul>
          </section>

        </div>
      </article>
    </>
  );
}
