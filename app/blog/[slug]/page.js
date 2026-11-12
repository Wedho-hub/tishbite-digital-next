import { notFound, permanentRedirect } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";

// Code-split react-markdown into this route's own chunk instead of a
// shared/common one — it was previously loading on every page site-wide.
const ReactMarkdown = dynamic(() => import("react-markdown"));
import { FaExternalLinkAlt } from "react-icons/fa";
import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import LiteYouTube from "@/components/blog/LiteYouTube";
import { cloudinaryOptimizedUrl } from "@/lib/cloudinaryUrl";
import ArticleHeader from "@/components/blog/ArticleHeader";
import ArticleSidebar from "@/components/blog/ArticleSidebar";
import ArticleFooter from "@/components/blog/ArticleFooter";
import ReadingProgressBar from "@/components/blog/ReadingProgressBar";
import { Pullquote, Callout, Keypoints, Cta, DirectiveYoutube } from "@/components/blog/ArticleDirectives";
import {
  stripDuplicateLeadingH1,
  stripProductionCues,
  applySmartTypography,
  cleanExcerpt,
  cleanField,
  coverObjectPosition,
  estimateReadTime,
  extractHeadings,
  getArticleRemarkPlugins,
  getArticleRehypePlugins,
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

async function getRelatedPosts(post) {
  try {
    await connectDB();
    let related = await BlogPost.find({ _id: { $ne: post._id }, category: post.category })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("title slug image coverAlt")
      .lean();
    if (related.length < 3) {
      const excludeIds = [post._id, ...related.map((r) => r._id)];
      const extra = await BlogPost.find({ _id: { $nin: excludeIds } })
        .sort({ createdAt: -1 })
        .limit(3 - related.length)
        .select("title slug image coverAlt")
        .lean();
      related = [...related, ...extra];
    }
    return related;
  } catch {
    return [];
  }
}

async function getAdjacentPosts(post) {
  try {
    await connectDB();
    const [prevPost, nextPost] = await Promise.all([
      BlogPost.findOne({ createdAt: { $lt: post.createdAt } }).sort({ createdAt: -1 }).select("title slug").lean(),
      BlogPost.findOne({ createdAt: { $gt: post.createdAt } }).sort({ createdAt: 1 }).select("title slug").lean(),
    ]);
    return { prevPost, nextPost };
  } catch {
    return { prevPost: null, nextPost: null };
  }
}

function cleanedBody(post) {
  const stripped = stripProductionCues(stripDuplicateLeadingH1(post.content, post.title));
  return applySmartTypography(stripped);
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
      // No `images` here — opengraph-image.jsx (this route segment)
      // generates the og:image/twitter:image itself, using the post's
      // real cover photo when there is one. Setting both would risk
      // duplicate/conflicting image tags.
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description,
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

  const imageUrl = post.image ? cloudinaryOptimizedUrl(post.image) : null;
  const youtubeId = getYoutubeEmbedId(post.videoUrl);
  const content = cleanedBody(post);
  const url = `${SITE_URL}/blog/${post.slug}`;
  const description = getDescription(post, content);
  const readTime = estimateReadTime(content);
  const headings = extractHeadings(content);
  const tags = post.tags?.length ? post.tags : [];

  const [related, { prevPost, nextPost }] = await Promise.all([
    getRelatedPosts(post),
    getAdjacentPosts(post),
  ]);

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
        // JSON.stringify doesn't escape "</", so DB content (post title,
        // description) containing a literal "</script>" could prematurely
        // close this tag and inject markup after it — < neutralizes
        // that without changing the parsed JSON value at all.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ReadingProgressBar targetId="article-content" />

      {imageUrl && (
        <figure className="relative h-72 lg:h-112 overflow-hidden m-0">
          <Image
            src={imageUrl}
            alt={post.coverAlt || post.title}
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: coverObjectPosition(post.coverFocus) }}
            priority
          />
          <div className="absolute inset-0 bg-primary-dark/40" />
          {(post.coverCaption || post.coverCredit) && (
            <figcaption className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-surface-dark/70 text-white/80 text-xs">
              {cleanField(post.coverCaption)}
              {post.coverCaption && post.coverCredit && " — "}
              {cleanField(post.coverCredit)}
            </figcaption>
          )}
        </figure>
      )}

      <article id="article-content" className="py-10 lg:py-14 bg-bg">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-[68ch] mx-auto lg:max-w-none lg:mx-0">
            <ArticleHeader post={post} url={url} readTime={readTime} />
          </div>

          <div className="lg:grid lg:grid-cols-[1fr_17rem] lg:gap-10">
            <div className="max-w-[68ch] mx-auto lg:max-w-none lg:mx-0 min-w-0">
              {post.takeaways?.length > 0 && (
                <div className="mb-8">
                  <Keypoints title="Key takeaways">
                    <ul>
                      {post.takeaways.map((takeaway) => (
                        <li key={takeaway}>{takeaway}</li>
                      ))}
                    </ul>
                  </Keypoints>
                </div>
              )}

              {youtubeId && (
                <div
                  className={
                    post.videoOrientation === "portrait"
                      ? "mb-6 lg:float-right lg:w-72 lg:ml-8 lg:mb-4"
                      : "mb-8"
                  }
                >
                  <LiteYouTube id={youtubeId} title={post.title} orientation={post.videoOrientation} />
                </div>
              )}

              <div className="prose prose-tishbite prose-lg has-dropcap max-w-none prose-img:rounded-xl">
                {content ? (
                  <ReactMarkdown
                    remarkPlugins={getArticleRemarkPlugins(post.ctaVariant)}
                    rehypePlugins={getArticleRehypePlugins()}
                    components={{
                      a: ArticleLink,
                      pullquote: Pullquote,
                      callout: Callout,
                      keypoints: Keypoints,
                      cta: Cta,
                      youtube: DirectiveYoutube,
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-text-muted">{post.excerpt}</p>
                )}
              </div>

              <div className="max-w-none clear-both">
                <ArticleFooter post={post} url={url} tags={tags} related={related} prevPost={prevPost} nextPost={nextPost} />
              </div>
            </div>

            <aside className="mt-10 lg:mt-0">
              <ArticleSidebar headings={headings} />
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
