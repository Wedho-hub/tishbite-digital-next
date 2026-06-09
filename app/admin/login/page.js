"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthProvider";
import { FaLock } from "react-icons/fa";

export default function AdminLoginPage() {
  const { login, admin, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && admin) router.replace("/admin");
  }, [loading, admin, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password.trim()) {
      setError("Password cannot be empty.");
      return;
    }
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);
    if (res.success) {
      router.replace("/admin");
    } else {
      setError(res.error?.message || "Invalid credentials. Please try again.");
    }
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl border border-white/15 bg-white/8 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors duration-200";

  return (
    <div className="min-h-screen bg-[#0f2016] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/assets/tishbite_digital_logo.svg"
            alt="Tishbite Digital"
            width={48}
            height={48}
            className="mb-3"
          />
          <h1
            className="text-xl font-extrabold text-white"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Admin Login
          </h1>
          <p className="text-white/40 text-sm mt-1">Tishbite Digital CMS</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          {error && (
            <div
              role="alert"
              className="mb-4 px-4 py-3 rounded-xl bg-red-900/40 border border-red-500/30 text-red-300 text-sm"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="on" className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-white/70 text-xs font-semibold mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tishbitedigital.co.za"
                disabled={submitting}
                className={inputBase}
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-white/70 text-xs font-semibold mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={submitting}
                className={inputBase}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary-dark to-primary-light text-white font-bold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <FaLock size={12} /> Login
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
