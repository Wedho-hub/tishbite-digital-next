import UnsubscribePageContent from "@/components/UnsubscribePageContent";

export const metadata = {
  title: "Unsubscribe | Tishbite Digital",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({ searchParams }) {
  const { token } = await searchParams;
  return <UnsubscribePageContent token={token} />;
}
