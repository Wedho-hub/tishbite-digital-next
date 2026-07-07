"use client";

import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppFloat from "./WhatsAppFloat";
import ScrollProgress from "./ScrollProgress";
import MobileStickyBar from "./MobileStickyBar";

export default function PublicWrapper({ children }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <MotionConfig reducedMotion="user">
      <>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-9999 focus:px-4 focus:py-2 focus:bg-primary-dark focus:text-white focus:rounded-lg focus:font-bold"
        >
          Skip to main content
        </a>
        <ScrollProgress />
        <Navbar />
        <main
          id="main-content"
          className="flex-1 pt-(--nav-height-mobile) lg:pt-(--nav-height) pb-20 md:pb-0"
        >
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
        <MobileStickyBar />
      </>
    </MotionConfig>
  );
}
