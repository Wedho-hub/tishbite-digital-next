import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import { signAdminToken, authCookieOptions } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
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
