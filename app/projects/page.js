import ProjectsPageContent from "@/components/ProjectsPageContent";
import CaseStudiesSection from "@/components/CaseStudiesSection";

export const metadata = {
  title: "Web Design Portfolio — South Africa Digital Projects",
  description:
    "See our portfolio of website design, web development, and digital transformation projects built for South African businesses.",
  keywords: [
    "web design portfolio South Africa",
    "Tishbite Digital projects",
    "South Africa web development case studies",
    "digital transformation projects",
  ],
  alternates: { canonical: "https://www.tishbitedigital.co.za/projects" },
  openGraph: {
    title: "Portfolio: Web Design & Digital Projects",
    description: "Real projects, real results for South African businesses",
    url: "https://www.tishbitedigital.co.za/projects",
    images: [{ url: "https://www.tishbitedigital.co.za/assets/tishbiteHero.png" }],
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
