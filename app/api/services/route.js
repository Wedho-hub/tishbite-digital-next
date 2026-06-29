import connectDB from "@/lib/db";
import Service from "@/models/Service";
import { requireAdmin } from "@/lib/auth";
import { resolveUploadedImageData } from "@/lib/uploadImage";
import { pingIndexNow } from "@/lib/indexNow";

const allowedCategories = new Set(["general", "bundle"]);

const normalizeCategory = (value) => {
  if (!value) return null;
  const normalized = String(value).toLowerCase().trim();
  return allowedCategories.has(normalized) ? normalized : null;
};

export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const hasCategoryFilter = searchParams.has("category");
  const requestedCategory = hasCategoryFilter ? normalizeCategory(searchParams.get("category")) : null;
  const summaryMode = searchParams.get("summary") === "1";

  if (hasCategoryFilter && !requestedCategory) {
    return Response.json({ message: "Invalid category. Use 'general' or 'bundle'." }, { status: 400 });
  }

  const filter = requestedCategory ? { category: requestedCategory } : {};
  const selectFields = summaryMode
    ? "title displayTitle category description image createdAt"
    : "title displayTitle category description image imagePublicId icon createdAt updatedAt";

  const services = await Service.find(filter)
    .select(selectFields)
    .sort({ category: 1, createdAt: -1 })
    .lean();

  return Response.json(
    services.map((service) => ({
      ...service,
      category: service.category || "general",
      description: summaryMode
        ? String(service.description || "").slice(0, 360)
        : service.description,
    })),
    { headers: { "Cache-Control": "public, max-age=180, s-maxage=300, stale-while-revalidate=300" } }
  );
}

export async function POST(request) {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const contentType = request.headers.get("content-type") || "";
  let fields = {};
  let imageFile = null;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    for (const [key, value] of formData.entries()) {
      if (key === "image" && value instanceof File) imageFile = value;
      else fields[key] = value;
    }
  } else {
    fields = await request.json();
  }

  const category = normalizeCategory(fields.category);
  if (fields.category && !category) {
    return Response.json({ message: "Invalid category. Use 'general' or 'bundle'." }, { status: 400 });
  }

  const imageData = imageFile ? await resolveUploadedImageData(imageFile, "tishbite-digital/services") : null;

  const service = await Service.create({
    ...fields,
    category: category || "general",
    ...(imageData?.image ? { image: imageData.image } : {}),
    ...(imageData?.imagePublicId ? { imagePublicId: imageData.imagePublicId } : {}),
  });

  await pingIndexNow("/services");
  return Response.json(service, { status: 201 });
}
