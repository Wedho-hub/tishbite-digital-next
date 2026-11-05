import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { cleanField, cleanExcerpt } from "@/lib/blog";

export const revalidate = 300;

const SITE_URL = "https://www.tishbitedigital.co.za";

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  let posts = [];
  try {
    await connectDB();
    posts = await BlogPost.find()
      .sort({ createdAt: -1 })
      .limit(30)
      .select("title slug excerpt metaDescription content category author createdAt")
      .lean();
  } catch {
    posts = [];
  }

  const items = posts
    .filter((post) => post.slug)
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const description =
        cleanField(post.metaDescription) || cleanField(post.excerpt) || cleanExcerpt(post.content, 300);
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      ${post.category ? `<category>${escapeXml(post.category)}</category>` : ""}
      ${post.author ? `<author>${escapeXml(post.author)}</author>` : ""}
      <description>${escapeXml(description)}</description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Tishbite Digital Blog</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Practical strategies for South African businesses to improve visibility, attract leads, and grow online.</description>
    <language>en-za</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
