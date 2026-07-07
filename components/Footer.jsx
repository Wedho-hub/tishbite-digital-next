"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaCreditCard,
  FaArrowRight,
  FaShieldAlt,
  FaLock,
} from "react-icons/fa";

const SOCIAL = [
  {
    href: "https://web.facebook.com/profile.php?id=61584656188539",
    Icon: FaFacebookF,
    label: "Facebook",
    color: "#1877F2",
  },
  {
    href: "https://www.instagram.com/tishbitedigital/",
    Icon: FaInstagram,
    label: "Instagram",
    color: "#E1306C",
  },
  {
    href: "https://za.pinterest.com/Tishbite_Digital/",
    Icon: FaPinterestP,
    label: "Pinterest",
    color: "#E60023",
  },
];

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/how-we-work", label: "How We Work" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <motion.footer
      className="on-dark bg-[#0f2016] text-white/80 pt-12 pb-6"
      aria-label="Site footer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Pay Online strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/6 border border-white/10 rounded-2xl p-4 sm:p-5 mb-10">
          <div className="flex items-start sm:items-center gap-3">
            <FaCreditCard className="text-accent text-2xl shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <p className="text-white font-semibold text-sm mb-1">
                Pay for services securely online
              </p>
              <p className="text-white/50 text-xs flex flex-wrap gap-x-3 gap-y-1 m-0">
                <span className="flex items-center gap-1">
                  <FaLock aria-hidden="true" /> SSL Encrypted
                </span>
                <span className="flex items-center gap-1">
                  <FaShieldAlt aria-hidden="true" /> Secured by PayFast
                </span>
                <span>ZAR · Instant confirmation</span>
              </p>
            </div>
          </div>
          <motion.div
            whileHover={{ y: -2, boxShadow: "0 8px 22px rgba(244,201,93,0.5)" }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="shrink-0"
          >
            <Link
              href="/checkout"
              className="flex items-center gap-2 bg-accent text-primary-dark font-bold px-4 py-2.5 rounded-xl text-sm no-underline"
            >
              Pay Online <FaArrowRight aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 300, damping: 18 }} className="inline-block">
              <Link href="/" className="inline-flex flex-col gap-1 mb-4 no-underline group">
                <img
                  src="/assets/tishbite_digital_logo.svg"
                  alt="Tishbite Digital"
                  className="h-12 w-auto"
                  loading="lazy"
                />
                <span className="text-accent/70 text-xs font-medium group-hover:text-accent transition-colors duration-200">
                  Growing Together
                </span>
              </Link>
            </motion.div>
            <p className="text-white/60 text-sm leading-relaxed m-0">
              Cape Town digital agency helping small businesses and new
              entrepreneurs get more clients, better Google visibility, and
              sustainable online growth.
            </p>
          </motion.div>

          {/* Quick Links — underline slides in via <span> */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.06 }}
          >
            <h6 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h6>
            <ul className="space-y-2 list-none p-0 m-0">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <motion.div whileHover="hover" initial="rest">
                    <Link
                      href={link.href}
                      className="relative inline-block text-white/60 text-sm no-underline"
                      style={{ transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent, #f4c95d)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                    >
                      {link.label}
                      <motion.span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 right-0 block"
                        style={{ height: "1px", backgroundColor: "var(--color-accent, #f4c95d)", originX: 0 }}
                        variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                        transition={{ duration: 0.2 }}
                      />
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.12 }}
          >
            <h6 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Contact
            </h6>
            <div className="space-y-2 mb-4">
              <motion.a
                href="tel:+27791684548"
                className="block text-white/60 text-sm no-underline"
                whileHover={{ color: "var(--color-accent, #f4c95d)", x: 3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                📞 +27 79 168 4548
              </motion.a>
              <motion.a
                href="mailto:info@tishbitedigital.co.za"
                className="block text-white/60 text-sm no-underline"
                whileHover={{ color: "var(--color-accent, #f4c95d)", x: 3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                ✉️ info@tishbitedigital.co.za
              </motion.a>
            </div>
            <div className="flex gap-2">
              {SOCIAL.map(({ href, Icon, label, color }) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (opens in a new tab)`}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: color }}
                  whileHover={{ scale: 1.18, filter: "brightness(1.15)" }}
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                >
                  <Icon size={14} className="text-white" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-5 text-center">
          <p className="text-white/40 text-xs m-0">
            © {new Date().getFullYear()} Tishbite Digital. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
