"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { FaArrowRight, FaTimes, FaGlobe } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";

const FALLBACK_PROJECTS = [
  {
    _id: "fallback-maffy-online",
    title: "Maffy Online",
    description: "Corporate website designed to improve trust, clarify service offers, and support more inbound HR and recruitment enquiries.",
    image: "/assets/MaffyPic.png",
    link: "https://maffyonline.netlify.app/",
  },
  {
    _id: "fallback-fog-educare",
    title: "FOG Educare",
    description: "Education-focused website with a clean user journey to help parents quickly understand services and contact the school.",
    image: "/assets/fogPic.png",
  },
  {
    _id: "fallback-tool-tracking",
    title: "Tool Tracking App",
    description: "Operational system for tracking tool movement, reducing losses, and improving accountability in day-to-day workflows.",
    image: "/assets/toolTrackPic.png",
    link: "https://tooltracking.netlify.app/",
  },
  {
    _id: "fallback-church-website",
    title: "Church Website",
    description: "Community website built to improve communication, event visibility, and online reach beyond physical gatherings.",
    image: "/assets/churchWebPic.png",
    link: "https://inkosiyezasdachurch.netlify.app/",
  },
];

const OPTIMIZED_DESCRIPTIONS = [
  {
    matcher: /maffy/i,
    content: `**Problem:** Maffy Online needed a stronger digital footprint to attract more qualified recruitment and HR leads.

**Solution:** We designed and launched a conversion-focused corporate website with clear service positioning, SEO-ready structure, and trust-building content.

**Result Focus:** Better online credibility, stronger service clarity, and improved lead quality from organic search and direct website enquiries.

**SEO & GEO Angle:** Location-aware service messaging and keyword-focused page structure support better visibility for HR and recruitment-related searches in South Africa.`,
  },
  {
    matcher: /(tool tracker|tool tracking)/i,
    content: `**Problem:** Teams were losing tools and productivity because inventory movement was not tracked reliably.

**Solution:** We built a full-stack tool tracking system with structured records, assignment visibility, and operational accountability workflows.

**Result Focus:** Fewer losses, faster operational control, and clearer responsibility across teams.

**SEO & GEO Angle:** The project demonstrates practical business software for operations-heavy industries, attracting search intent around inventory management and tool accountability.`,
  },
  {
    matcher: /(church|inkosi)/i,
    content: `**Problem:** The church needed an accessible digital space to communicate updates and engage members beyond physical gatherings.

**Solution:** We created a modern, mobile-friendly church website with clear content pathways for sermons, events, and community updates.

**Result Focus:** Stronger digital engagement, easier communication with members, and improved discoverability for visitors searching online.

**SEO & GEO Angle:** Structured content and local relevance signals help improve search visibility for faith-community and regional church discovery queries.`,
  },
  {
    matcher: /(nozuko|fog educare|educare)/i,
    content: `**Problem:** The education centre needed to build trust with parents while improving visibility for local early childhood education searches.

**Solution:** We delivered a full-stack, parent-friendly website with clear programme information, admissions pathways, and SEO-optimized content architecture.

**Result Focus:** Better parent confidence, smoother enquiry flow, and stronger digital visibility for education-related local searches.

**SEO & GEO Angle:** GEO-focused messaging and location-aware education keywords improve discoverability for nearby families looking for trusted childcare options.`,
  },
];

const isFallbackProject = (project) =>
  typeof project?._id === "string" && project._id.startsWith("fallback-");

// Real, DB-backed projects always show exactly what was typed into the admin
// panel. The hardcoded enriched copy below is only used for the static
// FALLBACK_PROJECTS placeholders (shown when the DB is empty/unreachable),
// never as a substitute for a real project's own description.
const getDescription = (project) => {
  if (isFallbackProject(project)) {
    const source = `${project?.title || ""} ${project?.description || ""}`;
    const match = OPTIMIZED_DESCRIPTIONS.find((e) => e.matcher.test(source));
    if (match) return match.content;
  }
  return String(project?.description || "").trim() || "No description provided yet.";
};

const getImageUrl = (image) => {
  if (!image) return "/assets/tishbiteHero.png";
  return image;
};

