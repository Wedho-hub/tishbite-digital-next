const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://tishbitedigital-api.onrender.com";

let csrfToken = null;

export async function fetchCsrfToken() {
  const res = await fetch(`${API_URL}/api/csrf-token`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch CSRF token");
  const data = await res.json();
  csrfToken = data.csrfToken;
  return csrfToken;
}

export async function authFetch(path, options = {}) {
  if (!csrfToken) await fetchCsrfToken();
  let headers = options.headers instanceof Headers
    ? Object.fromEntries(options.headers.entries())
    : { ...(options.headers || {}) };
  if (csrfToken) headers["x-csrf-token"] = csrfToken;
  return fetch(`${API_URL}${path}`, { ...options, headers, credentials: "include" });
}

export async function loginAdmin(email, password) {
  const res = await authFetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data };
  return data;
}

export async function logoutAdmin() {
  const res = await authFetch("/api/auth/logout", { method: "POST" });
  return res.json();
}

export async function verifyAdmin() {
  try {
    const res = await fetch(`${API_URL}/api/auth/verify`, { credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.admin : null;
  } catch {
    return null;
  }
}

export function resolveUploadUrl(image) {
  if (!image) return "";
  const raw = String(image).trim().replace(/\\/g, "/");
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  const uploadsIndex = raw.toLowerCase().lastIndexOf("/uploads/");
  const normalized =
    uploadsIndex >= 0 ? raw.slice(uploadsIndex + 1) : raw.startsWith("uploads/") ? raw : `uploads/${raw}`;
  return `${API_URL}/${normalized}`;
}
