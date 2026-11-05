import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import BlogFrontPage from "@/components/blog/BlogFrontPage";
import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { slugify, getCategoryCounts, cleanField } from "@/lib/blog";

export const revalidate = 300;

const SITE_URL = "https://www.tishbitedigital.co.za";

// Categories are free text in the DB, so the URL slug has to be
// resolved back to whichever original string matches it — there's no
// stored slug for categories to look up directly.
async function resolveCategory(param) {
  try {
    await connectDB();
    const allCategories = await BlogPost.distinct("category");
    return allCategories.find((category) => category && slugify(category) === param) || null;
  } catch {
    return null;
  }
}

async function getAllPosts() {
  try {
    await connectDB();
    const posts = await BlogPost.find()
      .select("title slug deck excerpt category author image coverAlt featured createdAt")
      .sort({ createdAt: -1 })
      .lean();
    return posts.map((post) => ({
      ...post,
      _id: String(post._id),
      excerpt: cleanField(post.excerpt),
      deck: cleanField(post.deck),
      createdAt: post.createdAt?.toISOString?.() || post.createdAt,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const resolved = await resolveCategory(category);
  if (!resolved) return { title: "Category Not Found" };

  return {
    title: `${resolved} — Blog`,
    description: `Articles about ${resolved} from Tishbite Digital.`,
    alternates: { canonical: `${SITE_URL}/blog/category/${category}` },
  };
}

export default async function BlogCategoryPage({ params }) {
  const { category } = await params;
  const resolved = await resolveCategory(category);
  if (!resolved) notFound();

  const allPosts = await getAllPosts();
  const categoryPosts = allPosts.filter((post) => post.category === resolved);
  const categories = getCategoryCounts(allPosts);

  return (
    <>
      <PageHeader title={resolved} subtitle="Articles in this category." background="dark" />

      <section className="py-14 bg-bg">
        <div className="container mx-auto px-4 max-w-7xl">
          <BlogFrontPage posts={categoryPosts} categories={categories} activeCategory={resolved} />
        </div>
      </section>
    </>
  );
}
