// Thin wrapper around window.gtag so blog components can fire events
// unconditionally without each one needing its own existence check or
// try/catch. gtag itself is currently only loaded on /thank-you (see
// components/ThankYouPageContent.jsx) — on every other page this is a
// deliberate, safe no-op until GA is loaded site-wide.
export function trackEvent(name, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
