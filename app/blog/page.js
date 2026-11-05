import PageHeader from "@/components/PageHeader";
import BlogFrontPage from "@/components/blog/BlogFrontPage";
import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { getCategoryCounts, cleanField } from "@/lib/blog";

export const revalidate = 300;

export const metadata = {
  title: "Blog — Digital Growth Insights",
  description:
    "Practical strategies for South African businesses to improve visibility, attract leads, and grow online.",
  keywords: [
    "digital marketing blog South Africa",
    "SEO tips South Africa",
    "WhatsApp lead generation South Africa",
    "small business growth strategies South Africa",
  ],
  alternates: {
    canonical: "https://www.tishbitedigital.co.za/blog",
    types: { "application/rss+xml": "https://www.tishbitedigital.co.za/blog/rss.xml" },
  },
  openGraph: {
    title: "Digital Growth Insights — Tishbite Digital Blog",
    description:
      "Practical strategies for South African businesses to improve visibility, attract leads, and grow online.",
    url: "https://www.tishbitedigital.co.za/blog",
    images: [{ url: "https://www.tishbitedigital.co.za/assets/tishbiteHero.png" }],
  },
};

const FALLBACK_POSTS = [
  {
    _id: "fb-seo",
    title: "How to Get Your South African Business Found on Google",
    slug: "get-your-south-african-business-found-on-google",
    excerpt: "Learn the key local and national SEO strategies that help service businesses across South Africa rank higher and attract more qualified enquiries.",
    category: "SEO",
    image: null,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "fb-whatsapp",
    title: "Why WhatsApp is Your Best Lead Capture Tool in South Africa",
    slug: "whatsapp-lead-capture-south-africa",
    excerpt: "WhatsApp is where South African buyers communicate. Here's how to build it into your lead capture flow for faster conversions.",
    category: "Lead Generation",
    image: null,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "fb-website",
    title: "5 Signs Your Website is Costing You Clients",
    slug: "website-costing-you-clients",
    excerpt: "A slow, unclear, or hard-to-navigate website drives qualified visitors away. Find out if yours has these common problems.",
    category: "Web Design",
    image: null,
    createdAt: new Date().toISOString(),
  },
];

async function getPosts() {
  try {
    await connectDB();
    const posts = await BlogPost.find()
      .select("title slug deck excerpt category author image coverAlt featured createdAt")
      .sort({ createdAt: -1 })
      .lean();
    if (!posts.length) return FALLBACK_POSTS;
    return posts.map((post) => ({
      ...post,
      _id: String(post._id),
      excerpt: cleanField(post.excerpt),
      deck: cleanField(post.deck),
      createdAt: post.createdAt?.toISOString?.() || post.createdAt,
    }));
  } catch {
    return FALLBACK_POSTS;
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  // A post flagged `featured` leads the front page regardless of date;
  // otherwise the most recent post (posts are already sorted desc)
  // leads, same as before this flag existed.
  const featuredIndex = posts.findIndex((post) => post.featured);
  const ordered =
    featuredIndex > 0 ? [posts[featuredIndex], ...posts.slice(0, featuredIndex), ...posts.slice(featuredIndex + 1)] : posts;

  const categories = getCategoryCounts(posts);

  return (
    <>
      <PageHeader
        title="Digital Growth Insights"
        subtitle="Practical strategies for South African businesses to improve visibility, attract leads, and grow online."
        background="dark"
      />

      <section className="py-14 bg-bg">
        <div className="container mx-auto px-4 max-w-7xl">
          <BlogFrontPage posts={ordered} categories={categories} />
        </div>
      </section>
    </>
  );
}
