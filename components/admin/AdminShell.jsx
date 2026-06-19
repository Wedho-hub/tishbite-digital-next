"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthProvider";
import {
  FaHome,
  FaPenNib,
  FaBriefcase,
  FaCogs,
  FaEnvelope,
  FaSignOutAlt,
  FaChartLine,
  FaStar,
} from "react-icons/fa";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard", icon: FaHome, exact: true },
  { href: "/admin/blogs", label: "Blogs", icon: FaPenNib },
  { href: "/admin/projects", label: "Projects", icon: FaBriefcase },
  { href: "/admin/case-studies", label: "Case Studies", icon: FaChartLine },
  { href: "/admin/services", label: "Services", icon: FaCogs },
  { href: "/admin/testimonials", label: "Testimonials", icon: FaStar },
  { href: "/admin/enquiries", label: "Enquiries", icon: FaEnvelope },
];

export default function AdminShell({ children }) {
  const { admin, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !admin && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [loading, admin, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (loading || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1a13]">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f0f4f1]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-[#0f2016] flex flex-col">
        <div className="px-5 py-5 border-b border-white/8">
          <Link href="/admin" className="flex items-center gap-2 no-underline">
            <Image
              src="/assets/tishbite_digital_favicon.svg"
              alt="Tishbite Digital"
              width={28}
              height={28}
            />
            <span
              className="text-sm font-extrabold text-white leading-tight"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href) && !exact
              ? pathname === href || pathname.startsWith(href + "/")
              : pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold no-underline transition-all duration-200 ${
                  active
                    ? "bg-primary text-white"
                    : "text-white/60 hover:text-white hover:bg-white/8"
                }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-5 border-t border-white/8 pt-3">
          <p className="text-white/40 text-xs px-3 mb-2 truncate">{admin.email}</p>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/8 transition-all duration-200 bg-transparent border-0 cursor-pointer text-left"
          >
            <FaSignOutAlt size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-[#0f2016]/10 flex items-center px-6 shrink-0">
          <h1
            className="text-sm font-bold text-[#0f2016]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {NAV_LINKS.find((l) => pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href)))?.label || "Dashboard"}
          </h1>
        </header>
        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
