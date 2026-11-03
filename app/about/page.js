import AboutPageContent from "@/components/AboutPageContent";

export const metadata = {
  title: "About Us — South Africa Web Design Agency",
  description:
    "Tishbite Digital is a small, multi-skilled team led by founder Wellington Dhliwayo, building websites and digital growth systems for small businesses and entrepreneurs across South Africa.",
  keywords: [
    "Tishbite Digital",
    "Wellington Dhliwayo",
    "web development team South Africa",
    "digital marketing team Cape Town",
    "digital agency founder South Africa",
  ],
  alternates: { canonical: "https://www.tishbitedigital.co.za/about" },
  openGraph: {
    title: "About Tishbite Digital — A Small Team Built for Results",
    description:
      "Founded by a HyperionDev Top Student, now a small multi-skilled team building real-world applications and growing South African businesses online.",
    url: "https://www.tishbitedigital.co.za/about",
    images: [{ url: "https://www.tishbitedigital.co.za/assets/tishbiteHero.png" }],
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Wellington Dhliwayo",
  alternateName: "Wedho",
  jobTitle: "Full-Stack Web Developer & Digital Agency Founder",
  url: "https://www.tishbitedigital.co.za/about",
  sameAs: ["https://www.hyperiondev.com/portfolio/WD24080015372/"],
  worksFor: { "@type": "Organization", name: "Tishbite Digital", url: "https://www.tishbitedigital.co.za" },
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
