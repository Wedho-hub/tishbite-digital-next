"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaCheckCircle, FaLightbulb, FaRocket, FaUsers,
  FaReact, FaNodeJs, FaGitAlt, FaHtml5, FaCss3Alt,
  FaDatabase, FaServer, FaExternalLinkAlt, FaMedal,
  FaArrowRight, FaCode,
} from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss } from "react-icons/si";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const vp = { once: true, amount: 0.2 };

const SKILLS = [
  { Icon: FaReact,    label: "React.js",           color: "#61dafb", bg: "#e8f9ff" },
  { Icon: FaNodeJs,   label: "Node.js",             color: "#3c873a", bg: "#edf7ed" },
  { Icon: FaServer,   label: "Express.js",          color: "#1b4332", bg: "#eef6f1" },
  { Icon: FaDatabase, label: "MongoDB",             color: "#13aa52", bg: "#e8f7ee" },
  { Icon: FaCode,     label: "JavaScript",          color: "#f0db4f", bg: "#fffbea" },
  { Icon: FaHtml5,    label: "HTML5",               color: "#e34c26", bg: "#fdf0ed" },
  { Icon: FaCss3Alt,  label: "CSS3 / Bootstrap",    color: "#264de4", bg: "#eef0fd" },
  { Icon: FaGitAlt,     label: "Git & GitHub",        color: "#f05032", bg: "#fdf0ee" },
  { Icon: SiNextdotjs, label: "Next.js",              color: "#000000", bg: "#f0f0f0" },
  { Icon: SiTailwindcss, label: "Tailwind CSS",       color: "#38bdf8", bg: "#e0f6ff" },
];

const VALUES = [
  { Icon: FaCheckCircle, title: "Quality First",       body: "Every deliverable meets a professional standard. No shortcuts, no compromises on code or business outcomes." },
  { Icon: FaLightbulb,   title: "Continuous Learning", body: "Technology moves fast. Staying current with best practices and emerging tools keeps every client's solution modern and effective." },
  { Icon: FaUsers,       title: "Partnership",         body: "Clients are treated as long-term partners. Transparent communication and honest reporting are non-negotiable." },
  { Icon: FaRocket,      title: "Measurable Results",  body: "Strategies are tied to real KPIs: enquiries, rankings, conversions. Beautiful design without outcomes is not enough." },
];

const SERVICES = [
  { title: "Full-Stack Web Development", body: "End-to-end MERN stack applications — from responsive front-end UIs to REST APIs, databases, authentication, and admin dashboards." },
  { title: "SEO & Digital Marketing",    body: "On-page SEO, Google Business optimisation, and strategic content that drives qualified local traffic and enquiries." },
  { title: "Digital Strategy & Brand Identity", body: "Visual identity systems and digital roadmaps that position businesses credibly and consistently across all channels." },
  { title: "Automation & CRM Integration", body: "Custom automation workflows and CRM setups that reduce manual follow-up and increase sales pipeline efficiency." },
];

