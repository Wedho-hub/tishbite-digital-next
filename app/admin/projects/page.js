"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { authFetch, resolveUploadUrl } from "@/lib/adminApi";
import { FaEdit, FaTrash, FaTimes, FaGlobe } from "react-icons/fa";

export default function ManageProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const fetchProjects = async (pg = page) => {
    setError("");
    try {
      const res = await authFetch(`/api/projects?page=${pg}&limit=10`);
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      setProjects(data.data || data);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(page); }, [page]);

  const resetForm = () => {
    setEditing(null);
    setTitle(""); setDescription(""); setUrl(""); setImage(null); setImagePreview("");
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
    if (!description.trim()) { setError("Description cannot be empty."); return; }
    if (url && !/^https?:\/\//i.test(url)) { setError("URL must start with http:// or https://"); return; }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (url) formData.append("link", url);
    if (image) formData.append("image", image);

    setSubmitting(true);
    setError("");
    try {
      const res = editing
        ? await authFetch(`/api/projects/${editing}`, { method: "PUT", body: formData })
        : await authFetch("/api/projects", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save project");
      }
      setSuccess(editing ? "Project updated." : "Project created.");
      resetForm();
      fetchProjects(page);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (proj) => {
    setEditing(proj._id);
    setTitle(proj.title);
    setDescription(proj.description);
    setUrl(proj.link || "");
    setImage(null);
    setImagePreview("");
    setSuccess("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    try {
      await authFetch(`/api/projects/${id}`, { method: "DELETE" });
      fetchProjects(page);
    } catch {
      setError("Error deleting project");
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
          {editing ? "Edit Project" : "New Project"}
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
            placeholder="Project title"
            disabled={submitting}
            className={inputBase}
          />
          <div>
            <p className="text-[#0f2016]/50 text-xs mb-1.5">
              Markdown supported: `- item`, `**bold**`, paragraphs
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (Markdown supported)"
              rows={5}
              disabled={submitting}
              className={`${inputBase} resize-y`}
            />
          </div>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Project URL (https://...)"
            type="url"
            disabled={submitting}
            className={inputBase}
          />
          <div>
            <label className="block text-[#0f2016]/60 text-xs font-semibold mb-1.5">
              Project Image (max 5MB, JPEG/PNG/WebP)
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
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-dark to-primary-light text-white font-bold text-sm hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
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
        {loading && <p className="text-[#0f2016]/50 text-sm p-5">Loading projects...</p>}
        {!loading && projects.length === 0 && (
          <p className="text-[#0f2016]/50 text-sm p-5">No projects found.</p>
        )}
        {projects.map((proj, i) => (
          <div
            key={proj._id}
            className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? "border-t border-[#0f2016]/6" : ""}`}
          >
            {proj.image && (
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#0f2016]/5">
                <img
                  src={resolveUploadUrl(proj.image)}
                  alt={proj.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p
                className="font-semibold text-sm text-[#0f2016] truncate"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                {proj.title}
              </p>
              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary/70 hover:text-primary no-underline mt-0.5"
                >
                  <FaGlobe size={9} /> {proj.link.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(proj)}
                className="w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors duration-200 border-0 cursor-pointer"
              >
                <FaEdit size={12} />
              </button>
              <button
                onClick={() => handleDelete(proj._id)}
                className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors duration-200 border-0 cursor-pointer"
              >
                <FaTrash size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-xl border border-[#0f2016]/15 text-[#0f2016]/70 text-sm font-semibold hover:bg-[#0f2016]/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Prev
          </button>
          <span className="text-[#0f2016]/50 text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-xl border border-[#0f2016]/15 text-[#0f2016]/70 text-sm font-semibold hover:bg-[#0f2016]/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
