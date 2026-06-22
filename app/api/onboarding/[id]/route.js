import connectDB from "@/lib/db";
import Onboarding from "@/models/Onboarding";
import { requireAdmin } from "@/lib/auth";

const ALLOWED_STATUSES = new Set(["new", "reviewed", "quoted"]);

export async function GET(request, { params }) {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const { id } = await params;
  const submission = await Onboarding.findById(id);
  if (!submission) return Response.json({ message: "Submission not found" }, { status: 404 });
  return Response.json(submission);
}

export async function PATCH(request, { params }) {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const { id } = await params;
  const { status } = await request.json();

  if (!ALLOWED_STATUSES.has(status)) {
    return Response.json({ message: "Invalid status. Use new, reviewed, or quoted." }, { status: 400 });
  }

  const submission = await Onboarding.findByIdAndUpdate(id, { status }, { new: true });
  if (!submission) return Response.json({ message: "Submission not found" }, { status: 404 });
  return Response.json(submission);
}

export async function DELETE(request, { params }) {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const { id } = await params;
  const submission = await Onboarding.findByIdAndDelete(id);
  if (!submission) return Response.json({ message: "Submission not found" }, { status: 404 });
  return Response.json({ message: "Submission deleted" });
}
