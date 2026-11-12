// Best-effort, in-memory sliding-window rate limiter — not a substitute
// for a real distributed limiter (Upstash/Vercel KV) in a multi-instance
// serverless deployment, since each cold-started instance starts with an
// empty map and traffic can land on any instance. Still meaningfully
// raises the bar against unsophisticated scripted abuse (login brute-
// force, contact-form spam) on a warm instance at zero added
// infrastructure/cost, and is strictly better than no limiting at all.
const buckets = new Map();

// Periodic cleanup so the map doesn't grow unbounded over the life of a
// warm instance — runs lazily off request traffic, not a timer.
let lastSweep = Date.now();
function sweep(windowMs) {
  const now = Date.now();
  if (now - lastSweep < windowMs) return;
  lastSweep = now;
  for (const [key, hits] of buckets) {
    const fresh = hits.filter((t) => now - t < windowMs);
    if (fresh.length === 0) buckets.delete(key);
    else buckets.set(key, fresh);
  }
}

export function getClientIp(headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") || "unknown";
}

// Returns true if the request is allowed, false if it should be rejected.
// `key` should combine a route identifier with the client IP, e.g.
// `login:${ip}`, so different endpoints don't share a budget.
export function checkRateLimit(key, { limit = 10, windowMs = 60_000 } = {}) {
  sweep(windowMs);
  const now = Date.now();
  const hits = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  return true;
}
