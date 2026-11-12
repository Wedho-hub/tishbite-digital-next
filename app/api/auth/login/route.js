import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import { signAdminToken, authCookieOptions } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request) {
  try {
    const ip = getClientIp(request.headers);
    if (!checkRateLimit(`login:${ip}`, { limit: 8, windowMs: 60_000 })) {
      return Response.json({ success: false, message: "Too many attempts. Please try again shortly." }, { status: 429 });
    }

    const { email, password } = await request.json();

    // Mongoose passes this filter straight to MongoDB — an object like
    // {"$gt": ""} instead of a string would be evaluated as a query
    // operator, not a literal email, if not rejected here first.
    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return Response.json({ message: "Missing credentials" }, { status: 400 });
    }

    await connectDB();
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      return Response.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }

    const token = signAdminToken(admin._id);
    const cookieStore = await cookies();
    cookieStore.set("token", token, authCookieOptions());

    return Response.json({
      success: true,
      message: "Login successful",
      admin: { id: admin._id, email: admin.email },
    });
  } catch (err) {
    console.error("[auth/login] error", err);
    return Response.json({ success: false, message: "Login failed. Please try again." }, { status: 500 });
  }
}
