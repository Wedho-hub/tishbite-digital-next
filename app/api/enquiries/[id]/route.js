import connectDB from "@/lib/db";
import Enquiry from "@/models/Enquiry";
import { requireAdmin } from "@/lib/auth";

export async function GET(request, { params }) {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const { id } = await params;
  const enquiry = await Enquiry.findById(id);
  if (!enquiry) return Response.json({ message: "Enquiry not found" }, { status: 404 });
  return Response.json(enquiry);
}

export async function DELETE(request, { params }) {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const { id } = await params;
  const enquiry = await Enquiry.findByIdAndDelete(id);
  if (!enquiry) return Response.json({ message: "Enquiry not found" }, { status: 404 });
  return Response.json({ message: "Enquiry deleted" });
}
