import HowWeWorkPageContent from "@/components/HowWeWorkPageContent";

export const metadata = {
  title: "Our Process: How We Build Digital Growth Systems",
  description:
    "Discover our transparent, collaborative 4-step process: Discovery, Strategy, Development, and Launch. Built to deliver measurable results for Cape Town businesses.",
  alternates: { canonical: "https://tishbitedigital.co.za/how-we-work" },
  openGraph: {
    title: "Our Process: How We Build Digital Growth Systems",
    description:
      "Transparent, collaborative, results-focused — see how Tishbite Digital turns your goals into a clear action plan.",
    url: "https://tishbitedigital.co.za/how-we-work",
    images: [{ url: "https://tishbitedigital.co.za/assets/tishbiteHero.png" }],
  },
};

export default function HowWeWorkPage() {
  return <HowWeWorkPageContent />;
}
