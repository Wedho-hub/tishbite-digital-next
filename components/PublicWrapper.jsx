"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppFloat from "./WhatsAppFloat";

export default function PublicWrapper({ children }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary-dark focus:text-white focus:rounded-lg focus:font-bold"
      >
        Skip to main content
      </a>
      <Navbar />
      <main
        id="main-content"
        className="flex-1 pt-[var(--nav-height-mobile)] lg:pt-[var(--nav-height)]"
      >
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
