"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { authFetch, resolveUploadUrl } from "@/lib/adminApi";
import { FaEdit, FaTrash, FaTimes, FaSync, FaEye, FaEyeSlash, FaExclamationTriangle } from "react-icons/fa";
import {
  slugify,
  stripDuplicateLeadingH1,
  stripProductionCues,
  applySmartTypography,
  remarkDowngradeH1,
  remarkDirectiveToHast,
  remarkHighlightMark,
  remarkMagazineHeadings,
  remarkAutoInsertCta,
  rehypeFigureImages,
} from "@/lib/blog";
import { Pullquote, Callout, Keypoints, Cta, DirectiveYoutube } from "@/components/blog/ArticleDirectives";

// Loaded lazily (only once the preview pane is opened) — this is the
// same real renderer/plugin pipeline the public article page uses, so
// "preview" means what it says rather than an approximation.
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

const EXCERPT_LIMIT = 160;

const SNIPPETS = [
  { label: "H2 (numbered)", insert: "## 1. Section heading" },
  { label: "Pull quote", insert: ':::pullquote{cite="Source name"}\nA striking line worth pulling out on its own.\n:::' },
  { label: "Callout", insert: ':::callout{type="tip" title="Heads up"}\nA short, useful note for the reader.\n:::' },
  { label: "Key takeaways", insert: ':::keypoints{title="Key takeaways"}\n- First takeaway\n- Second takeaway\n- Third takeaway\n:::' },
  { label: "Inline CTA", insert: '::cta{title="Want help with this?" button="Get a Free Audit" href="/contact"}' },
  { label: "YouTube embed", insert: '::youtube{id="VIDEO_ID" title="Video title"}' },
  { label: "Highlight", insert: "==highlighted text==" },
];

const CTA_VARIANTS = [
  { value: "audit", label: "Free audit (default)" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "newsletter", label: "Newsletter / get in touch" },
  { value: "none", label: "None — don't auto-insert one" },
];

