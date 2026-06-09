"use client";

import { useState, useEffect } from "react";
import { authFetch } from "@/lib/adminApi";
import { FaTrash, FaEnvelope, FaPhone, FaCog } from "react-icons/fa";

export default function ManageEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEnquiries = async () => {
    setError("");
    try {
      const res = await authFetch("/api/enquiries");
      if (!res.ok) throw new Error("Failed to load enquiries");
      setEnquiries(await res.json());
    } catch (err) {
      setError(err.message || "Error loading enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this enquiry?")) return;
    try {
      await authFetch(`/api/enquiries/${id}`, { method: "DELETE" });
      setEnquiries((prev) => prev.filter((e) => e._id !== id));
    } catch {
      setError("Error deleting enquiry");
    }
  };

  return (
    <div className="max-w-4xl">
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <p className="text-[#0f2016]/50 text-sm">Loading enquiries...</p>
      )}

      {!loading && enquiries.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#0f2016]/8 p-8 text-center">
          <FaEnvelope size={32} className="text-[#0f2016]/20 mx-auto mb-3" />
          <p className="text-[#0f2016]/50 text-sm">No enquiries yet.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {enquiries.map((enq) => (
          <div
            key={enq._id}
            className="bg-white rounded-2xl border border-[#0f2016]/8 p-5 flex gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span
                  className="font-bold text-[#0f2016] text-sm"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {enq.name}
                </span>
                {enq.service && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                    <FaCog size={9} /> {enq.service}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-[#0f2016]/50 mb-3">
                <span className="flex items-center gap-1">
                  <FaEnvelope size={10} /> {enq.email}
                </span>
                {enq.phone && (
                  <span className="flex items-center gap-1">
                    <FaPhone size={10} /> {enq.phone}
                  </span>
                )}
                {enq.createdAt && (
                  <span>
                    {new Date(enq.createdAt).toLocaleDateString("en-ZA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
              <p className="text-[#0f2016]/70 text-sm leading-relaxed">{enq.message}</p>
            </div>
            <button
              onClick={() => handleDelete(enq._id)}
              className="self-start flex-shrink-0 w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors duration-200 border-0 cursor-pointer"
              title="Delete enquiry"
            >
              <FaTrash size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
