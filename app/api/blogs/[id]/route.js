import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { requireAdmin } from "@/lib/auth";
import { resolveUploadedImageData, deleteStoredImage } from "@/lib/uploadImage";

const pickBlogPayload = (body = {}) => {
  const payload = {
    title: body.title,
    content: body.content,
    author: body.author,
    metaTitle: body.metaTitle,
    metaDescription: body.metaDescription,
  };

  if (body.keywords !== undefined) {
    payload.keywords = Array.isArray(body.keywords)
      ? body.keywords
      : String(body.keywords).split(",").map((k) => k.trim()).filter(Boolean);
  }

  return payload;
};

export async function GET(request, { params }) {
  await connectDB();
  const { id } = await params;
  const post = await BlogPost.findById(id).lean();
  if (!post) return Response.json({ message: "Blog post not found" }, { status: 404 });

  return Response.json(post, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=120" },
  });
}

export async function PUT(request, { params }) {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const { id } = await params;
  const existingPost = await BlogPost.findById(id);
  if (!existingPost) return Response.json({ message: "Blog post not found" }, { status: 404 });

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

  const data = pickBlogPayload(body);

  if (imageFile) {
    const imageData = await resolveUploadedImageData(imageFile, "tishbite-digital/blog-posts");
    if (imageData?.image) {
      data.image = imageData.image;
      data.imagePublicId = imageData.imagePublicId;
    }
  }

  const post = await BlogPost.findByIdAndUpdate(id, data, { new: true, runValidators: true });

  if (imageFile) {
    await deleteStoredImage({ image: existingPost.image, imagePublicId: existingPost.imagePublicId });
  }

  return Response.json(post);
}

export async function DELETE(request, { params }) {
  const { admin, error } = await requireAdmin();
  if (!admin) return error;

  await connectDB();
  const { id } = await params;
  const post = await BlogPost.findByIdAndDelete(id);
  if (!post) return Response.json({ message: "Blog post not found" }, { status: 404 });

  await deleteStoredImage({ image: post.image, imagePublicId: post.imagePublicId });

  return Response.json({ message: "Blog post deleted" });
}
