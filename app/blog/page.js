"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://tishbitedigital-api.onrender.com";

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

export default function BlogPage() {
  const [posts, setPosts] = useState(FALLBACK_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch(`${API_URL}/api/blogs`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) setPosts(data);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <PageHeader
        title="Digital Growth Insights"
        subtitle="Practical strategies for Cape Town businesses to improve visibility, attract leads, and grow online."
        background="dark"
      />

      <section className="py-14 bg-bg">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading && <p className="text-text-muted text-sm text-center py-8">Loading articles...</p>}
          {!loading && posts.length === 0 && (
            <p className="text-text-muted text-sm text-center py-8">No articles yet. Check back soon!</p>
          )}
          {posts.length > 0 && (
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
                  <div className="aspect-[16/9] bg-primary/5 overflow-hidden">
                    {post.image ? (
                      <Image
                        src={post.image.startsWith("http") ? post.image : `${API_URL}${post.image}`}
                        alt={post.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
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
          )}
        </div>
      </section>
    </>
  );
}
