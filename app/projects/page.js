import ProjectsPageContent from "@/components/ProjectsPageContent";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import connectDB from "@/lib/db";
import Project from "@/models/Project";

export const revalidate = 300;

async function getProjects() {
  try {
    await connectDB();
    const projects = await Project.find()
      .select("title description image link createdAt")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    return projects.map((project) => ({
      ...project,
      _id: String(project._id),
      createdAt: project.createdAt?.toISOString?.() || project.createdAt,
    }));
  } catch {
    return [];
  }
}

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

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <ProjectsPageContent initialProjects={projects} />
      <CaseStudiesSection />
    </>
  );
}
