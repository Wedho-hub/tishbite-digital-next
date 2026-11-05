import { notFound, permanentRedirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// Code-split react-markdown into this route's own chunk instead of a
// shared/common one — it was previously loading on every page site-wide.
const ReactMarkdown = dynamic(() => import("react-markdown"));
import { FaArrowRight, FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import LiteYouTube from "@/components/blog/LiteYouTube";
import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import {
  stripDuplicateLeadingH1,
  stripProductionCues,
  applySmartTypography,
  cleanExcerpt,
  remarkDowngradeH1,
  remarkDirectiveToHast,
} from "@/lib/blog";

export const revalidate = 300;

const SITE_URL = "https://www.tishbitedigital.co.za";
const isObjectId = (value) => /^[0-9a-fA-F]{24}$/.test(String(value || ""));

// Accepts watch?v=, youtu.be/, embed/, and shorts/ URL formats.
function getYoutubeEmbedId(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.slice(1) || null;
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname === "/watch") return parsed.searchParams.get("v");
      const match = parsed.pathname.match(/^\/(embed|shorts)\/([^/?]+)/);
      if (match) return match[2];
    }
    return null;
  } catch {
    return null;
  }
}

async function getPostBySlug(slug) {
  try {
    await connectDB();
    return await BlogPost.findOne({ slug }).lean();
  } catch {
    return null;
  }
}

async function getPostById(id) {
  try {
    await connectDB();
    return await BlogPost.findById(id).lean();
  } catch {
    return null;
  }
}

// Resolves a post for a given route param, which may be a real slug or a
// legacy Mongo ID from before slugs existed. Never redirects itself —
// callers decide what to do with a slug mismatch.
async function resolvePost(param) {
  const bySlug = await getPostBySlug(param);
  if (bySlug) return bySlug;
  if (isObjectId(param)) return getPostById(param);
  return null;
}

function cleanedBody(post) {
  const stripped = stripProductionCues(stripDuplicateLeadingH1(post.content, post.title));
  return applySmartTypography(stripped);
}

// Short admin-authored fields (excerpt, metaDescription) go through the
// same cue-stripping/typography pass as the body — otherwise a raw
// "[Pause]" or literal "--" in the excerpt leaks straight into the meta
// description and JSON-LD, bypassing every fix applied to the article
// body itself.
function cleanField(text) {
  return applySmartTypography(stripProductionCues(String(text || "")));
}

function getDescription(post, content) {
  const metaDescription = cleanField(post.metaDescription);
  if (metaDescription) return metaDescription;
  const excerpt = cleanField(post.excerpt);
  if (excerpt) return excerpt;
  return cleanExcerpt(content, 155);
}

// Link renderer: external links open in a new tab with a small ↗ marker;
// internal links behave like any other in-page link.
function ArticleLink({ href = "", children, ...rest }) {
  const isExternal = /^https?:\/\//i.test(href) && !href.includes("tishbitedigital.co.za");
  if (!isExternal) {
    return <a href={href} {...rest}>{children}</a>;
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
      <FaExternalLinkAlt className="inline-block ml-1 mb-0.5" size={10} aria-hidden="true" />
    </a>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await resolvePost(slug);
  if (!post) return { title: "Article Not Found" };

  const canonicalSlug = post.slug || slug;
  const description = getDescription(post, cleanedBody(post));
  const url = `${SITE_URL}/blog/${canonicalSlug}`;

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
      publishedTime: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
      modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
      authors: post.author ? [post.author] : undefined,
      images: post.image ? [{ url: post.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = await resolvePost(slug);
  if (!post) notFound();

  // Legacy ID URL, or a slug that's since changed — send a permanent
  // redirect to the canonical slug URL rather than serving duplicate
  // content at two addresses.
  if (post.slug && post.slug !== slug) {
    permanentRedirect(`/blog/${post.slug}`);
  }

  const imageUrl = post.image || null;
  const youtubeId = getYoutubeEmbedId(post.videoUrl);
  const content = cleanedBody(post);
  const url = `${SITE_URL}/blog/${post.slug}`;
  const description = getDescription(post, content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description,
        image: post.image ? [post.image] : undefined,
        datePublished: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
        dateModified: new Date(post.updatedAt || post.createdAt).toISOString(),
        author: { "@type": "Person", name: post.author || "Tishbite Digital" },
        publisher: {
          "@type": "Organization",
          name: "Tishbite Digital",
          logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {imageUrl && (
        <div className="relative h-72 lg:h-96 overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.coverAlt || post.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary-dark/50" />
        </div>
      )}
      {!imageUrl && <PageHeader title={post.title} background="dark" />}

      <article className="py-14 bg-bg">
        <div className="container mx-auto px-4 max-w-[68ch]">
          {imageUrl && (
            <h1
              className="text-3xl lg:text-4xl font-extrabold text-primary-dark mb-4 leading-tight"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {post.title}
            </h1>
          )}
          {imageUrl && (post.coverCaption || post.coverCredit) && (
            <p className="text-text-muted text-xs mb-6 -mt-2">
              {post.coverCaption}
              {post.coverCaption && post.coverCredit && " — "}
              {post.coverCredit}
            </p>
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

          {youtubeId && (
            <div className="mb-8">
              <LiteYouTube id={youtubeId} title={post.title} />
            </div>
          )}

          <div className="prose prose-tishbite prose-lg max-w-none prose-img:rounded-xl">
            {content ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkDirective, remarkDirectiveToHast, remarkDowngradeH1]}
                rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]}
                components={{ a: ArticleLink }}
              >
                {content}
              </ReactMarkdown>
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
