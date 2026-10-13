"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaCheckCircle, FaExclamationTriangle, FaArrowRight } from "react-icons/fa";

export default function UnsubscribePageContent({ token }) {
  // Missing token is knowable synchronously at mount, so it's derived via
  // the lazy initializer rather than an effect — the effect below then only
  // ever does genuine async work (or nothing, for the no-token case).
  const [state, setState] = useState(() => (token ? "loading" : "error"));
  const [message, setMessage] = useState(() => (token ? "" : "This unsubscribe link is missing its token."));

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setState("error");
          setMessage(data?.error || "This unsubscribe link is invalid or has already been used.");
          return;
        }
        setState("success");
        setMessage(data.email || "");
      } catch {
        if (!cancelled) {
          setState("error");
          setMessage("Something went wrong. Please try again.");
        }
      }
    })();

    return () => { cancelled = true; };
  }, [token]);

  return (
    <section className="min-h-screen bg-bg flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl border border-primary/10 shadow-lg p-8 text-center">
        {state === "loading" && (
          <div className="w-8 h-8 mx-auto border-2 border-primary/30 border-t-primary rounded-full animate-spin" aria-label="Processing" />
        )}

        {state === "success" && (
          <>
            <div className="w-20 h-20 rounded-full bg-green-50 border-4 border-green-200 flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle size={34} className="text-green-500" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-extrabold text-primary-dark mb-3" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
              You&rsquo;re unsubscribed
            </h1>
            <p className="text-text-muted text-sm leading-relaxed mb-8">
              {message ? `${message} has been removed from our mailing list. ` : "You’ve been removed from our mailing list. "}
              You won&rsquo;t receive further marketing emails from us.
            </p>
          </>
        )}

        {state === "error" && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-50 border-4 border-red-200 flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle size={30} className="text-red-500" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-extrabold text-primary-dark mb-3" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
              Couldn&rsquo;t unsubscribe
            </h1>
            <p className="text-text-muted text-sm leading-relaxed mb-8">{message}</p>
          </>
        )}

        {state !== "loading" && (
          <Link href="/" className="inline-flex items-center justify-center gap-2 text-primary font-semibold text-sm no-underline">
            Back to Home <FaArrowRight size={11} aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  );
}
