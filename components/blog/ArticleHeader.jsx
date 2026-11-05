import { FaCalendarAlt, FaClock } from "react-icons/fa";
import ShareButtons from "@/components/blog/ShareButtons";

export default function ArticleHeader({ post, url, readTime }) {
  return (
    <header className="mb-8">
      {post.category && (
        <p className="text-xs font-bold uppercase tracking-wider text-primary mb-3">{post.category}</p>
      )}
      <h1 className="font-editorial text-3xl lg:text-5xl font-bold text-primary-dark leading-tight mb-4">
        {post.title}
      </h1>
      {post.deck && (
        <p className="font-editorial text-lg lg:text-xl text-text-muted italic leading-snug mb-5">
          {post.deck}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-primary/10">
        <div className="flex items-center gap-3 text-text-muted text-xs">
          {post.author && <span className="font-semibold text-text-dark">{post.author}</span>}
          {post.createdAt && (
            <span className="flex items-center gap-1">
              <FaCalendarAlt aria-hidden="true" />
              {new Date(post.createdAt).toLocaleDateString("en-ZA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
          {readTime && (
            <span className="flex items-center gap-1">
              <FaClock aria-hidden="true" /> {readTime} min read
            </span>
          )}
        </div>
        <ShareButtons url={url} title={post.title} />
      </div>
    </header>
  );
}
