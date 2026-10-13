"use client";

import { useState, useEffect } from "react";
import { authFetch } from "@/lib/adminApi";
import { FaPaperPlane, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function ManageCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [subscriberCount, setSubscriberCount] = useState(null);

  const fetchCampaigns = async () => {
    try {
      const res = await authFetch("/api/campaigns");
      if (!res.ok) throw new Error("Failed to load campaign history");
      const data = await res.json();
      setCampaigns(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriberCount = async () => {
    try {
      const res = await authFetch("/api/subscribers?status=subscribed");
      if (!res.ok) return;
      const data = await res.json();
      setSubscriberCount(data.total ?? null);
    } catch {
      /* non-critical */
    }
  };

  useEffect(() => { (async () => { await Promise.all([fetchCampaigns(), fetchSubscriberCount()]); })(); }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setResult(null);
    setError("");
    if (!subject.trim() || !body.trim()) {
      setError("Subject and body are required.");
      return;
    }
    if (!confirm(`Send this email to ${subscriberCount ?? "all"} active subscriber(s)? This can't be undone.`)) return;

    setSending(true);
    try {
      const res = await authFetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send campaign");
      setResult({ sent: data.sent, failed: data.failed });
      setSubject("");
      setBody("");
      fetchCampaigns();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl border border-[#0f2016]/15 bg-white text-[#0f2016] text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors duration-200";

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      <div className="bg-white rounded-2xl border border-[#0f2016]/8 p-6">
        <h2 className="text-base font-bold text-[#0f2016] mb-1" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
          New Broadcast
        </h2>
        <p className="text-[#0f2016]/50 text-xs mb-4">
          Sends to every <strong>active</strong> subscriber{subscriberCount !== null ? ` (${subscriberCount} right now)` : ""}.
          Sent through your own Zoho Mail account — fine for smaller lists, but watch your daily send limit as it grows.
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <FaExclamationTriangle size={14} /> {error}
          </div>
        )}
        {result && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
            <FaCheckCircle size={14} />
            Sent to {result.sent} subscriber{result.sent === 1 ? "" : "s"}{result.failed > 0 ? ` (${result.failed} failed — check server logs)` : ""}.
          </div>
        )}

        <form onSubmit={handleSend} className="flex flex-col gap-4">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject line"
            disabled={sending}
            className={inputBase}
          />
          <div>
            <p className="text-[#0f2016]/50 text-xs mb-1.5">
              Blank line = new paragraph. <code>**bold**</code> and <code>- list item</code> supported. Use <code>{"{{firstName}}"}</code> to personalise.
            </p>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={"Hi {{firstName}},\n\nYour message here..."}
              rows={10}
              disabled={sending}
              className={`${inputBase} resize-y font-mono text-xs`}
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="self-start flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-primary-dark to-primary-light text-white font-bold text-sm hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            <FaPaperPlane size={12} /> {sending ? "Sending..." : "Send Broadcast"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-[#0f2016]/8 overflow-hidden">
        <h2 className="text-base font-bold text-[#0f2016] px-6 pt-5 pb-3" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
          Send History
        </h2>
        {loading && <p className="text-[#0f2016]/50 text-sm px-6 pb-5">Loading...</p>}
        {!loading && campaigns.length === 0 && (
          <p className="text-[#0f2016]/50 text-sm px-6 pb-5">No campaigns sent yet.</p>
        )}
        {campaigns.map((c, i) => (
          <div key={c._id} className={`px-6 py-4 ${i > 0 ? "border-t border-[#0f2016]/6" : ""}`}>
            <div className="flex items-center justify-between gap-3 mb-1">
              <p className="font-semibold text-sm text-[#0f2016]">{c.subject}</p>
              <span className="text-xs text-[#0f2016]/40 whitespace-nowrap">
                {new Date(c.sentAt).toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" })}
              </span>
            </div>
            <p className="text-[#0f2016]/50 text-xs">
              Sent to {c.recipientCount} subscriber{c.recipientCount === 1 ? "" : "s"}
              {c.failedCount > 0 ? ` · ${c.failedCount} failed` : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
