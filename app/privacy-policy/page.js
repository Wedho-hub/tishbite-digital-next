import PrivacyPolicyPageContent from "@/components/PrivacyPolicyPageContent";

export const metadata = {
  title: "Privacy Policy | Tishbite Digital",
  description:
    "How Tishbite Digital collects, uses and protects your personal information under South Africa's POPIA, including data shared via our contact form and PayFast checkout.",
  alternates: { canonical: "https://www.tishbitedigital.co.za/privacy-policy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyPageContent />;
}
