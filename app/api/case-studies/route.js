import connectDB from "@/lib/db";
import CaseStudy from "@/models/CaseStudy";
import { requireAdmin } from "@/lib/auth";
import { resolveUploadedImageData } from "@/lib/uploadImage";

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

export async function GET() {
  await connectDB();
  const caseStudies = await CaseStudy.find().sort({ order: 1, createdAt: -1 }).lean();

  return Response.json(caseStudies, {
    headers: { "Cache-Control": "public, max-age=180, s-maxage=300, stale-while-revalidate=300" },
  });
}

export async function POST(request) {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
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
  if (!data.title || !data.challenge || !data.solution || !data.result) {
    return Response.json({ message: "Title, challenge, solution, and result are required" }, { status: 400 });
  }

  if (imageFile) {
    const imageData = await resolveUploadedImageData(imageFile, "tishbite-digital/case-studies");
    if (imageData?.image) {
      data.image = imageData.image;
      data.imagePublicId = imageData.imagePublicId;
    }
  }

  const caseStudy = await CaseStudy.create(data);
  return Response.json(caseStudy, { status: 201 });
}
