import OnboardingPageContent from "@/components/OnboardingPageContent";

export const metadata = {
  title: "New Client Onboarding",
  description: "Tell us about your business so Tishbite Digital can prepare an accurate quote and a tailored growth strategy.",
  keywords: [
    "new client onboarding",
    "request a quote Cape Town",
    "Tishbite Digital onboarding form",
  ],
  alternates: { canonical: "https://www.tishbitedigital.co.za/onboarding" },
  openGraph: {
    title: "New Client Onboarding",
    description: "Tell us about your business so we can prepare an accurate quote and a tailored growth strategy.",
    url: "https://www.tishbitedigital.co.za/onboarding",
    images: [{ url: "https://www.tishbitedigital.co.za/assets/tishbiteHero.png" }],
  },
};

export default function OnboardingPage() {
  return <OnboardingPageContent />;
}
