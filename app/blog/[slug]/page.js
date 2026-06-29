import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { FaArrowRight, FaCalendarAlt } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";

export const revalidate = 300;

async function getPost(id) {
  try {
    await connectDB();
    const post = await BlogPost.findById(id).lean();
    return post;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article Not Found" };

  const plainContent = String(post.content || "").replace(/[#>*_`~[\]()]/g, "").trim();
  const description = post.metaDescription || `${plainContent.slice(0, 155)}…`;
  const url = `https://tishbitedigital.co.za/blog/${slug}`;

  return {
    title: post.metaTitle || post.title,
    description,
    alternates: { canonical: url },
    keywords: post.keywords?.length ? post.keywords : undefined,
    openGraph: {
      title: post.metaTitle || post.title,
      description,
      url,
      type: "article",
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const imageUrl = post.image || null;

  return (
    <>
      {imageUrl && (
        <div className="relative h-72 lg:h-96 overflow-hidden">
          <Image src={imageUrl} alt={post.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-primary-dark/50" />
        </div>
      )}
      {!imageUrl && (
        <PageHeader title={post.title} background="dark" />
      )}

      <article className="py-14 bg-bg">
        <div className="container mx-auto px-4 max-w-3xl">
          {imageUrl && (
            <h1
              className="text-3xl lg:text-4xl font-extrabold text-primary-dark mb-4 leading-tight"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {post.title}
            </h1>
          )}

          <div className="flex items-center gap-4 text-text-muted text-xs mb-8">
            {post.category && (
              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold">
                {post.category}
              </span>
            )}
            {post.createdAt && (
              <span className="flex items-center gap-1">
                <FaCalendarAlt aria-hidden="true" />
                {new Date(post.createdAt).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            )}
          </div>

          <div className="prose prose-base max-w-none prose-headings:font-bold prose-headings:text-primary-dark prose-a:text-primary prose-strong:text-text-dark prose-img:rounded-xl text-text-dark">
            {post.content ? (
              <ReactMarkdown>{post.content}</ReactMarkdown>
            ) : (
              <p className="text-text-muted">{post.excerpt}</p>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-primary/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link href="/blog" className="text-primary font-semibold text-sm no-underline hover:text-primary-dark">
              ← Back to Blog
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-primary-dark to-primary-light text-white font-bold text-sm no-underline hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
            >
              Get a Free Audit <FaArrowRight size={12} />
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