export default function ManageBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [deck, setDeck] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [categoryMode, setCategoryMode] = useState("select");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [coverAlt, setCoverAlt] = useState("");
  const [coverCaption, setCoverCaption] = useState("");
  const [coverCredit, setCoverCredit] = useState("");
  const [featured, setFeatured] = useState(false);
  const [takeaways, setTakeaways] = useState("");
  const [ctaVariant, setCtaVariant] = useState("audit");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  const contentRef = useRef(null);

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

  const existingCategories = useMemo(
    () => Array.from(new Set(blogs.map((b) => b.category).filter(Boolean))).sort(),
    [blogs]
  );

  const resetForm = () => {
    setEditing(null);
    setTitle(""); setSlug(""); setSlugTouched(false);
    setDeck(""); setContent(""); setExcerpt("");
    setCategory(""); setCategoryMode("select"); setAuthor(""); setTags("");
    setVideoUrl(""); setCoverAlt(""); setCoverCaption(""); setCoverCredit("");
    setFeatured(false); setTakeaways(""); setCtaVariant("audit");
    setImage(null); setImagePreview(""); setCurrentImageUrl("");
    setShowPreview(false);
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file || null);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  };

  // Inserts a directive snippet at the textarea's current cursor
  // position (or appends if nothing's focused yet), on its own blank
  // line, and leaves the cursor right after it.
  const insertSnippet = (snippet) => {
    const el = contentRef.current;
    const start = el ? el.selectionStart : content.length;
    const end = el ? el.selectionEnd : content.length;
    const before = content.slice(0, start);
    const after = content.slice(end);
    const prefix = before.length === 0 ? "" : before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
    const insertion = `${prefix}${snippet}\n\n`;
    setContent(before + insertion + after);
    requestAnimationFrame(() => {
      if (!el) return;
      const pos = before.length + insertion.length;
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  };

  // Non-blocking quality checklist — nothing here stops a post from
  // being saved, it just flags the same things the public blog's Phase
  // 1 fixes already compensate for (missing excerpt, leftover script
  // cues, etc.) so the admin can catch them before publishing instead.
  const checklist = useMemo(() => {
    const warnings = [];
    const hasImage = Boolean(image || currentImageUrl);

    if (!excerpt.trim()) warnings.push("No excerpt — search engines will fall back to an auto-generated snippet.");
    else if (excerpt.length > EXCERPT_LIMIT) warnings.push(`Excerpt is ${excerpt.length} characters — meta descriptions get cut off past ~${EXCERPT_LIMIT}.`);

    if (!category.trim()) warnings.push("No category selected.");
    if (!hasImage) warnings.push("No cover image.");
    if (hasImage && !coverAlt.trim()) warnings.push("Cover image has no alt text.");
    if (!author.trim()) warnings.push("No author set.");
    if (!tags.trim()) warnings.push("No tags — related posts and filtering rely on these.");
    if (content.trim() && !/^##?\s/m.test(content)) warnings.push("No headings in the content — long posts read better with section breaks.");
    if (content && stripProductionCues(content) !== content) warnings.push("Looks like a leftover script cue ([Pause], [B-roll]...) is still in the content.");
    if (/(?<!-)--(?!-)/.test(content.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, ""))) {
      warnings.push('Contains "--" or "---" — these get auto-converted to dashes, double check it reads right.');
    }

    return warnings;
  }, [excerpt, category, image, currentImageUrl, coverAlt, author, tags, content]);

  const previewContent = useMemo(
    () => applySmartTypography(stripProductionCues(stripDuplicateLeadingH1(content, title))),
    [content, title]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    if (!title.trim()) { setError("Title cannot be empty."); return; }
    if (!content.trim()) { setError("Content cannot be empty."); return; }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (slug.trim()) formData.append("slug", slug.trim());
    if (deck.trim()) formData.append("deck", deck);
    if (excerpt.trim()) formData.append("excerpt", excerpt);
    if (category.trim()) formData.append("category", category);
    if (author.trim()) formData.append("author", author);
    if (tags.trim()) formData.append("tags", tags);
    if (videoUrl.trim()) formData.append("videoUrl", videoUrl);
    if (coverAlt.trim()) formData.append("coverAlt", coverAlt);
    if (coverCaption.trim()) formData.append("coverCaption", coverCaption);
    if (coverCredit.trim()) formData.append("coverCredit", coverCredit);
    formData.append("featured", String(featured));
    if (takeaways.trim()) formData.append("takeaways", takeaways);
    formData.append("ctaVariant", ctaVariant);
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
    setDeck(blog.deck || "");
    setContent(blog.content || "");
    setExcerpt(blog.excerpt || "");
    const cat = blog.category || "";
    setCategory(cat);
    setCategoryMode("select");
    setAuthor(blog.author || "");
    setTags((blog.tags || []).join(", "));
    setVideoUrl(blog.videoUrl || "");
    setCoverAlt(blog.coverAlt || "");
    setCoverCaption(blog.coverCaption || "");
    setCoverCredit(blog.coverCredit || "");
    setFeatured(Boolean(blog.featured));
    setTakeaways((blog.takeaways || []).join("\n"));
    setCtaVariant(blog.ctaVariant || "audit");
    setCurrentImageUrl(resolveUploadUrl(blog.image) || "");
    setImage(null);
    setImagePreview("");
    setShowPreview(false);
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
  const labelBase = "block text-[#0f2016]/60 text-xs font-semibold mb-1.5";

  return (
    <div className="max-w-6xl flex flex-col gap-6">
      <div className={`grid grid-cols-1 gap-6 ${showPreview ? "lg:grid-cols-2" : ""}`}>
        {/* Form */}
        <div className="bg-white rounded-2xl border border-[#0f2016]/8 p-6 max-w-3xl">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-base font-bold text-[#0f2016]"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {editing ? "Edit Blog Post" : "New Blog Post"}
            </h2>
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors duration-200 border-0 cursor-pointer"
            >
              {showPreview ? <FaEyeSlash size={11} /> : <FaEye size={11} />}
              {showPreview ? "Hide preview" : "Show preview"}
            </button>
          </div>

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

            <input
              value={deck}
              onChange={(e) => setDeck(e.target.value)}
              placeholder="Deck — a one-line standfirst shown under the headline (optional)"
              disabled={submitting}
              className={inputBase}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelBase}>Category</label>
                {categoryMode === "select" ? (
                  <select
                    value={category}
                    onChange={(e) => {
                      if (e.target.value === "__new__") { setCategoryMode("new"); setCategory(""); }
                      else setCategory(e.target.value);
                    }}
                    disabled={submitting}
                    className={inputBase}
                  >
                    <option value="">Select a category…</option>
                    {existingCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="__new__">+ Add new category</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="New category name"
                      disabled={submitting}
                      className={inputBase}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => { setCategoryMode("select"); setCategory(""); }}
                      disabled={submitting}
                      className="shrink-0 px-3 rounded-lg border border-[#0f2016]/15 text-[#0f2016]/60 text-xs font-semibold hover:bg-[#0f2016]/5"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author"
                disabled={submitting}
                className={inputBase}
              />
            </div>

            <div>
              <input
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short excerpt — used for the meta description and preview cards"
                disabled={submitting}
                className={inputBase}
              />
              <p className={`text-xs mt-1 ${excerpt.length > EXCERPT_LIMIT ? "text-red-500 font-semibold" : "text-[#0f2016]/40"}`}>
                {excerpt.length}/{EXCERPT_LIMIT}
              </p>
            </div>

            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags — comma-separated, e.g. SEO, Local Business"
              disabled={submitting}
              className={inputBase}
            />

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
              <div className="flex flex-wrap gap-1.5 mb-2">
                {SNIPPETS.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => insertSnippet(s.insert)}
                    disabled={submitting}
                    className="px-2.5 py-1 rounded-md bg-[#0f2016]/5 text-[#0f2016]/70 text-[11px] font-semibold hover:bg-primary/10 hover:text-primary transition-colors duration-150 border-0 cursor-pointer"
                  >
                    + {s.label}
                  </button>
                ))}
              </div>
              <textarea
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content (Markdown supported)"
                rows={14}
                disabled={submitting}
                className={`${inputBase} resize-y font-mono text-xs`}
              />
            </div>

            {checklist.length > 0 && (
              <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
                <p className="flex items-center gap-2 text-amber-800 text-xs font-bold mb-2">
                  <FaExclamationTriangle size={11} /> Pre-publish checklist ({checklist.length})
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {checklist.map((w) => (
                    <li key={w} className="text-amber-700 text-xs">{w}</li>
                  ))}
                </ul>
                <p className="text-amber-700/70 text-[11px] mt-2">These are suggestions, not blockers — you can still save.</p>
              </div>
            )}

            <div>
              <label className={labelBase}>Cover Image (max 5MB, JPEG/PNG/WebP)</label>
              <input
                value={coverAlt}
                onChange={(e) => setCoverAlt(e.target.value)}
                placeholder="Alt text for the cover image (describe it for screen readers & SEO)"
                disabled={submitting}
                className={`${inputBase} mb-2`}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <input
                  value={coverCaption}
                  onChange={(e) => setCoverCaption(e.target.value)}
                  placeholder="Caption shown under the image (optional)"
                  disabled={submitting}
                  className={inputBase}
                />
                <input
                  value={coverCredit}
                  onChange={(e) => setCoverCredit(e.target.value)}
                  placeholder="Photo credit (optional)"
                  disabled={submitting}
                  className={inputBase}
                />
              </div>
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

            <div>
              <label className={labelBase}>Key takeaways (one per line, optional — shown as a box at the top of the article)</label>
              <textarea
                value={takeaways}
                onChange={(e) => setTakeaways(e.target.value)}
                placeholder={"Readers will learn X\nWhy Y matters for their business\nHow to get started with Z"}
                rows={3}
                disabled={submitting}
                className={`${inputBase} resize-y`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label className={labelBase}>Mid-article call to action</label>
                <select
                  value={ctaVariant}
                  onChange={(e) => setCtaVariant(e.target.value)}
                  disabled={submitting}
                  className={inputBase}
                >
                  {CTA_VARIANTS.map((v) => (
                    <option key={v.value} value={v.value}>{v.label}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 text-[#0f2016]/70 text-sm font-medium pb-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  disabled={submitting}
                  className="w-4 h-4"
                />
                Feature this post on the blog homepage
              </label>
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

        {/* Live preview — the real renderer + the site's own CSS, not an approximation */}
        {showPreview && (
          <div className="bg-bg rounded-2xl border border-[#0f2016]/8 p-6 overflow-y-auto max-h-[calc(100vh-8rem)] lg:sticky lg:top-6">
            {(imagePreview || currentImageUrl) && (
              <div className="relative h-40 rounded-xl overflow-hidden mb-5 bg-surface-tint">
                <img
                  src={imagePreview || currentImageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {category && (
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">{category}</p>
            )}
            <h1 className="font-editorial text-2xl font-bold text-primary-dark leading-tight mb-2">
              {title || "Untitled post"}
            </h1>
            {deck && <p className="font-editorial text-base text-text-muted italic mb-4">{deck}</p>}

            <div className="prose prose-tishbite prose-lg has-dropcap max-w-none prose-img:rounded-xl">
              {previewContent ? (
                <ReactMarkdown
                  remarkPlugins={[
                    remarkGfm,
                    remarkDirective,
                    [remarkAutoInsertCta, ctaVariant],
                    remarkDirectiveToHast,
                    remarkMagazineHeadings,
                    remarkHighlightMark,
                    remarkDowngradeH1,
                  ]}
                  rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }], rehypeFigureImages]}
                  components={{
                    pullquote: Pullquote,
                    callout: Callout,
                    keypoints: Keypoints,
                    cta: Cta,
                    youtube: DirectiveYoutube,
                  }}
                >
                  {previewContent}
                </ReactMarkdown>
              ) : (
                <p className="text-text-muted text-sm">Start writing to see a preview…</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-[#0f2016]/8 overflow-hidden max-w-3xl">
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
              <div className="flex items-center gap-1.5 mt-0.5">
                {blog.featured && (
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/20 text-accent-dark">
                    Featured
                  </span>
                )}
                {blog.category && (
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {blog.category}
                  </span>
                )}
              </div>
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
