import connectDB from "@/lib/db";
import Project from "@/models/Project";
import { requireAdmin } from "@/lib/auth";
import { resolveUploadedImageData, deleteStoredImage } from "@/lib/uploadImage";
import { pingIndexNow } from "@/lib/indexNow";

export async function GET(request, { params }) {
  await connectDB();
  const { id } = await params;
  const project = await Project.findById(id).lean();
  if (!project) return Response.json({ message: "Project not found" }, { status: 404 });

  return Response.json(project, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=120" },
  });
}

export async function PUT(request, { params }) {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const { id } = await params;
  const existingProject = await Project.findById(id);
  if (!existingProject) return Response.json({ message: "Project not found" }, { status: 404 });

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

  const project = await Project.findByIdAndUpdate(id, data, { new: true });

  if (imageFile) {
    await deleteStoredImage({ image: existingProject.image, imagePublicId: existingProject.imagePublicId });
  }

  await pingIndexNow("/projects");
  return Response.json(project);
}

export async function DELETE(request, { params }) {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const { id } = await params;
  const project = await Project.findByIdAndDelete(id);
  if (!project) return Response.json({ message: "Project not found" }, { status: 404 });

  await deleteStoredImage({ image: project.image, imagePublicId: project.imagePublicId });

  await pingIndexNow("/projects");
  return Response.json({ message: "Project deleted" });
}
