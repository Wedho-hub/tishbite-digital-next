import connectDB from "@/lib/db";
import Payment from "@/models/Payment";
import { requireAdmin } from "@/lib/auth";

export async function GET(request) {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 20;
  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    Payment.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Payment.countDocuments(),
  ]);

  return Response.json({ payments, total, page, pages: Math.ceil(total / limit) });
}
