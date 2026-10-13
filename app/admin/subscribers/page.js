"use client";

import { useState, useEffect, useMemo } from "react";
import { authFetch } from "@/lib/adminApi";
import { FaTrash, FaUsers, FaDownload, FaWhatsapp } from "react-icons/fa";

const SOURCE_LABELS = {
  audit: "Free Audit",
  scorecard: "Scorecard",
  "pricing-guide": "Pricing Guide",
  checklist: "Checklist",
  call: "Strategy Call",
};

function toCsv(rows) {
  const header = ["First Name", "Email", "WhatsApp", "Need", "Source", "Status", "Signed Up"];
  const lines = rows.map((s) => [
    s.firstName,
    s.email,
    s.whatsapp || "",
    s.need || "",
    SOURCE_LABELS[s.source] || s.source || "",
    s.status,
    new Date(s.createdAt).toLocaleDateString("en-ZA"),
  ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
  return [header.join(","), ...lines].join("\n");
}

export default function ManageSubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const fetchSubscribers = async () => {
    setError("");
    try {
      const res = await authFetch("/api/subscribers");
      if (!res.ok) throw new Error("Failed to load subscribers");
      const data = await res.json();
      setSubscribers(data.data || []);
    } catch (err) {
      setError(err.message || "Error loading subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { (async () => { await fetchSubscribers(); })(); }, []);

  const filtered = useMemo(() => {
    return subscribers.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (sourceFilter !== "all" && s.source !== sourceFilter) return false;
      return true;
    });
  }, [subscribers, statusFilter, sourceFilter]);

  const activeCount = subscribers.filter((s) => s.status === "subscribed").length;

  const handleDelete = async (id) => {
    if (!confirm("Delete this subscriber? This can't be undone.")) return;
    try {
      await authFetch(`/api/subscribers/${id}`, { method: "DELETE" });
      setSubscribers((prev) => prev.filter((s) => s._id !== id));
    } catch {
      setError("Error deleting subscriber");
    }
  };

  const handleExport = () => {
    const csv = toCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectBase =
    "px-3 py-2 rounded-xl border border-[#0f2016]/15 bg-white text-[#0f2016] text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors duration-200";

  return (
    <div className="max-w-5xl flex flex-col gap-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#0f2016]/8 p-5">
          <p className="text-[#0f2016]/50 text-xs font-semibold uppercase tracking-wide mb-1">Total Subscribers</p>
          <p className="text-2xl font-extrabold text-[#0f2016]">{subscribers.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#0f2016]/8 p-5">
          <p className="text-[#0f2016]/50 text-xs font-semibold uppercase tracking-wide mb-1">Active (Subscribed)</p>
          <p className="text-2xl font-extrabold text-primary">{activeCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#0f2016]/8 p-5">
          <p className="text-[#0f2016]/50 text-xs font-semibold uppercase tracking-wide mb-1">Unsubscribed</p>
          <p className="text-2xl font-extrabold text-[#0f2016]/40">{subscribers.length - activeCount}</p>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Filters + export */}
      <div className="flex flex-wrap items-center gap-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectBase}>
          <option value="all">All statuses</option>
          <option value="subscribed">Subscribed</option>
          <option value="unsubscribed">Unsubscribed</option>
        </select>
        <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className={selectBase}>
          <option value="all">All offers</option>
          {Object.entries(SOURCE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button
          onClick={handleExport}
          disabled={filtered.length === 0}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-0 cursor-pointer"
        >
          <FaDownload size={12} /> Export CSV
        </button>
      </div>

      {loading && <p className="text-[#0f2016]/50 text-sm">Loading subscribers...</p>}

      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#0f2016]/8 p-8 text-center">
          <FaUsers size={32} className="text-[#0f2016]/20 mx-auto mb-3" />
          <p className="text-[#0f2016]/50 text-sm">No subscribers match these filters yet.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#0f2016]/8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#0f2016]/8 text-left">
                <th className="px-4 py-3 text-[#0f2016]/50 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Name</th>
                <th className="px-4 py-3 text-[#0f2016]/50 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Email</th>
                <th className="px-4 py-3 text-[#0f2016]/50 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">WhatsApp</th>
                <th className="px-4 py-3 text-[#0f2016]/50 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Offer</th>
                <th className="px-4 py-3 text-[#0f2016]/50 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-[#0f2016]/50 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Signed Up</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s._id} className="border-b border-[#0f2016]/6 last:border-0">
                  <td className="px-4 py-3 font-semibold text-[#0f2016] whitespace-nowrap">{s.firstName}</td>
                  <td className="px-4 py-3 text-[#0f2016]/70 whitespace-nowrap">{s.email}</td>
                  <td className="px-4 py-3 text-[#0f2016]/70 whitespace-nowrap">
                    {s.whatsapp ? (
                      <a
                        href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[#25d366] hover:underline"
                      >
                        <FaWhatsapp size={12} /> {s.whatsapp}
                      </a>
                    ) : (
                      <span className="text-[#0f2016]/30">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {SOURCE_LABELS[s.source] || s.source || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${
                      s.status === "subscribed" ? "bg-green-50 text-green-600" : "bg-[#0f2016]/8 text-[#0f2016]/40"
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#0f2016]/50 whitespace-nowrap">
                    {new Date(s.createdAt).toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors duration-200 border-0 cursor-pointer"
                      title="Delete subscriber"
                    >
                      <FaTrash size={11} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
