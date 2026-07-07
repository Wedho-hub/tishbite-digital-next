"use client";

import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppFloat() {
  return (
    <motion.div
      className="fixed bottom-24 md:bottom-6 right-6 z-50 flex items-center"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.2 }}
    >
      {/* Tooltip */}
      <motion.span
        className="mr-3 bg-white text-[#075e54] font-bold text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap border border-gray-100 select-none"
        initial={{ opacity: 0, x: 14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        Chat with us! 👋
      </motion.span>

      <div className="relative flex items-center justify-center">
        {/* Outer pulse ring */}
        <span
          className="absolute rounded-full bg-[#25d366] opacity-30 animate-ping"
          style={{ inset: "-8px" }}
        />
        {/* Inner pulse ring */}
        <span
          className="absolute inset-0 rounded-full bg-[#25d366] opacity-50 animate-ping"
          style={{ animationDelay: "0.5s" }}
        />

        {/* Button */}
        <motion.a
          href="https://wa.me/27791684548?text=Hello%20Tishbite%20Digital,%20I%20am%20interested%20in%20your%20services."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Tishbite Digital on WhatsApp"
          className="relative w-16 h-16 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-xl"
          whileHover={{ scale: 1.14 }}
          whileTap={{ scale: 0.93 }}
          animate={{
            boxShadow: [
              "0 6px 24px rgba(37,211,102,0.45)",
              "0 6px 36px rgba(37,211,102,0.75)",
              "0 6px 24px rgba(37,211,102,0.45)",
            ],
          }}
          transition={{
            boxShadow: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <FaWhatsapp size={34} />
        </motion.a>
      </div>
    </motion.div>
  );
}
