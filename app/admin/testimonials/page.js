"use client";

import { useState, useEffect } from "react";
import { authFetch, resolveUploadUrl } from "@/lib/adminApi";
import { FaEdit, FaTrash, FaTimes, FaStar } from "react-icons/fa";

export default function ManageTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [rating, setRating] = useState("5");
  const [quote, setQuote] = useState("");
  const [source, setSource] = useState("Google");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const fetchTestimonials = async () => {
    setError("");
    try {
      const res = await authFetch("/api/testimonials");
      if (!res.ok) throw new Error("Failed to load testimonials");
      const data = await res.json();
      setTestimonials(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const resetForm = () => {
    setEditing(null);
    setName(""); setRole(""); setCompany(""); setRating("5"); setQuote("");
    setSource("Google"); setImage(null); setImagePreview("");
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
    if (!name.trim()) { setError("Name cannot be empty."); return; }
    if (!quote.trim()) { setError("Quote cannot be empty."); return; }

    const formData = new FormData();
    formData.append("name", name);
    if (role) formData.append("role", role);
    if (company) formData.append("company", company);
    formData.append("rating", rating);
    formData.append("quote", quote);
    formData.append("source", source || "Google");
    if (image) formData.append("image", image);

    setSubmitting(true);
    setError("");
    try {
      const res = editing
        ? await authFetch(`/api/testimonials/${editing}`, { method: "PUT", body: formData })
        : await authFetch("/api/testimonials", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save testimonial");
      }
      setSuccess(editing ? "Testimonial updated." : "Testimonial created.");
      resetForm();
      fetchTestimonials();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (t) => {
    setEditing(t._id);
    setName(t.name);
    setRole(t.role || "");
    setCompany(t.company || "");
    setRating(String(t.rating ?? 5));
    setQuote(t.quote);
    setSource(t.source || "Google");
    setImage(null);
    setImagePreview("");
    setSuccess("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await authFetch(`/api/testimonials/${id}`, { method: "DELETE" });
      fetchTestimonials();
    } catch {
      setError("Error deleting testimonial");
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
          {editing ? "Edit Testimonial" : "New Testimonial"}
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Reviewer name"
            disabled={submitting}
            className={inputBase}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Role (optional)"
              disabled={submitting}
              className={inputBase}
            />
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company (optional)"
              disabled={submitting}
              className={inputBase}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              disabled={submitting}
              className={inputBase}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} star{r > 1 ? "s" : ""}</option>
              ))}
            </select>
            <input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Source (e.g. Google)"
              disabled={submitting}
              className={inputBase}
            />
          </div>
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Review text"
            rows={4}
            disabled={submitting}
            className={`${inputBase} resize-y`}
          />
          <div>
            <label className="block text-[#0f2016]/60 text-xs font-semibold mb-1.5">
              Reviewer photo (optional, max 5MB, JPEG/PNG/WebP)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={submitting}
              className="text-sm text-[#0f2016]/70 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:text-xs hover:file:bg-primary/20 cursor-pointer"
            />
            {imagePreview && (
              <div className="mt-3">
                <p className="text-[#0f2016]/50 text-xs mb-1.5">Preview:</p>
                <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-full border border-[#0f2016]/10" />
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
        {loading && <p className="text-[#0f2016]/50 text-sm p-5">Loading testimonials...</p>}
        {!loading && testimonials.length === 0 && (
          <p className="text-[#0f2016]/50 text-sm p-5">No testimonials found.</p>
        )}
        {testimonials.map((t, i) => (
          <div
            key={t._id}
            className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? "border-t border-[#0f2016]/6" : ""}`}
          >
            {t.image ? (
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-[#0f2016]/5">
                <img
                  src={resolveUploadUrl(t.image)}
                  alt={t.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full shrink-0 bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                {t.name?.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p
                className="font-semibold text-sm text-[#0f2016] truncate"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                {t.name}
              </p>
              <p className="text-xs text-[#0f2016]/50 mt-0.5 truncate">
                {[t.role, t.company].filter(Boolean).join(" · ") || t.source}
              </p>
              <div className="flex items-center gap-0.5 mt-1">
                {Array.from({ length: t.rating || 5 }).map((_, idx) => (
                  <FaStar key={idx} size={10} className="text-accent" />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(t)}
                className="w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors duration-200 border-0 cursor-pointer"
              >
                <FaEdit size={12} />
              </button>
              <button
                onClick={() => handleDelete(t._id)}
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
