import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ShareButtons from "@/components/blog/ShareButtons";

export default function ArticleFooter({ post, url, tags, related, prevPost, nextPost }) {
  return (
    <footer className="article-footer-share mt-14 pt-8 border-t border-primary/10">
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full bg-primary/8 text-primary text-xs font-semibold">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <Link href="/blog" className="text-primary font-semibold text-sm no-underline hover:text-primary-dark">
          ← Back to Blog
        </Link>
        <ShareButtons url={url} title={post.title} />
      </div>

      {(prevPost || nextPost) && (
        <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12" aria-label="Post navigation">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="group flex items-center gap-3 p-4 rounded-xl border border-primary/10 no-underline hover:border-primary/30 transition-colors"
            >
              <FaArrowLeft className="text-primary flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs text-text-muted mb-1">Previous</p>
                <p className="text-sm font-semibold text-text-dark group-hover:text-primary-dark">
                  {prevPost.title}
                </p>
              </div>
            </Link>
          ) : (
            <div aria-hidden="true" />
          )}
          {nextPost && (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="group flex items-center justify-end gap-3 p-4 rounded-xl border border-primary/10 no-underline hover:border-primary/30 transition-colors text-right"
            >
              <div>
                <p className="text-xs text-text-muted mb-1">Next</p>
                <p className="text-sm font-semibold text-text-dark group-hover:text-primary-dark">
                  {nextPost.title}
                </p>
              </div>
              <FaArrowRight className="text-primary flex-shrink-0" aria-hidden="true" />
            </Link>
          )}
        </nav>
      )}

      {related?.length > 0 && (
        <div>
          <p className="font-bold text-primary-dark text-lg mb-5">Further reading</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {related.map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className="group no-underline">
                <div className="relative h-32 rounded-lg overflow-hidden bg-surface-tint mb-3">
                  {r.image && (
                    <Image
                      src={r.image}
                      alt={r.coverAlt || r.title}
                      fill
                      sizes="300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <p className="text-sm font-semibold text-text-dark group-hover:text-primary-dark leading-snug">
                  {r.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </footer>
  );
}
