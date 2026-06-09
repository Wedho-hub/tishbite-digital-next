import AboutPageContent from "@/components/AboutPageContent";

export const metadata = {
  title: "About Tishbite Digital — Cape Town Web Design & Digital Marketing Agency",
  description:
    "Tishbite Digital is a Cape Town digital agency founded by Wellington Dhliwayo. We build lead-generating websites, local SEO systems, and growth automation for South African service businesses.",
  alternates: { canonical: "https://tishbitedigital.co.za/about" },
  openGraph: {
    title: "Wellington Dhliwayo — Web Developer & Founder | Tishbite Digital",
    description:
      "HyperionDev Top Student building real-world full-stack applications and growing Cape Town businesses online.",
    url: "https://tishbitedigital.co.za/about",
    images: [{ url: "https://tishbitedigital.co.za/assets/tishbiteHero.png" }],
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Wellington Dhliwayo",
  alternateName: "Wedho",
  jobTitle: "Full-Stack Web Developer & Digital Agency Founder",
  url: "https://tishbitedigital.co.za/about",
  sameAs: ["https://www.hyperiondev.com/portfolio/WD24080015372/"],
  worksFor: { "@type": "Organization", name: "Tishbite Digital", url: "https://tishbitedigital.co.za" },
  alumniOf: { "@type": "EducationalOrganization", name: "HyperionDev" },
  address: { "@type": "PostalAddress", addressLocality: "Cape Town", addressCountry: "ZA" },
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <AboutPageContent />
    </>
  );
}
