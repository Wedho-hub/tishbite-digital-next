import LandingPageContent from "@/components/LandingPageContent";
import { LEAD_OFFERS } from "@/lib/leadOffers";

export const metadata = {
  title: "Book a Free 15-Minute Strategy Call | Tishbite Digital",
  description:
    "Book a free, no-pressure 15-minute strategy call. Tell us about your business and we'll confirm a time on WhatsApp.",
  alternates: { canonical: "https://www.tishbitedigital.co.za/call" },
  robots: { index: false, follow: true },
};

export default function CallPage() {
  return <LandingPageContent offer={LEAD_OFFERS.call} />;
}
