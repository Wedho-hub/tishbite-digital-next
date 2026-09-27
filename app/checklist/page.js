import LandingPageContent from "@/components/LandingPageContent";
import { LEAD_OFFERS } from "@/lib/leadOffers";

export const metadata = {
  title: "7 Things Your Business Page Needs | Tishbite Digital",
  description:
    "Free checklist: the 7 things your website or Facebook/Instagram page needs to actually get you customers.",
  alternates: { canonical: "https://www.tishbitedigital.co.za/checklist" },
  robots: { index: false, follow: true },
};

export default function ChecklistPage() {
  return <LandingPageContent offer={LEAD_OFFERS.checklist} />;
}
