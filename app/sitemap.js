import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";

const BASE_URL = "https://tishbitedigital.co.za";

// Without this, Next.js statically generates the sitemap once at build
// time and freezes it until the next deploy. A sitemap is low-traffic
// (crawled occasionally, not on every pageview) so there's no real cost
// to always rendering it fresh against the current DB state.
export const dynamic = "force-dynamic";

const STATIC_ENTRIES = [
  {
    url: `${BASE_URL}/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/services`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/projects`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/how-we-work`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/blog`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/onboarding`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
];

export default async function sitemap() {
  let blogEntries = [];

  try {
    await connectDB();
    const posts = await BlogPost.find().select("_id updatedAt createdAt").lean();
    blogEntries = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post._id}`,
      lastModified: post.updatedAt || post.createdAt || new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    // DB unavailable at build/request time — sitemap still serves static pages
  }

  return [...STATIC_ENTRIES, ...blogEntries];
}
