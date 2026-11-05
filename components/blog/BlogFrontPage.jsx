import Link from "next/link";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import Reveal from "@/components/Reveal";
import CategoryChips from "@/components/blog/CategoryChips";
import { slugify } from "@/lib/blog";
import { cloudinaryOptimizedUrl } from "@/lib/cloudinaryUrl";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" });
}

function PostPlaceholder({ className = "" }) {
  return (
    <div className={`w-full h-full flex items-center justify-center bg-linear-to-br from-primary/10 to-accent/10 ${className}`}>
      <span className="text-primary/30 text-4xl font-bold">TD</span>
    </div>
  );
}

function LeadStory({ post, index = 0 }) {
  return (
    <Reveal variant="up" index={index} className="block mb-10">
      <Link
        href={`/blog/${post.slug || post._id}`}
        className="group grid md:grid-cols-2 rounded-2xl overflow-hidden border border-primary/10 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 no-underline"
      >
        <div className="relative aspect-video md:aspect-auto overflow-hidden">
          {post.image ? (
            <Image
              src={cloudinaryOptimizedUrl(post.image, { width: 960 })}
              alt={post.coverAlt || post.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
            />
          ) : (
            <PostPlaceholder />
          )}
        </div>
        <div className="flex flex-col justify-center p-6 lg:p-10">
          {post.category && (
            <span className="inline-block mb-3 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-accent/20 text-accent-dark self-start">
              {post.category}
            </span>
          )}
          <h2 className="font-editorial text-2xl lg:text-4xl font-bold text-primary-dark leading-tight mb-3 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          {(post.deck || post.excerpt) && (
            <p className="text-text-muted text-sm lg:text-base leading-relaxed mb-5 line-clamp-3">
              {post.deck || post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-4 text-text-muted text-xs mb-5">
            {post.author && <span className="font-semibold text-text-dark">{post.author}</span>}
            {post.createdAt && <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>}
          </div>
          <span className="inline-flex items-center gap-2 text-primary font-bold text-sm">
            Read the story <FaArrowRight size={12} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

function SecondaryCard({ post, index = 0 }) {
  return (
    <Reveal variant="up" index={index} className="block h-full">
      <Link
        href={`/blog/${post.slug || post._id}`}
        className="group flex flex-col h-full rounded-xl overflow-hidden border border-primary/10 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 no-underline"
      >
        <div className="relative aspect-video overflow-hidden">
          {post.image ? (
            <Image
              src={cloudinaryOptimizedUrl(post.image, { width: 640 })}
              alt={post.coverAlt || post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <PostPlaceholder />
          )}
        </div>
        <div className="flex flex-col flex-1 p-5">
          {post.category && (
            <span className="inline-block mb-2 text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary self-start">
              {post.category}
            </span>
          )}
          <h3 className="font-editorial text-base font-bold text-primary-dark mb-2 leading-snug flex-1 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          {post.createdAt && (
            <time className="text-text-muted text-xs pt-3 border-t border-primary/8" dateTime={post.createdAt}>
              {formatDate(post.createdAt)}
            </time>
          )}
        </div>
      </Link>
    </Reveal>
  );
}

function CompactRow({ post, index = 0 }) {
  return (
    <Reveal variant="up" index={index} className="block">
      <Link
        href={`/blog/${post.slug || post._id}`}
        className="group flex items-center gap-4 py-4 border-b border-primary/8 no-underline"
      >
        <div className="relative w-20 h-16 shrink-0 rounded-lg overflow-hidden bg-surface-tint">
          {post.image ? (
            <Image src={cloudinaryOptimizedUrl(post.image, { width: 160 })} alt={post.coverAlt || post.title} fill sizes="80px" className="object-cover" />
          ) : (
            <PostPlaceholder />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {post.category && (
            <p className="text-xs font-bold text-primary mb-1">{post.category}</p>
          )}
          <p className="text-sm font-semibold text-text-dark group-hover:text-primary-dark leading-snug line-clamp-2">
            {post.title}
          </p>
        </div>
        <FaArrowRight className="text-primary/40 group-hover:text-primary shrink-0 transition-colors" size={12} aria-hidden="true" />
      </Link>
    </Reveal>
  );
}

function AuditCtaCard() {
  return (
    <div className="rounded-xl bg-linear-to-br from-primary-dark to-primary p-6 text-center">
      <p className="text-white font-bold text-sm m-0 mb-3">Not getting found online?</p>
      <p className="text-white/80 text-xs m-0 mb-4">
        Get a free, no-pressure audit of your website and Google presence.
      </p>
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-primary-dark font-bold text-xs no-underline hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
      >
        Get a Free Audit <FaArrowRight size={10} aria-hidden="true" />
      </Link>
    </div>
  );
}

function SidebarRail({ categories }) {
  return (
    <aside className="space-y-6">
      <AuditCtaCard />

      {categories?.length > 0 && (
        <div className="rounded-xl border border-primary/15 bg-surface-tint p-5">
          <p className="font-bold text-primary-dark text-sm mb-3">Browse by category</p>
          <ul className="space-y-2 list-none m-0 p-0">
            {categories.map(({ name, count }) => (
              <li key={name}>
                <Link
                  href={`/blog/category/${slugify(name)}`}
                  className="flex items-center justify-between text-text-muted text-sm no-underline hover:text-primary-dark transition-colors"
                >
                  <span>{name}</span>
                  <span className="text-xs opacity-60">{count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}

export default function BlogFrontPage({ posts, categories, activeCategory }) {
  if (!posts || posts.length === 0) {
    return (
      <div>
        <CategoryChips categories={categories} activeCategory={activeCategory} />
        <p className="text-text-muted text-sm text-center py-16">
          No articles here yet. Check back soon!
        </p>
      </div>
    );
  }

  // A single post (a brand-new blog, or a just-created category) still
  // needs to look intentional rather than like a half-built page — no
  // empty secondary row or compact list, just the lead story and a
  // friendly note about more being on the way.
  if (posts.length === 1) {
    return (
      <div>
        <CategoryChips categories={categories} activeCategory={activeCategory} />
        <LeadStory post={posts[0]} />
        <p className="text-text-muted text-sm text-center py-6">More articles are on the way.</p>
      </div>
    );
  }

  const [lead, ...rest] = posts;
  const secondary = rest.slice(0, 3);
  const compact = rest.slice(3);

  return (
    <div>
      <CategoryChips categories={categories} activeCategory={activeCategory} />
      <LeadStory post={lead} />

      {secondary.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {secondary.map((post, i) => (
            <SecondaryCard key={post._id} post={post} index={i + 1} />
          ))}
        </div>
      )}

      {compact.length > 0 ? (
        <div className="lg:grid lg:grid-cols-[1fr_20rem] lg:gap-10">
          <div>
            {compact.map((post, i) => (
              <CompactRow key={post._id} post={post} index={i + 4} />
            ))}
          </div>
          <div className="mt-8 lg:mt-0">
            <SidebarRail categories={categories} />
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <AuditCtaCard />
        </div>
      )}
    </div>
  );
}
