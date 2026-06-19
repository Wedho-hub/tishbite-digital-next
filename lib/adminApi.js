export async function authFetch(path, options = {}) {
  return fetch(path, { ...options, credentials: "include" });
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
    const res = await fetch("/api/auth/verify", { credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.admin : null;
  } catch {
    return null;
  }
}

export function resolveUploadUrl(image) {
  if (!image) return "";
  const raw = String(image).trim();
  // Cloudinary URLs (and any other absolute URLs) pass through unchanged.
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  // Legacy relative paths from the old Render disk-storage fallback are no
  // longer servable once Render is decommissioned — surface them as-is so
  // a broken image is visible (and fixable by re-uploading) rather than
  // silently pointing at a dead backend.
  return raw;
}
