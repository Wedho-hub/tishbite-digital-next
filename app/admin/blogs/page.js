"use client";

import { useState, useEffect } from "react";
import { authFetch, resolveUploadUrl } from "@/lib/adminApi";
import { FaEdit, FaTrash, FaTimes, FaSync } from "react-icons/fa";

// Local copy of lib/blog.js's slugify — avoids pulling the markdown/unist
// pipeline (server-oriented) into this client bundle for one tiny helper.
function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default function ManageBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [coverAlt, setCoverAlt] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  // Slug auto-follows the title until the admin edits it directly —
  // after that, title changes no longer touch it (stable permalinks).
  const handleTitleChange = (value) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };
  const handleSlugChange = (value) => {
    setSlugTouched(true);
    setSlug(slugify(value));
  };

  const fetchBlogs = async () => {
    try {
      const res = await authFetch("/api/blogs?summary=false&all=true&admin=true");
      if (!res.ok) throw new Error("Failed to load blog posts");
      const data = await res.json();
      setBlogs(data.data || data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchBlogs();
    })();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setTitle(""); setSlug(""); setSlugTouched(false);
    setContent(""); setExcerpt(""); setCategory(""); setVideoUrl(""); setCoverAlt("");
    setImage(null); setImagePreview(""); setCurrentImageUrl("");
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file || null);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    if (!title.trim()) { setError("Title cannot be empty."); return; }
    if (!content.trim()) { setError("Content cannot be empty."); return; }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (slug.trim()) formData.append("slug", slug.trim());
    if (excerpt.trim()) formData.append("excerpt", excerpt);
    if (category.trim()) formData.append("category", category);
    if (videoUrl.trim()) formData.append("videoUrl", videoUrl);
    if (coverAlt.trim()) formData.append("coverAlt", coverAlt);
    if (image) formData.append("image", image);

    setSubmitting(true);
    setError("");
    try {
      const res = editing
        ? await authFetch(`/api/blogs/${editing}`, { method: "PUT", body: formData })
        : await authFetch("/api/blogs", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save blog post");
      }
      setSuccess(editing ? "Blog post updated." : "Blog post created.");
      resetForm();
      fetchBlogs();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (blog) => {
    setEditing(blog._id);
    setTitle(blog.title);
    setSlug(blog.slug || "");
    setSlugTouched(true); // editing an existing post: don't auto-regenerate from title
    setContent(blog.content || "");
    setExcerpt(blog.excerpt || "");
    setCategory(blog.category || "");
    setVideoUrl(blog.videoUrl || "");
    setCoverAlt(blog.coverAlt || "");
    setCurrentImageUrl(resolveUploadUrl(blog.image) || "");
    setImage(null);
    setImagePreview("");
    setSuccess("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this blog post?")) return;
    try {
      await authFetch(`/api/blogs/${id}`, { method: "DELETE" });
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch {
      setError("Error deleting blog post");
    }
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl border border-[#0f2016]/15 bg-white text-[#0f2016] text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors duration-200";

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      {/* Form */}
      <div className="bg-white rounded-2xl border border-[#0f2016]/8 p-6">
        <h2
          className="text-base font-bold text-[#0f2016] mb-4"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          {editing ? "Edit Blog Post" : "New Blog Post"}
        </h2>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col gap-4">
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Post title"
            disabled={submitting}
            className={inputBase}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#0f2016]/40 text-xs shrink-0">/blog/</span>
              <input
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="auto-generated-from-title"
                disabled={submitting}
                className={`${inputBase} font-mono text-xs`}
              />
              {slugTouched && (
                <button
                  type="button"
                  onClick={() => { setSlugTouched(false); setSlug(slugify(title)); }}
                  disabled={submitting}
                  title="Reset to title-derived slug"
                  className="shrink-0 w-9 h-9 rounded-lg bg-[#0f2016]/5 text-[#0f2016]/60 hover:bg-[#0f2016]/10 flex items-center justify-center border-0 cursor-pointer"
                >
                  <FaSync size={11} />
                </button>
              )}
            </div>
            <p className="text-[#0f2016]/40 text-xs mt-1">
              The URL for this post. Changing it after publishing breaks any links already shared to the old one.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category (e.g. SEO, Web Design)"
              disabled={submitting}
              className={inputBase}
            />
            <input
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short excerpt (optional)"
              disabled={submitting}
              className={inputBase}
            />
          </div>
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="YouTube video URL (optional)"
            disabled={submitting}
            className={inputBase}
          />
          <div>
            <p className="text-[#0f2016]/50 text-xs mb-1.5">
              Markdown supported: `**bold**`, `- list`, `# heading`, blank line for new paragraph
            </p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content (Markdown supported)"
              rows={10}
              disabled={submitting}
              className={`${inputBase} resize-y font-mono text-xs`}
            />
          </div>
          <div>
            <label className="block text-[#0f2016]/60 text-xs font-semibold mb-1.5">
              Cover Image (max 5MB, JPEG/PNG/WebP)
            </label>
            <input
              value={coverAlt}
              onChange={(e) => setCoverAlt(e.target.value)}
              placeholder="Alt text for the cover image (describe it for screen readers & SEO)"
              disabled={submitting}
              className={`${inputBase} mb-2`}
            />
            {editing && currentImageUrl && !imagePreview && (
              <div className="mb-2">
                <p className="text-[#0f2016]/50 text-xs mb-1">Current image:</p>
                <img src={currentImageUrl} alt="Current" className="w-24 h-16 object-cover rounded-lg border border-[#0f2016]/10" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={submitting}
              className="text-sm text-[#0f2016]/70 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:text-xs hover:file:bg-primary/20 cursor-pointer"
            />
            {imagePreview && (
              <div className="mt-2">
                <p className="text-[#0f2016]/50 text-xs mb-1">New image:</p>
                <img src={imagePreview} alt="Preview" className="w-24 h-16 object-cover rounded-lg border border-[#0f2016]/10" />
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-linear-to-r from-primary-dark to-primary-light text-white font-bold text-sm hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {submitting ? "Saving..." : editing ? "Update" : "Create"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={resetForm}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl border border-[#0f2016]/20 text-[#0f2016]/70 font-semibold text-sm hover:bg-[#0f2016]/5 transition-colors duration-200 flex items-center gap-2"
              >
                <FaTimes size={12} /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-[#0f2016]/8 overflow-hidden">
        {loading && <p className="text-[#0f2016]/50 text-sm p-5">Loading posts...</p>}
        {!loading && blogs.length === 0 && (
          <p className="text-[#0f2016]/50 text-sm p-5">No blog posts yet.</p>
        )}
        {blogs.map((blog, i) => (
          <div
            key={blog._id}
            className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? "border-t border-[#0f2016]/6" : ""}`}
          >
            {blog.image && (
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#0f2016]/5">
                <img
                  src={resolveUploadUrl(blog.image)}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p
                className="font-semibold text-sm text-[#0f2016] truncate"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                {blog.title}
              </p>
              {blog.category && (
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary mt-0.5">
                  {blog.category}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(blog)}
                className="w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors duration-200 border-0 cursor-pointer"
              >
                <FaEdit size={12} />
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
                className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors duration-200 border-0 cursor-pointer"
              >
                <FaTrash size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
