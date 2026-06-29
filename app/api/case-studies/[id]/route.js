import connectDB from "@/lib/db";
import CaseStudy from "@/models/CaseStudy";
import { requireAdmin } from "@/lib/auth";
import { resolveUploadedImageData, deleteStoredImage } from "@/lib/uploadImage";
import { pingIndexNow } from "@/lib/indexNow";

const pickCaseStudyPayload = (body = {}) => {
  const payload = {
    title: body.title,
    industry: body.industry,
    challenge: body.challenge,
    solution: body.solution,
    result: body.result,
    link: body.link,
  };

  if (body.order !== undefined) {
    const parsedOrder = parseInt(body.order, 10);
    payload.order = Number.isFinite(parsedOrder) ? parsedOrder : 0;
  }

  if (body.metrics !== undefined) {
    payload.metrics = Array.isArray(body.metrics)
      ? body.metrics
      : String(body.metrics).split(",").map((m) => m.trim()).filter(Boolean);
  }

  return payload;
};

export async function GET(request, { params }) {
  await connectDB();
  const { id } = await params;
  const caseStudy = await CaseStudy.findById(id).lean();
  if (!caseStudy) return Response.json({ message: "Case study not found" }, { status: 404 });

  return Response.json(caseStudy, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=120" },
  });
}

export async function PUT(request, { params }) {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const { id } = await params;
  const existing = await CaseStudy.findById(id);
  if (!existing) return Response.json({ message: "Case study not found" }, { status: 404 });

  const contentType = request.headers.get("content-type") || "";
  let body = {};
  let imageFile = null;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    for (const [key, value] of formData.entries()) {
      if (key === "image" && value instanceof File) imageFile = value;
      else body[key] = value;
    }
  } else {
    body = await request.json();
  }

  const data = pickCaseStudyPayload(body);

  if (imageFile) {
    const imageData = await resolveUploadedImageData(imageFile, "tishbite-digital/case-studies");
    if (imageData?.image) {
      data.image = imageData.image;
      data.imagePublicId = imageData.imagePublicId;
    }
  }

  const caseStudy = await CaseStudy.findByIdAndUpdate(id, data, { new: true, runValidators: true });

  if (imageFile) {
    await deleteStoredImage({ image: existing.image, imagePublicId: existing.imagePublicId });
  }

  await pingIndexNow("/projects");
  return Response.json(caseStudy);
}

export async function DELETE(request, { params }) {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const { id } = await params;
  const caseStudy = await CaseStudy.findByIdAndDelete(id);
  if (!caseStudy) return Response.json({ message: "Case study not found" }, { status: 404 });

  await deleteStoredImage({ image: caseStudy.image, imagePublicId: caseStudy.imagePublicId });

  await pingIndexNow("/projects");
  return Response.json({ message: "Case study deleted" });
}
