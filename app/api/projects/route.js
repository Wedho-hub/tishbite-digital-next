import connectDB from "@/lib/db";
import Project from "@/models/Project";
import { requireAdmin } from "@/lib/auth";
import { resolveUploadedImageData } from "@/lib/uploadImage";

export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const summaryMode = searchParams.get("summary") === "1";

  const selectFields = summaryMode
    ? "title description image link createdAt"
    : "title description image imagePublicId link createdAt updatedAt";

  const [total, projects] = await Promise.all([
    Project.countDocuments(),
    Project.find().select(selectFields).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
  ]);

  return Response.json(
    {
      data: projects.map((project) => ({
        ...project,
        description: summaryMode
          ? String(project.description || "").slice(0, 420)
          : project.description,
      })),
      page,
      totalPages: Math.ceil(total / limit),
      total,
    },
    { headers: { "Cache-Control": "public, max-age=180, s-maxage=300, stale-while-revalidate=300" } }
  );
}

export async function POST(request) {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const contentType = request.headers.get("content-type") || "";
  let data = {};
  let imageFile = null;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    for (const [key, value] of formData.entries()) {
      if (key === "image" && value instanceof File) imageFile = value;
      else data[key] = value;
    }
  } else {
    data = await request.json();
  }

  if (imageFile) {
    const imageData = await resolveUploadedImageData(imageFile, "tishbite-digital/projects");
    if (imageData?.image) {
      data.image = imageData.image;
      data.imagePublicId = imageData.imagePublicId;
    }
  }

  const project = await Project.create(data);
  return Response.json(project, { status: 201 });
}
