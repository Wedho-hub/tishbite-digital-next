import { Suspense } from "react";
import PaymentCancelContent from "@/components/PaymentCancelContent";

export const metadata = {
  title: "Payment Cancelled | Tishbite Digital",
  robots: { index: false, follow: false },
};

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={null}>
      <PaymentCancelContent />
    </Suspense>
  );
}
