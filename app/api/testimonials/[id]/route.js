import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { requireAdmin } from "@/lib/auth";
import { resolveUploadedImageData, deleteStoredImage } from "@/lib/uploadImage";
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

export async function GET(request, { params }) {
  await connectDB();
  const { id } = await params;
  const testimonial = await Testimonial.findById(id).lean();
  if (!testimonial) return Response.json({ message: "Testimonial not found" }, { status: 404 });

  return Response.json(testimonial, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=120" },
  });
}

export async function PUT(request, { params }) {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const { id } = await params;
  const existing = await Testimonial.findById(id);
  if (!existing) return Response.json({ message: "Testimonial not found" }, { status: 404 });

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

  if (imageFile) {
    const imageData = await resolveUploadedImageData(imageFile, "tishbite-digital/testimonials");
    if (imageData?.image) {
      data.image = imageData.image;
      data.imagePublicId = imageData.imagePublicId;
    }
  }

  const testimonial = await Testimonial.findByIdAndUpdate(id, data, { new: true, runValidators: true });

  if (imageFile) {
    await deleteStoredImage({ image: existing.image, imagePublicId: existing.imagePublicId });
  }

  await pingIndexNow("/");
  return Response.json(testimonial);
}

export async function DELETE(request, { params }) {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const { id } = await params;
  const testimonial = await Testimonial.findByIdAndDelete(id);
  if (!testimonial) return Response.json({ message: "Testimonial not found" }, { status: 404 });

  await deleteStoredImage({ image: testimonial.image, imagePublicId: testimonial.imagePublicId });

  await pingIndexNow("/");
  return Response.json({ message: "Testimonial deleted" });
}
