import ProjectsPageContent from "@/components/ProjectsPageContent";
import CaseStudiesSection from "@/components/CaseStudiesSection";

export const metadata = {
  title: "Portfolio: Web Design & Digital Projects | Cape Town",
  description:
    "See our portfolio of website design, web development, and digital transformation projects built for Cape Town and South African businesses.",
  alternates: { canonical: "https://tishbitedigital.co.za/projects" },
  openGraph: {
    title: "Portfolio: Web Design & Digital Projects",
    description: "Real projects, real results for Cape Town businesses",
    url: "https://tishbitedigital.co.za/projects",
    images: [{ url: "https://tishbitedigital.co.za/assets/tishbiteHero.png" }],
  },
};

export default function ProjectsPage() {
  return (
    <>
      <ProjectsPageContent />
      <CaseStudiesSection />
    </>
  );
}
