import connectDB from "@/lib/db";
import Enquiry from "@/models/Enquiry";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const enquiries = await Enquiry.find();
  return Response.json(enquiries);
}

export async function POST(request) {
  await connectDB();
  const body = await request.json();
  const enquiry = await Enquiry.create(body);
  return Response.json(enquiry, { status: 201 });
}
