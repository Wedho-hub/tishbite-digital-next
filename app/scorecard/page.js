import LandingPageContent from "@/components/LandingPageContent";
import ScorecardQuiz from "@/components/ScorecardQuiz";
import { LEAD_OFFERS } from "@/lib/leadOffers";

export const metadata = {
  title: "Is Your Business Invisible Online? | Tishbite Digital",
  description:
    "Take our 60-second, 10-question quiz to see your Online Visibility Score and get your full breakdown by email.",
  alternates: { canonical: "https://www.tishbitedigital.co.za/scorecard" },
  robots: { index: false, follow: true },
};

export default function ScorecardPage() {
  const offer = LEAD_OFFERS.scorecard;
  return <LandingPageContent offer={offer} quizSlot={<ScorecardQuiz offer={offer} />} />;
}
