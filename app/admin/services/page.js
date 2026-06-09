"use client";

import { useState, useEffect } from "react";
import { authFetch } from "@/lib/adminApi";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

export default function ManageServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");
  const [description, setDescription] = useState("");

  const fetchServices = async () => {
    setError("");
    try {
      const res = await authFetch("/api/services");
      if (!res.ok) throw new Error("Failed to load services");
      const data = await res.json();
      setServices(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setTitle("");
    setCategory("general");
    setDescription("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    if (!title.trim()) { setError("Title cannot be empty."); return; }
    if (!description.trim()) { setError("Description cannot be empty."); return; }
    setSubmitting(true);
    setError("");
    try {
      const body = JSON.stringify({ title, category, description });
      const res = editing
        ? await authFetch(`/api/services/${editing}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body,
          })
        : await authFetch("/api/services", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
          });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save service");
      }
      setSuccess(editing ? "Service updated." : "Service created.");
      resetForm();
      fetchServices();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (svc) => {
    setEditing(svc._id);
    setTitle(svc.title);
    setCategory(svc.category || "general");
    setDescription(svc.description);
    setSuccess("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this service?")) return;
    try {
      await authFetch(`/api/services/${id}`, { method: "DELETE" });
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch {
      setError("Error deleting service");
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
          {editing ? "Edit Service" : "New Service"}
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Service title"
            disabled={submitting}
            className={inputBase}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={submitting}
            className={inputBase}
          >
            <option value="general">General Service</option>
            <option value="bundle">Bundled Service</option>
          </select>
          <div>
            <p className="text-[#0f2016]/50 text-xs mb-1.5">
              Markdown supported: `**bold**`, `- list`, headings, paragraphs
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (Markdown supported)"
              rows={6}
              disabled={submitting}
              className={`${inputBase} resize-y`}
            />
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
        {loading && (
          <p className="text-[#0f2016]/50 text-sm p-5">Loading services...</p>
        )}
        {!loading && services.length === 0 && (
          <p className="text-[#0f2016]/50 text-sm p-5">No services found.</p>
        )}
        {services.map((svc, i) => (
          <div
            key={svc._id}
            className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? "border-t border-[#0f2016]/6" : ""}`}
          >
            <div className="flex-1 min-w-0">
              <p
                className="font-semibold text-sm text-[#0f2016] truncate"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                {svc.title}
              </p>
              <span
                className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                  (svc.category || "general") === "bundle"
                    ? "bg-accent/20 text-yellow-700"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {(svc.category || "general") === "bundle" ? "Bundle" : "General"}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(svc)}
                className="w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors duration-200 border-0 cursor-pointer"
              >
                <FaEdit size={12} />
              </button>
              <button
                onClick={() => handleDelete(svc._id)}
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
