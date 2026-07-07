"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight, FaWhatsapp } from "react-icons/fa";

export default function MobileStickyBar() {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-4 py-3 flex gap-3"
      style={{
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderTop: "1px solid rgba(27,67,50,0.09)",
        boxShadow: "0 -6px 28px rgba(27,67,50,0.11)",
      }}
      initial={{ y: 88 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 26, delay: 1.8 }}
    >
      <Link
        href="/contact"
        className="flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-xl text-sm no-underline text-white"
        style={{ background: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)" }}
      >
        Get Free Audit
        <FaArrowRight size={11} aria-hidden="true" />
      </Link>
      <motion.a
        href="https://wa.me/27791684548?text=Hello%20Tishbite%20Digital,%20I%20am%20interested%20in%20your%20services."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex items-center justify-center gap-1.5 text-white font-bold py-3 px-5 rounded-xl text-sm no-underline"
        style={{ background: "#25d366" }}
        whileHover={{ backgroundColor: "#1db954" }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
      >
        <FaWhatsapp size={20} aria-hidden="true" />
      </motion.a>
    </motion.div>
  );
}
