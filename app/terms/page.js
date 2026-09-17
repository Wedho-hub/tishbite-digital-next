import TermsPageContent from "@/components/TermsPageContent";

export const metadata = {
  title: "Terms of Service | Tishbite Digital",
  description:
    "The terms that apply when you use the Tishbite Digital website or engage us for web design, SEO, advertising or other digital services.",
  alternates: { canonical: "https://www.tishbitedigital.co.za/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return <TermsPageContent />;
}
