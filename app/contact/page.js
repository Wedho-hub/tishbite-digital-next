import ContactPageContent from "@/components/ContactPageContent";

export const metadata = {
  title: "Get Your Free Website & SEO Audit | Contact Tishbite Digital",
  description:
    "Schedule your free website and SEO audit. Ask about our digital growth systems for Cape Town service businesses. Chat via WhatsApp or fill out our form.",
  alternates: { canonical: "https://www.tishbitedigital.co.za/contact" },
  openGraph: {
    title: "Get Your Free Website & SEO Audit",
    description: "Schedule your free audit today",
    url: "https://www.tishbitedigital.co.za/contact",
    images: [{ url: "https://www.tishbitedigital.co.za/assets/tishbiteHero.png" }],
  },
};

export default function ContactPage() {
  return <ContactPageContent />;
}
