"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import PageHeader from "@/components/PageHeader";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://tishbitedigital-api.onrender.com";

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

const getDescription = (project) => {
  const source = `${project?.title || ""} ${project?.description || ""}`;
  const match = OPTIMIZED_DESCRIPTIONS.find((e) => e.matcher.test(source));
  return match?.content || `**Problem:** Many businesses struggle to convert online attention into qualified leads.

**Solution:** We design and develop structured digital experiences that improve visibility, trust, and conversion pathways.

**Result Focus:** Better enquiry quality, clearer communication, and stronger growth potential from digital channels.

**SEO & GEO Angle:** Search-intent aligned content and local relevance signals support stronger ranking and discovery performance.`;
};

const getImageUrl = (image) => {
  if (!image) return "/assets/tishbiteHero.png";
  if (image.startsWith("http") || image.startsWith("/assets")) return image;
  return `${API_URL}${image}`;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

function ProjectCard({ project, isExpanded, onToggle }) {
  const imageUrl = getImageUrl(project.image);
  const fullDesc = getDescription(project);
  const collapsed = fullDesc.split("\n\n").filter(Boolean).slice(0, 2).join("\n\n");
  const canExpand = fullDesc !== collapsed;

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.01 }}
      className="flex flex-col bg-white rounded-2xl border border-primary/8 shadow-sm hover:shadow-lg overflow-hidden transition-shadow duration-300"
    >
      <div className="relative aspect-16/10 overflow-hidden">
        <Image
          src={imageUrl}
          alt={project.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3
            className="font-bold text-primary-dark text-base leading-snug"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {project.title}
          </h3>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              title={`Visit ${project.title}`}
              className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 no-underline text-sm"
            >
              🔗
            </a>
          )}
        </div>

        <div className={`flex-1 text-sm text-text-muted leading-relaxed overflow-hidden transition-all duration-300 prose prose-sm max-w-none prose-strong:text-text-dark prose-headings:font-bold prose-headings:text-primary-dark ${isExpanded ? "" : "line-clamp-6"}`}>
          <ReactMarkdown>{isExpanded ? fullDesc : collapsed}</ReactMarkdown>
        </div>

        {canExpand && (
          <button
            type="button"
            className="mt-3 self-start text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
            onClick={onToggle}
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        )}
      </div>
    </motion.article>
  );
}

export default function ProjectsPageContent() {
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/projects`);
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

  const toggleExpand = (key) =>
    setExpanded((p) => ({ ...p, [key]: !p[key] }));

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
              Each project is built to improve visibility, streamline operations, and support measurable business growth.
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
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {projects.map((project) => {
                const key = project._id || project.title;
                return (
                  <ProjectCard
                    key={key}
                    project={project}
                    isExpanded={Boolean(expanded[key])}
                    onToggle={() => toggleExpand(key)}
                  />
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
