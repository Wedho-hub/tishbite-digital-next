import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { requireAdmin } from "@/lib/auth";
import { resolveUploadedImageData } from "@/lib/uploadImage";
import { pingIndexNow } from "@/lib/indexNow";

const pickTestimonialPayload = (body = {}) => {
  const payload = {
    name: body.name,
    role: body.role,
    company: body.company,
    quote: body.quote,
    source: body.source || "Google",
  };

  if (body.rating !== undefined) {
    const parsedRating = parseInt(body.rating, 10);
    payload.rating = Number.isFinite(parsedRating) ? Math.min(5, Math.max(1, parsedRating)) : 5;
  }

  return payload;
};

export async function GET() {
  await connectDB();
  const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean();

  return Response.json(testimonials, {
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

  const data = pickTestimonialPayload(body);
  if (!data.name || !data.quote) {
    return Response.json({ message: "Name and quote are required" }, { status: 400 });
  }

  if (imageFile) {
    const imageData = await resolveUploadedImageData(imageFile, "tishbite-digital/testimonials");
    if (imageData?.image) {
      data.image = imageData.image;
      data.imagePublicId = imageData.imagePublicId;
    }
  }

  const testimonial = await Testimonial.create(data);
  await pingIndexNow("/");
  return Response.json(testimonial, { status: 201 });
}
