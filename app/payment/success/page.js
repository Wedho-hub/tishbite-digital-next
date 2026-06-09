import Link from "next/link";
import { FaCheckCircle, FaWhatsapp, FaArrowRight } from "react-icons/fa";

export const metadata = {
  title: "Payment Successful | Tishbite Digital",
  robots: { index: false, follow: false },
};

export default function PaymentSuccessPage() {
  return (
    <section className="min-h-screen bg-bg flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md bg-white rounded-2xl border border-primary/10 shadow-lg p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-green-50 border-4 border-green-200 flex items-center justify-center mx-auto mb-6">
          <FaCheckCircle size={36} className="text-green-500" />
        </div>

        <h1
          className="text-2xl font-extrabold text-primary-dark mb-3"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          Payment Successful!
        </h1>

        <p className="text-text-muted text-sm leading-relaxed mb-3">
          Thank you for choosing Tishbite Digital. Your payment has been received
          and we will be in touch within <strong className="text-text-dark">1 business day</strong> to
          kick off your project.
        </p>

        <p className="text-text-muted text-sm leading-relaxed mb-8">
          Check your inbox — a receipt from PayFast will arrive shortly.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://wa.me/27791684548"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25d366] text-white font-bold text-sm no-underline hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
          >
            <FaWhatsapp size={16} /> Chat on WhatsApp
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-primary text-primary font-bold text-sm no-underline hover:bg-primary hover:text-white transition-all duration-300"
          >
            Back to Home <FaArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
