import ServicesPageContent from "@/components/ServicesPageContent";

export const metadata = {
  title: "Website Design, SEO & Marketing in Cape Town",
  description:
    "Website design, SEO, ads, and WhatsApp automation built to turn Cape Town businesses into lead-generating machines.",
  keywords: [
    "website design Cape Town",
    "SEO services",
    "digital marketing",
    "lead generation",
    "WhatsApp marketing",
    "web development South Africa",
  ],
  alternates: {
    canonical: "https://www.tishbitedigital.co.za/services",
  },
  openGraph: {
    title: "Website Design, SEO & Digital Marketing Services",
    description:
      "Growth-focused digital services for Cape Town businesses.",
    url: "https://www.tishbitedigital.co.za/services",
    images: [{ url: "https://www.tishbitedigital.co.za/assets/tishbiteHero.png" }],
  },
};

const servicesStructuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Digital Services — Tishbite Digital",
  description:
    "Website design, SEO, digital marketing, and automation services for Cape Town businesses.",
  url: "https://www.tishbitedigital.co.za/services",
  provider: { "@id": "https://www.tishbitedigital.co.za/#organization" },
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Lead-Generating Website Development" },
    { "@type": "ListItem", position: 2, name: "Local SEO & Google Visibility" },
    { "@type": "ListItem", position: 3, name: "WhatsApp & CRM Automation" },
    { "@type": "ListItem", position: 4, name: "Meta & Google Ads Management" },
    { "@type": "ListItem", position: 5, name: "Brand Identity & Design" },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesStructuredData) }}
      />
      <ServicesPageContent />
    </>
  );
}
