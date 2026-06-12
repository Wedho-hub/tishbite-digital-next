"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaTimesCircle, FaArrowLeft, FaWhatsapp } from "react-icons/fa";

export default function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const service = searchParams.get("service");
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const retryUrl = service
    ? `/checkout?service=${encodeURIComponent(service)}`
    : "/services";

  return (
    <section className="min-h-screen bg-bg flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md bg-white rounded-2xl border border-primary/10 shadow-lg p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 border-4 border-red-200 flex items-center justify-center mx-auto mb-6">
          <FaTimesCircle size={36} className="text-red-400" />
        </div>

        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl font-extrabold text-primary-dark mb-3 focus:outline-none"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          Payment Cancelled
        </h1>

        <p className="text-text-muted text-sm leading-relaxed mb-8">
          No payment was processed. If you changed your mind or encountered an
          issue, you can try again or reach us on WhatsApp and we will assist
          you directly.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.div
            whileHover={{ y: -3, boxShadow: "0 8px 20px rgba(27,67,50,0.38)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="rounded-xl"
          >
            <Link
              href={retryUrl}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-primary-dark to-primary-light text-white font-bold text-sm no-underline"
            >
              <FaArrowLeft size={12} /> Try Again
            </Link>
          </motion.div>
          <motion.a
            href="https://wa.me/27791684548"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25d366] text-white font-bold text-sm no-underline"
            whileHover={{ y: -3, backgroundColor: "#1db954", boxShadow: "0 8px 20px rgba(37,211,102,0.45)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            <FaWhatsapp size={16} /> Get Help on WhatsApp
          </motion.a>
        </div>
      </div>
    </section>
  );
}
