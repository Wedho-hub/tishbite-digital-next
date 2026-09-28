import LandingPageContent from "@/components/LandingPageContent";
import { LEAD_OFFERS } from "@/lib/leadOffers";

export const metadata = {
  title: "Free Digital Presence Audit | Tishbite Digital",
  description:
    "Get a free review of your website and socials, plus 3 fixes you can act on within 48 hours — no obligation.",
  alternates: { canonical: "https://www.tishbitedigital.co.za/audit" },
  robots: { index: false, follow: true },
};

export default function AuditPage() {
  return <LandingPageContent offer={LEAD_OFFERS.audit} />;
}
