"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import {
  FaPenNib,
  FaBriefcase,
  FaCogs,
  FaEnvelope,
  FaChartLine,
  FaStar,
} from "react-icons/fa";

const TILES = [
  {
    href: "/admin/blogs",
    label: "Manage Blogs",
    desc: "Create, edit, and delete blog posts",
    icon: FaPenNib,
    color: "from-blue-600 to-blue-800",
  },
  {
    href: "/admin/projects",
    label: "Manage Projects",
    desc: "Add and update portfolio projects",
    icon: FaBriefcase,
    color: "from-primary to-primary-dark",
  },
  {
    href: "/admin/case-studies",
    label: "Manage Case Studies",
    desc: "Tell the problem → solution → result story",
    icon: FaChartLine,
    color: "from-teal-600 to-teal-800",
  },
  {
    href: "/admin/services",
    label: "Manage Services",
    desc: "Edit general and bundled services",
    icon: FaCogs,
    color: "from-primary-light to-primary",
  },
  {
    href: "/admin/testimonials",
    label: "Manage Testimonials",
    desc: "Import Google reviews and ratings",
    icon: FaStar,
    color: "from-amber-500 to-amber-700",
  },
  {
    href: "/admin/enquiries",
    label: "Manage Enquiries",
    desc: "View and delete client enquiries",
    icon: FaEnvelope,
    color: "from-accent to-yellow-600",
  },
];

export default function AdminDashboardPage() {
  const { admin } = useAuth();

  return (
    <div className="max-w-3xl">
      <p className="text-[#0f2016]/60 text-sm mb-6">
        Welcome back,{" "}
        <span className="font-semibold text-[#0f2016]">{admin?.email || "Admin"}</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TILES.map(({ href, label, desc, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-start gap-4 p-5 rounded-2xl bg-linear-to-br ${color} text-white no-underline hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300`}
          >
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Icon size={18} />
            </div>
            <div>
              <p
                className="font-bold text-sm mb-0.5"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                {label}
              </p>
              <p className="text-white/70 text-xs">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
