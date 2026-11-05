import { ImageResponse } from "next/og";
import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { cloudinaryOptimizedUrl } from "@/lib/cloudinaryUrl";

export const alt = "Tishbite Digital blog article cover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function getPost(slug) {
  try {
    await connectDB();
    return await BlogPost.findOne({ slug }).select("title category image").lean();
  } catch {
    return null;
  }
}

// Shared image for both the og:image and twitter:image meta tags on a
// post — generateMetadata (page.js) deliberately leaves its own
// openGraph/twitter `images` unset so this is the only source, rather
// than the two silently producing duplicate/conflicting tags. Uses the
// post's real cover photo when there is one, so a shared link still
// looks like THIS article rather than a generic brand card.
export default async function Image({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  const title = post?.title || "Tishbite Digital";
  const category = post?.category;
  const coverImage = post?.image ? cloudinaryOptimizedUrl(post.image, { width: 1200 }) : null;

  // satori (next/og's renderer) calls .trim() on every style value it
  // sees — an explicit `undefined` for a conditional property (e.g.
  // backgroundImage only when there's no cover photo) crashes the
  // whole render, so the two backgrounds get genuinely separate style
  // objects instead of one object with a sometimes-undefined key.
  const backgroundStyle = coverImage
    ? { backgroundColor: "#0f2016" }
    : { backgroundImage: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)" };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "sans-serif",
          ...backgroundStyle,
        }}
      >
        {coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "linear-gradient(180deg, rgba(15,32,22,0.15) 0%, rgba(15,32,22,0.92) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            width: "100%",
            padding: "64px",
          }}
        >
          {category && (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                background: "#f4c95d",
                color: "#1b4332",
                fontSize: 24,
                fontWeight: 700,
                padding: "8px 24px",
                borderRadius: 999,
                marginBottom: 28,
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              {category}
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.15,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", marginTop: 40, fontSize: 28, fontWeight: 700, color: "#ffe08a" }}>
            Tishbite Digital
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
