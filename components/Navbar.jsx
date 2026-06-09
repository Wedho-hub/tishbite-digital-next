"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  },
  {
    href: "https://www.instagram.com/tishbitedigital/",
    Icon: FaInstagram,
    label: "Instagram",
  },
  {
    href: "https://za.pinterest.com/Tishbite_Digital/",
    Icon: FaPinterestP,
    label: "Pinterest",
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
          <div className="hidden lg:flex items-center h-[76px] gap-6">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <img
                src="/assets/tishbite_digital_logo.svg"
                alt="Tishbite Digital"
                className="h-10 w-auto"
                loading="eager"
              />
            </Link>

            {/* Nav links */}
            <ul className="flex flex-1 justify-center gap-0.5 list-none m-0 p-0">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 no-underline ${
                      pathname === link.href
                        ? "text-accent bg-white/10"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social + Phone */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex gap-2">
                {SOCIAL.map(({ href, Icon, label }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in a new tab)`}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-accent/20 flex items-center justify-center text-white/70 hover:text-accent transition-all duration-200"
                  >
                    <Icon size={13} />
                  </a>
                ))}
              </div>
              <a
                href={PHONE.href}
                aria-label={`Call Tishbite Digital on ${PHONE.number}`}
                className="flex items-center gap-2 bg-accent hover:bg-accent-light text-primary-dark font-bold text-sm px-3 py-2 rounded-lg transition-colors duration-200 no-underline"
              >
                <FaPhoneAlt size={12} />
                {PHONE.number}
              </a>
            </div>
          </div>

          {/* ─── Mobile ─── */}
          <div className="flex lg:hidden flex-col py-2">
            {/* Top row */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-1.5">
                {SOCIAL.map(({ href, Icon, label }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in a new tab)`}
                    className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60"
                  >
                    <Icon size={11} />
                  </a>
                ))}
              </div>
              <a
                href={PHONE.href}
                aria-label={`Call Tishbite Digital on ${PHONE.number}`}
                className="flex items-center gap-1.5 text-accent font-bold text-sm no-underline"
              >
                <FaPhoneAlt size={12} />
                {PHONE.number}
              </a>
            </div>

            {/* Logo + Hamburger */}
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 no-underline">
                <img
                  src="/assets/tishbite_digital_favicon.svg"
                  alt="Tishbite Digital"
                  className="h-8 w-8"
                  loading="eager"
                />
                <span className="text-white font-bold text-sm leading-tight">
                  Tishbite Digital
                  <span className="block text-accent/70 font-normal text-xs">
                    Growing Together
                  </span>
                </span>
              </Link>

              <button
                ref={togglerRef}
                type="button"
                className="flex flex-col gap-[5px] p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                aria-controls="mobile-nav-menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <span
                  className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${
                    menuOpen ? "rotate-45 translate-y-[7px]" : ""
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                    menuOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${
                    menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu — rendered outside <nav> to avoid backdrop-filter containment */}
      <div
        id="mobile-nav-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`on-dark fixed inset-0 top-[96px] z-40 lg:hidden transition-opacity duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(11,22,15,0.97)", backdropFilter: "blur(12px)" }}
      >
        <div className="p-6 max-w-sm mx-auto">
          <ul className="list-none m-0 p-0 space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-4 py-3.5 rounded-xl text-lg font-semibold transition-colors duration-200 no-underline ${
                    pathname === link.href
                      ? "text-accent bg-white/10"
                      : "text-white hover:text-accent hover:bg-white/[0.07]"
                  }`}
                  onClick={closeMenu}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <a
            href={PHONE.href}
            className="mt-6 flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-primary-dark font-bold py-3.5 rounded-xl text-base no-underline transition-colors"
          >
            <FaPhoneAlt />
            {PHONE.number}
          </a>
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 top-[96px] z-30 lg:hidden cursor-default"
          aria-label="Close menu"
          onClick={closeMenu}
          tabIndex={-1}
        />
      )}
    </>
  );
}
