import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { requireAdmin } from "@/lib/auth";
import { resolveUploadedImageData } from "@/lib/uploadImage";

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

export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1);
  const requestedLimit = parseInt(searchParams.get("limit"), 10);
  const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 100) : 10;
  const allMode = searchParams.get("all") === "1" || searchParams.get("all") === "true";
  const adminMode = searchParams.get("admin") === "1" || searchParams.get("admin") === "true";
  const skip = allMode ? 0 : (page - 1) * limit;
  const summaryMode = searchParams.get("summary") === "1" || searchParams.get("summary") === "true";

  const query = BlogPost.find()
    .select(summaryMode
      ? "title content author image createdAt"
      : "title content author image metaTitle metaDescription keywords createdAt updatedAt")
    .sort({ createdAt: -1 })
    .skip(skip);

  if (!allMode) query.limit(limit);

  const [total, posts] = await Promise.all([
    BlogPost.countDocuments(),
    query.lean(),
  ]);

  const headers = adminMode
    ? { "Cache-Control": "private, no-store, no-cache, must-revalidate" }
    : { "Cache-Control": "public, max-age=180, s-maxage=300, stale-while-revalidate=300" };

  return Response.json(
    {
      data: posts.map((post) => ({
        ...post,
        content: summaryMode ? String(post.content || "").slice(0, 600) : post.content,
      })),
      page,
      totalPages: allMode ? 1 : Math.ceil(total / limit),
      total,
    },
    { headers }
  );
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

  const data = pickBlogPayload(body);
  if (!data.title || !data.content) {
    return Response.json({ message: "Title and content are required" }, { status: 400 });
  }

  if (imageFile) {
    const imageData = await resolveUploadedImageData(imageFile, "tishbite-digital/blog-posts");
    if (imageData?.image) {
      data.image = imageData.image;
      data.imagePublicId = imageData.imagePublicId;
    }
  }

  const post = await BlogPost.create(data);
  return Response.json(post, { status: 201 });
}
