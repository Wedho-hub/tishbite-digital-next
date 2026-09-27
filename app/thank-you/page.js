import ThankYouPageContent from "@/components/ThankYouPageContent";

export const metadata = {
  title: "Thank You | Tishbite Digital",
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({ searchParams }) {
  const { offer } = await searchParams;
  return <ThankYouPageContent offerSlug={offer} />;
}
