import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";

const isProduction = process.env.NODE_ENV === "production";

export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 24 * 60 * 60,
    path: "/",
  };
}

export function signAdminToken(adminId) {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

export function verifyAdminToken(token) {
  // Pin the algorithm explicitly rather than trust whatever the token's
  // own header claims — jsonwebtoken already rejects "none", but this
  // removes any reliance on that and matches what signAdminToken actually
  // signs with (HS256, jsonwebtoken's default for a plain string secret).
  return jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
}

export async function getAdminFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = verifyAdminToken(token);
    await connectDB();
    const admin = await Admin.findById(decoded.id).select("email");
    if (!admin) return null;
    return { id: admin._id, email: admin.email };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return { admin: null, error: Response.json({ message: "Not authenticated" }, { status: 401 }) };
  }
  return { admin, error: null };
}
