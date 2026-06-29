import PageHeader from "@/components/PageHeader";
import BlogGrid from "@/components/BlogGrid";
import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";

export const revalidate = 300;

export const metadata = {
  title: "Blog — Digital Growth Insights",
  description:
    "Practical strategies for Cape Town businesses to improve visibility, attract leads, and grow online.",
  keywords: [
    "Cape Town digital marketing blog",
    "SEO tips South Africa",
    "WhatsApp lead generation",
    "small business growth strategies",
  ],
  alternates: { canonical: "https://www.tishbitedigital.co.za/blog" },
  openGraph: {
    title: "Digital Growth Insights — Tishbite Digital Blog",
    description:
      "Practical strategies for Cape Town businesses to improve visibility, attract leads, and grow online.",
    url: "https://www.tishbitedigital.co.za/blog",
    images: [{ url: "https://www.tishbitedigital.co.za/assets/tishbiteHero.png" }],
  },
};

const FALLBACK_POSTS = [
  {
    _id: "fb-seo",
    title: "How to Get Your Cape Town Business Found on Google",
    slug: "get-cape-town-business-found-google",
    excerpt: "Learn the key local SEO strategies that help service businesses in Cape Town rank higher and attract more qualified enquiries.",
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
      .select("title content author image createdAt")
      .sort({ createdAt: -1 })
      .lean();
    if (!posts.length) return FALLBACK_POSTS;
    return posts.map((post) => ({
      ...post,
      _id: String(post._id),
      createdAt: post.createdAt?.toISOString?.() || post.createdAt,
    }));
  } catch {
    return FALLBACK_POSTS;
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHeader
        title="Digital Growth Insights"
        subtitle="Practical strategies for Cape Town businesses to improve visibility, attract leads, and grow online."
        background="dark"
      />

      <section className="py-14 bg-bg">
        <div className="container mx-auto px-4 max-w-7xl">
          <BlogGrid posts={posts} />
        </div>
      </section>
    </>
  );
}
