import connectDB from "@/lib/db";
import Subscriber from "@/models/Subscriber";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(request, { params }) {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const { id } = await params;
  const subscriber = await Subscriber.findByIdAndDelete(id);
  if (!subscriber) return Response.json({ message: "Subscriber not found" }, { status: 404 });

  return Response.json({ message: "Subscriber deleted" });
}
