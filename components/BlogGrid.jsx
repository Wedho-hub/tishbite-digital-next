"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogGrid({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <p className="text-text-muted text-sm text-center py-8">No articles yet. Check back soon!</p>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {posts.map((post) => (
        <motion.article
          key={post._id}
          variants={fadeUp}
          className="flex flex-col bg-white rounded-2xl border border-primary/8 shadow-sm hover:shadow-md hover:-translate-y-0.5 overflow-hidden transition-all duration-300"
        >
          <div className="aspect-video bg-primary/5 overflow-hidden">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.title}
                width={400}
                height={225}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <span className="text-primary/30 text-4xl font-bold">TD</span>
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1 p-5">
            {post.category && (
              <span className="inline-block mb-2 text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary self-start">
                {post.category}
              </span>
            )}
            <h2
              className="text-base font-bold text-primary-dark mb-2 leading-snug flex-1"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-text-muted text-sm leading-relaxed mb-3 line-clamp-3">
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-primary/8">
              <time className="text-text-muted text-xs" dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
              <Link
                href={`/blog/${post.slug || post._id}`}
                className="inline-flex items-center gap-1 text-primary font-semibold text-xs hover:text-primary-dark transition-colors no-underline"
              >
                Read More <FaArrowRight size={10} />
              </Link>
            </div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}
