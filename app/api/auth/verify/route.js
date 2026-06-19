import { getAdminFromCookies } from "@/lib/auth";

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) return Response.json({ success: false }, { status: 401 });
  return Response.json({ success: true, admin });
}
