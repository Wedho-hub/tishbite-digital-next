import connectDB from "@/lib/db";
import Service from "@/models/Service";
import { requireAdmin } from "@/lib/auth";
import { resolveUploadedImageData, deleteStoredImage } from "@/lib/uploadImage";

const allowedCategories = new Set(["general", "bundle"]);
const normalizeCategory = (value) => {
  if (!value) return null;
  const normalized = String(value).toLowerCase().trim();
  return allowedCategories.has(normalized) ? normalized : null;
};

export async function GET(request, { params }) {
  await connectDB();
  const { id } = await params;
  const service = await Service.findById(id).lean();
  if (!service) return Response.json({ message: "Service not found" }, { status: 404 });

  return Response.json(service, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=120" },
  });
}

export async function PUT(request, { params }) {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const { id } = await params;
  const existingService = await Service.findById(id);
  if (!existingService) return Response.json({ message: "Service not found" }, { status: 404 });

  const contentType = request.headers.get("content-type") || "";
  let updateData = {};
  let imageFile = null;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    for (const [key, value] of formData.entries()) {
      if (key === "image" && value instanceof File) imageFile = value;
      else updateData[key] = value;
    }
  } else {
    updateData = await request.json();
  }

  if (Object.prototype.hasOwnProperty.call(updateData, "category")) {
    const category = normalizeCategory(updateData.category);
    if (!category) {
      return Response.json({ message: "Invalid category. Use 'general' or 'bundle'." }, { status: 400 });
    }
    updateData.category = category;
  }

  if (imageFile) {
    const imageData = await resolveUploadedImageData(imageFile, "tishbite-digital/services");
    if (imageData?.image) {
      updateData.image = imageData.image;
      updateData.imagePublicId = imageData.imagePublicId;
    }
  }

  const service = await Service.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

  if (imageFile) {
    await deleteStoredImage({ image: existingService.image, imagePublicId: existingService.imagePublicId });
  }

  return Response.json({ ...service.toObject(), category: service.category || "general" });
}

export async function DELETE(request, { params }) {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const { id } = await params;
  const service = await Service.findByIdAndDelete(id);
  if (!service) return Response.json({ message: "Service not found" }, { status: 404 });

  await deleteStoredImage({ image: service.image, imagePublicId: service.imagePublicId });

  return Response.json({ message: "Service deleted" });
}