function Eyebrow({ children, light = false }) {
  return (
    <p className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-3 ${light ? "bg-accent/15 border border-accent/30 text-accent" : "bg-primary/10 border border-primary/20 text-primary"}`}>
      {children}
    </p>
  );
}

function SectionTitle({ id, children, light = false }) {
  return (
    <h2
      id={id}
      className={`text-3xl lg:text-4xl font-extrabold leading-tight mb-4 ${light ? "text-white" : "text-primary-dark"}`}
      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
    >
      {children}
    </h2>
  );
}

export default function AboutPageContent() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ── */}
      <motion.section
        className="py-16 bg-gradient-to-br from-primary-dark via-primary to-primary-light text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.p
            className="inline-flex items-center px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-extrabold uppercase tracking-wider mb-4"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Full-Stack Web Developer · Digital Agency Founder · Cape Town, SA
          </motion.p>
          <motion.h1
            className="text-4xl lg:text-5xl font-extrabold text-white mb-3 leading-tight"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            About Tishbite Digital
          </motion.h1>
          <motion.p
            className="text-white/70 text-base max-w-2xl mx-auto"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Building modern web applications and empowering South African businesses to compete and grow online.
          </motion.p>
        </div>
      </motion.section>

      {/* ── Founder Story ── */}
      <section className="py-16 bg-bg" aria-labelledby="founder-heading">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            className="flex flex-col lg:flex-row items-center gap-10"
          >
            <motion.div variants={fadeUp} className="lg:w-1/2 flex flex-col">
              <Eyebrow>Meet the Founder</Eyebrow>
              <SectionTitle id="founder-heading">Wellington Dhliwayo</SectionTitle>
              <div className="space-y-4 text-text-muted text-base leading-relaxed">
                <p>
                  I am a <strong className="text-text-dark">full-stack web developer</strong> and founder of Tishbite Digital, based in Cape Town. I graduated as a <strong className="text-text-dark">top student at HyperionDev</strong>, where I completed an intensive web development programme covering modern JavaScript, React, Node.js, and full-stack application architecture.
                </p>
                <p>
                  I built Tishbite Digital to bridge a real gap: small and growing businesses across South Africa deserve the same digital quality as large corporates. Every system I deliver — from websites and SEO to CRM automation — is engineered to produce <strong className="text-text-dark">measurable results</strong>, not just aesthetics.
                </p>
                <p>
                  Inspired by the story of Elijah from the small town of Tishbe, I believe <strong className="text-text-dark">great voices can rise from unexpected places</strong>. Technology and a commitment to continuous learning are the tools that make this possible — and every system I build is designed to produce results that last.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="lg:w-1/2 text-center">
              <div className="relative inline-block">
                <Image
                  src="/assets/profilePic.jpg"
                  alt="Wellington Dhliwayo — Founder of Tishbite Digital, web developer Cape Town"
                  width={350}
                  height={350}
                  className="rounded-2xl shadow-xl object-cover"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 text-text-muted text-sm font-semibold">Founder &amp; Full-Stack Developer</p>
              <p className="text-text-muted text-sm italic mt-1">Wellington Dhliwayo (Wedho)</p>

              <a
                href="https://www.hyperiondev.com/portfolio/WD24080015372/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Wellington's verified HyperionDev portfolio (opens in new tab)"
                className="mt-4 inline-flex items-center gap-3 bg-white border border-accent/30 rounded-xl px-4 py-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 no-underline"
              >
                <FaMedal className="text-accent text-xl" aria-hidden="true" />
                <span>
                  <strong className="block text-primary-dark text-sm">Top Student · HyperionDev</strong>
                  <span className="text-text-muted text-xs">View Verified Portfolio</span>
                </span>
                <FaExternalLinkAlt className="text-text-muted text-xs ml-auto" aria-hidden="true" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="py-16 bg-white" aria-labelledby="stack-heading">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="text-center flex flex-col items-center mb-10">
            <Eyebrow>Developer Profile</Eyebrow>
            <SectionTitle id="stack-heading">Technology Stack</SectionTitle>
            <p className="text-text-muted text-base max-w-lg">
              Technologies I work with daily to build production-ready web applications.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            role="list"
            aria-label="Core technology skills"
          >
            {SKILLS.map(({ Icon, label, color, bg }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                role="listitem"
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-primary/8 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                style={{ backgroundColor: bg }}
              >
                <Icon className="text-3xl" style={{ color }} aria-hidden="true" />
                <span className="text-sm font-semibold text-text-dark text-center">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Credentials ── */}
      <section className="py-16 bg-bg" aria-labelledby="credentials-heading">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="text-center flex flex-col items-center mb-10">
            <Eyebrow>Verified Credentials</Eyebrow>
            <SectionTitle id="credentials-heading">Education &amp; Proof of Work</SectionTitle>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
          >
            {[
              {
                bg: "bg-primary/10",
                icon: FaMedal, iconColor: "text-primary",
                title: "HyperionDev — Top Student",
                body: "Completed a full-stack web development programme at HyperionDev, achieving top student recognition. The programme covered JavaScript, React, Node.js, REST APIs, databases, and software engineering principles.",
                linkHref: "https://www.hyperiondev.com/portfolio/WD24080015372/",
                linkLabel: "View Verified Portfolio",
              },
              {
                bg: "bg-accent/10",
                icon: FaRocket, iconColor: "text-[#b8860b]",
                title: "Live Production Application",
                body: "This website is a fully deployed, production-grade MERN stack application built from scratch — featuring authentication, a CMS, PayFast payment integration, REST API, SEO, and a custom admin dashboard.",
                linkHref: "https://github.com/Wedho-hub",
                linkLabel: "GitHub: Wedho-hub",
              },
            ].map(({ bg, icon: Icon, iconColor, title, body, linkHref, linkLabel }) => (
              <motion.div key={title} variants={fadeUp} className="bg-white rounded-2xl p-6 border border-primary/8 shadow-sm">
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`${iconColor} text-xl`} aria-hidden="true" />
                </div>
                <h3 className="font-bold text-primary-dark text-base mb-2" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                  {title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed mb-4">{body}</p>
                <a
                  href={linkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:text-primary-dark transition-colors no-underline"
                >
                  {linkLabel} <FaExternalLinkAlt size={11} aria-hidden="true" />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="py-16 bg-white" aria-labelledby="values-heading">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="text-center flex flex-col items-center mb-10">
            <Eyebrow>How We Operate</Eyebrow>
            <SectionTitle id="values-heading">Core Values</SectionTitle>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {VALUES.map(({ Icon, title, body }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="flex flex-col items-center text-center p-6 bg-bg rounded-2xl border border-primary/8 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="text-primary text-2xl" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-primary-dark text-base mb-2" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                  {title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed m-0">{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── What We Deliver ── */}
      <section className="py-16 bg-bg" aria-labelledby="services-heading">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="text-center flex flex-col items-center mb-10">
            <Eyebrow>Service Capabilities</Eyebrow>
            <SectionTitle id="services-heading">What We Deliver</SectionTitle>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {SERVICES.map(({ title, body }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="bg-white rounded-2xl p-6 border-l-4 border-primary border border-primary/8 shadow-sm"
              >
                <h3 className="font-bold text-primary-dark text-base mb-2" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                  {title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed m-0">{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-gradient-to-r from-primary-dark via-primary to-primary-light" aria-labelledby="about-cta-heading">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="flex flex-col items-center">
            <Eyebrow light>Let's Work Together</Eyebrow>
            <h2
              id="about-cta-heading"
              className="text-3xl lg:text-4xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Ready to Build Something Great?
            </h2>
            <p className="text-white/70 text-base max-w-lg mb-6">
              Whether you need a full-stack developer or a growth partner for your business — let's talk about what's possible.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-light text-primary-dark font-bold transition-colors no-underline"
              >
                Get In Touch <FaArrowRight aria-hidden="true" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold border border-white/20 transition-colors no-underline"
              >
                View Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
