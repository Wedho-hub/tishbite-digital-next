import { Suspense } from "react";
import CheckoutPageContent from "@/components/CheckoutPageContent";

export const metadata = {
  title: "Secure Checkout | Tishbite Digital",
  description: "Complete your payment securely via PayFast.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-text-muted text-sm">Loading checkout...</p>
        </div>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}
