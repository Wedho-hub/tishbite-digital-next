"use client";

import { useState, useEffect } from "react";
import { authFetch, resolveUploadUrl } from "@/lib/adminApi";
import { FaEdit, FaTrash, FaTimes, FaGlobe } from "react-icons/fa";

export default function ManageCaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");
  const [result, setResult] = useState("");
  const [metrics, setMetrics] = useState("");
  const [link, setLink] = useState("");
  const [order, setOrder] = useState("0");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const fetchCaseStudies = async () => {
    setError("");
    try {
      const res = await authFetch("/api/case-studies");
      if (!res.ok) throw new Error("Failed to load case studies");
      const data = await res.json();
      setCaseStudies(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCaseStudies(); }, []);

  const resetForm = () => {
    setEditing(null);
    setTitle(""); setIndustry(""); setChallenge(""); setSolution(""); setResult("");
    setMetrics(""); setLink(""); setOrder("0"); setImage(null); setImagePreview("");
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
    if (!challenge.trim()) { setError("Challenge cannot be empty."); return; }
    if (!solution.trim()) { setError("Solution cannot be empty."); return; }
    if (!result.trim()) { setError("Result cannot be empty."); return; }
    if (link && !/^https?:\/\//i.test(link)) { setError("Link must start with http:// or https://"); return; }

    const formData = new FormData();
    formData.append("title", title);
    if (industry) formData.append("industry", industry);
    formData.append("challenge", challenge);
    formData.append("solution", solution);
    formData.append("result", result);
    if (metrics) formData.append("metrics", metrics);
    if (link) formData.append("link", link);
    formData.append("order", order || "0");
    if (image) formData.append("image", image);

    setSubmitting(true);
    setError("");
    try {
      const res = editing
        ? await authFetch(`/api/case-studies/${editing}`, { method: "PUT", body: formData })
        : await authFetch("/api/case-studies", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save case study");
      }
      setSuccess(editing ? "Case study updated." : "Case study created.");
      resetForm();
      fetchCaseStudies();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cs) => {
    setEditing(cs._id);
    setTitle(cs.title);
    setIndustry(cs.industry || "");
    setChallenge(cs.challenge);
    setSolution(cs.solution);
    setResult(cs.result);
    setMetrics((cs.metrics || []).join(", "));
    setLink(cs.link || "");
    setOrder(String(cs.order ?? 0));
    setImage(null);
    setImagePreview("");
    setSuccess("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this case study?")) return;
    try {
      await authFetch(`/api/case-studies/${id}`, { method: "DELETE" });
      fetchCaseStudies();
    } catch {
      setError("Error deleting case study");
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
          {editing ? "Edit Case Study" : "New Case Study"}
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
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Business / project name"
            disabled={submitting}
            className={inputBase}
          />
          <input
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="Industry (optional, e.g. Home Services)"
            disabled={submitting}
            className={inputBase}
          />
          <div>
            <label className="block text-[#0f2016]/60 text-xs font-semibold mb-1.5">
              Challenge — the problem you identified
            </label>
            <textarea
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              placeholder="What problem was this business facing?"
              rows={3}
              disabled={submitting}
              className={`${inputBase} resize-y`}
            />
          </div>
          <div>
            <label className="block text-[#0f2016]/60 text-xs font-semibold mb-1.5">
              Solution — what you did
            </label>
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="What approach or system did you build?"
              rows={3}
              disabled={submitting}
              className={`${inputBase} resize-y`}
            />
          </div>
          <div>
            <label className="block text-[#0f2016]/60 text-xs font-semibold mb-1.5">
              Result — the value delivered
            </label>
            <textarea
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="What outcome did the business get?"
              rows={3}
              disabled={submitting}
              className={`${inputBase} resize-y`}
            />
          </div>
          <div>
            <label className="block text-[#0f2016]/60 text-xs font-semibold mb-1.5">
              Metrics (optional, comma-separated)
            </label>
            <input
              value={metrics}
              onChange={(e) => setMetrics(e.target.value)}
              placeholder="e.g. +150% leads in 60 days, 3x bookings"
              disabled={submitting}
              className={inputBase}
            />
          </div>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Live link (optional, https://...)"
            type="url"
            disabled={submitting}
            className={inputBase}
          />
          <div>
            <label className="block text-[#0f2016]/60 text-xs font-semibold mb-1.5">
              Slideshow order (lower numbers show first)
            </label>
            <input
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              type="number"
              disabled={submitting}
              className={inputBase}
            />
          </div>
          <div>
            <label className="block text-[#0f2016]/60 text-xs font-semibold mb-1.5">
              Image (max 5MB, JPEG/PNG/WebP)
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
                <img src={imagePreview} alt="Preview" className="w-32 h-20 object-cover rounded-lg border border-[#0f2016]/10" />
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
        {loading && <p className="text-[#0f2016]/50 text-sm p-5">Loading case studies...</p>}
        {!loading && caseStudies.length === 0 && (
          <p className="text-[#0f2016]/50 text-sm p-5">No case studies found.</p>
        )}
        {caseStudies.map((cs, i) => (
          <div
            key={cs._id}
            className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? "border-t border-[#0f2016]/6" : ""}`}
          >
            {cs.image && (
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-[#0f2016]/5">
                <img
                  src={resolveUploadUrl(cs.image)}
                  alt={cs.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p
                className="font-semibold text-sm text-[#0f2016] truncate"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                {cs.title}
              </p>
              <p className="text-xs text-[#0f2016]/50 mt-0.5">
                Order: {cs.order ?? 0}{cs.industry ? ` · ${cs.industry}` : ""}
              </p>
              {cs.link && (
                <a
                  href={cs.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary/70 hover:text-primary no-underline mt-0.5"
                >
                  <FaGlobe size={9} /> {cs.link.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(cs)}
                className="w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors duration-200 border-0 cursor-pointer"
              >
                <FaEdit size={12} />
              </button>
              <button
                onClick={() => handleDelete(cs._id)}
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