// Strips Markdown syntax down to plain text for the short card teaser —
// the full Markdown is only ever rendered inside the modal, so headings/
// lists/bold marks never get cut off mid-way in the compact card view.
function toPlainPreview(markdown, maxLen = 150) {
  const plain = String(markdown || "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[#>*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen).replace(/\s+\S*$/, "")}…`;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

function ProjectCard({ project, layoutId, isOpen, onOpen }) {
  const imageUrl = getImageUrl(project.image);
  const preview = toPlainPreview(getDescription(project));

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(project)}
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      layoutId={layoutId}
      aria-haspopup="dialog"
      aria-label={`View full story for ${project.title}`}
      style={{ visibility: isOpen ? "hidden" : "visible" }}
      className="group relative flex flex-col text-left bg-white rounded-2xl border border-primary/8 shadow-sm hover:shadow-xl overflow-hidden transition-shadow duration-300 cursor-pointer"
    >
      <div className="relative aspect-16/10 overflow-hidden">
        <Image
          src={imageUrl}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-primary-dark/75 via-primary-dark/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-primary-dark font-bold text-sm shadow-lg">
            View Full Story <FaArrowRight size={12} />
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-6">
        <h3
          className="font-bold text-primary-dark text-base leading-snug mb-2"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          {project.title}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed flex-1">{preview}</p>
        <motion.span
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary"
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          Tap to view full story <FaArrowRight size={10} />
        </motion.span>
      </div>
    </motion.button>
  );
}

function ProjectModal({ project, layoutId, onClose }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const fullDesc = getDescription(project);
  const imageUrl = getImageUrl(project.image);
  const titleId = `project-modal-title-${project._id || project.title}`;

  return (
    <motion.div
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-primary-dark/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        layoutId={layoutId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Floating close button — a sibling of the scroll area, so it
            always stays pinned in place no matter how far the description
            below is scrolled. */}
        <motion.button
          type="button"
          onClick={onClose}
          aria-label="Close and return to project card"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 16 }}
          whileHover={{ scale: 1.12, rotate: 90, backgroundColor: "#dc2626" }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-primary-dark text-white flex items-center justify-center shadow-lg"
        >
          <FaTimes size={15} />
        </motion.button>

        <div className="relative h-64 sm:h-80 shrink-0">
          <Image
            src={imageUrl}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 700px"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary-dark/75 via-primary-dark/10 to-transparent" />
          <h2
            id={titleId}
            className="absolute bottom-5 left-6 right-6 text-white text-2xl sm:text-3xl font-extrabold leading-tight"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {project.title}
          </h2>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto">
          <div
            className="prose prose-sm sm:prose-base max-w-none text-text-muted
              prose-p:my-2.5 prose-strong:text-text-dark prose-strong:font-bold
              prose-headings:font-bold prose-headings:text-primary-dark prose-headings:mt-4 prose-headings:mb-2
              prose-ul:my-2.5 prose-ul:pl-5 prose-li:my-1 prose-ol:my-2.5 prose-ol:pl-5
              prose-a:text-primary prose-a:font-semibold"
          >
            <ReactMarkdown>{fullDesc}</ReactMarkdown>
          </div>

          {project.link && (
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-primary-dark to-primary-light text-white font-bold text-sm no-underline mt-6"
              whileHover={{ y: -3, boxShadow: "0 10px 24px rgba(27,67,50,0.4)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <FaGlobe size={13} /> Visit Live Site
              <motion.span
                initial={false}
                whileHover={{ x: 3 }}
                style={{ display: "inline-flex" }}
              >
                <FaArrowRight size={11} />
              </motion.span>
            </motion.a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectsPageContent() {
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error();
        const data = await res.json();
        const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        if (mounted) {
          if (list.length > 0) {
            setProjects(list);
            setUsedFallback(false);
          } else {
            setUsedFallback(true);
          }
        }
      } catch {
        if (mounted) setUsedFallback(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const keyOf = (project) => project._id || project.title;
  const selectedKey = selected ? keyOf(selected) : null;

  return (
    <>
      <PageHeader
        title="Our Projects"
        subtitle="See some of the projects we've delivered for our clients."
        background="light"
      />

      <section className="py-14 bg-bg" role="region" aria-labelledby="projects-heading">
        <div className="container mx-auto px-4 max-w-7xl">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65 }}
            className="mb-10"
          >
            <h2
              id="projects-heading"
              className="text-3xl font-extrabold text-primary-dark mb-2"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Selected Work
            </h2>
            <p className="text-text-muted text-base max-w-xl">
              Each project is built to improve visibility, streamline operations, and support measurable business growth. Click any project for the full story.
            </p>
          </motion.div>

          {loading && (
            <p className="text-text-muted text-sm text-center py-8" aria-live="polite">
              Loading portfolio...
            </p>
          )}

          {!loading && usedFallback && (
            <p className="text-text-muted text-sm text-center mb-6" aria-live="polite">
              Showing featured projects while we refresh the latest portfolio data.
            </p>
          )}

          {!loading && projects.length === 0 && (
            <p className="text-text-muted text-sm text-center py-8">
              No projects available right now. Please check back soon.
            </p>
          )}

          {!loading && projects.length > 0 && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {projects.map((project) => {
                const key = keyOf(project);
                return (
                  <ProjectCard
                    key={key}
                    project={project}
                    layoutId={`project-card-${key}`}
                    isOpen={selectedKey === key}
                    onOpen={setSelected}
                  />
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <ProjectModal
            project={selected}
            layoutId={`project-card-${selectedKey}`}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
