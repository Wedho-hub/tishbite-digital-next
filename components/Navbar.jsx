"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaPhoneAlt,
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
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const PHONE = { href: "tel:+27791684548", number: "+27 79 168 4548" };

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const togglerRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    togglerRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && menuOpen) closeMenu();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navBg = isScrolled
    ? "rgba(12,26,18,0.97)"
    : "rgba(15,32,22,0.88)";

  return (
    <>
      <nav
        className="on-dark fixed top-0 left-0 right-0 z-50 transition-shadow duration-300"
        style={{ background: navBg, backdropFilter: "blur(20px)" }}
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 max-w-7xl">

          {/* ─── Desktop ─── */}
          <div className="hidden lg:flex items-center h-19 gap-6">

            {/* Logo */}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 300, damping: 18 }} className="shrink-0">
              <Link href="/" className="shrink-0 block">
                <img
                  src="/assets/tishbite_digital_logo.svg"
                  alt="Tishbite Digital"
                  className="h-14 w-auto"
                  loading="eager"
                />
              </Link>
            </motion.div>

            {/* Nav links — underline slides in via <span> */}
            <ul className="flex flex-1 justify-center gap-0.5 list-none m-0 p-0">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <motion.div
                      whileHover="hover"
                      initial="rest"
                      animate={isActive ? "hover" : "rest"}
                    >
                      <Link
                        href={link.href}
                        className={`relative block px-4 py-2 rounded-lg text-sm font-semibold no-underline transition-colors duration-200 ${
                          isActive
                            ? "text-accent bg-white/10"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {link.label}
                        <motion.span
                          aria-hidden="true"
                          className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-accent block"
                          variants={{
                            rest: { scaleX: 0, originX: 0 },
                            hover: { scaleX: 1, originX: 0 },
                          }}
                          transition={{ duration: 0.2 }}
                        />
                      </Link>
                    </motion.div>
                  </li>
                );
              })}
            </ul>

            {/* Social icons + Phone */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex gap-2">
                {SOCIAL.map(({ href, Icon, label, color }) => (
                  <motion.a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in a new tab)`}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: color }}
                    whileHover={{ scale: 1.18, filter: "brightness(1.15)" }}
                    whileTap={{ scale: 0.88 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  >
                    <Icon size={13} className="text-white" />
                  </motion.a>
                ))}
              </div>

              <motion.a
                href={PHONE.href}
                aria-label={`Call Tishbite Digital on ${PHONE.number}`}
                className="flex items-center gap-2 bg-accent text-primary-dark font-bold text-sm px-3 py-2 rounded-lg no-underline"
                whileHover={{ y: -2, boxShadow: "0 6px 18px rgba(244,201,93,0.55)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                <FaPhoneAlt size={12} />
                {PHONE.number}
              </motion.a>
            </div>
          </div>

          {/* ─── Mobile header ─── */}
          <div className="flex lg:hidden flex-col py-2">
            {/* Top row: socials + phone */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-1.5">
                {SOCIAL.map(({ href, Icon, label, color }) => (
                  <motion.a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in a new tab)`}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: color }}
                    whileHover={{ scale: 1.18, filter: "brightness(1.15)" }}
                    whileTap={{ scale: 0.88 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  >
                    <Icon size={11} className="text-white" />
                  </motion.a>
                ))}
              </div>
              <motion.a
                href={PHONE.href}
                aria-label={`Call Tishbite Digital on ${PHONE.number}`}
                className="flex items-center gap-1.5 text-accent font-bold text-sm no-underline"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPhoneAlt size={12} />
                {PHONE.number}
              </motion.a>
            </div>

            {/* Logo + Hamburger */}
            <div className="flex items-center justify-between">
              <motion.div whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
                <Link href="/" className="flex items-center gap-2 no-underline group">
                  <img
                    src="/assets/tishbite_digital_favicon.svg"
                    alt="Tishbite Digital"
                    className="h-10 w-10"
                    loading="eager"
                  />
                  <span className="text-white font-bold text-sm leading-tight">
                    Tishbite Digital
                    <span className="block text-accent/70 font-normal text-xs group-hover:text-accent transition-colors duration-200">
                      Growing Together
                    </span>
                  </span>
                </Link>
              </motion.div>

              <motion.button
                ref={togglerRef}
                type="button"
                className="flex flex-col gap-1.25 p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                aria-controls="mobile-nav-menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
                whileTap={{ scale: 0.88 }}
              >
                <span
                  className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${
                    menuOpen ? "rotate-45 translate-y-1.75" : ""
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                    menuOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${
                    menuOpen ? "-rotate-45 -translate-y-1.75" : ""
                  }`}
                />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Mobile menu ─── */}
      <div
        id="mobile-nav-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!menuOpen}
        {...(!menuOpen ? { inert: true } : {})}
        className={`on-dark fixed inset-0 top-24 z-40 lg:hidden transition-opacity duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(11,22,15,0.97)", backdropFilter: "blur(12px)" }}
      >
        <div className="p-6 max-w-sm mx-auto">
          <ul className="list-none m-0 p-0 space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <motion.div
                    whileHover={isActive ? {} : { x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-lg font-semibold no-underline border-l-[3px] transition-colors duration-200 ${
                        isActive
                          ? "text-accent bg-white/10 border-accent"
                          : "text-white/80 hover:text-white hover:bg-white/10 border-transparent hover:border-accent/60"
                      }`}
                      onClick={closeMenu}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              );
            })}
          </ul>

          <motion.a
            href={PHONE.href}
            className="mt-6 flex items-center justify-center gap-2 bg-accent text-primary-dark font-bold py-3.5 rounded-xl text-base no-underline"
            whileHover={{ y: -3, boxShadow: "0 8px 22px rgba(244,201,93,0.55)" }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            <FaPhoneAlt />
            {PHONE.number}
          </motion.a>
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 top-24 z-30 lg:hidden cursor-default"
          aria-label="Close menu"
          onClick={closeMenu}
          tabIndex={-1}
        />
      )}
    </>
  );
}
