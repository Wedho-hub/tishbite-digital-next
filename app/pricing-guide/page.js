import LandingPageContent from "@/components/LandingPageContent";
import { LEAD_OFFERS } from "@/lib/leadOffers";

export const metadata = {
  title: "What a Website or Social Media Plan Really Costs | Tishbite Digital",
  description:
    "Free pricing guide: real starting prices for a website or social media plan, what drives the cost, and how to budget for it.",
  alternates: { canonical: "https://www.tishbitedigital.co.za/pricing-guide" },
  robots: { index: false, follow: true },
};

export default function PricingGuidePage() {
  return <LandingPageContent offer={LEAD_OFFERS["pricing-guide"]} />;
}
