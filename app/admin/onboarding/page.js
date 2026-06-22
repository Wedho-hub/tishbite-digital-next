"use client";

import { useState, useEffect } from "react";
import { authFetch } from "@/lib/adminApi";
import { FaTrash, FaClipboardList, FaChevronDown, FaChevronUp } from "react-icons/fa";

const STATUS_STYLES = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  reviewed: "bg-amber-50 text-amber-700 border-amber-200",
  quoted: "bg-green-50 text-green-700 border-green-200",
};

function DetailRow({ label, value }) {
  if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="grid grid-cols-3 gap-3 py-2 border-b border-[#0f2016]/6 last:border-0">
      <p className="text-[#0f2016]/50 text-xs font-semibold col-span-1">{label}</p>
      <p className="text-[#0f2016] text-sm col-span-2">
        {Array.isArray(value) ? value.join(", ") : String(value)}
      </p>
    </div>
  );
}

function DetailSection({ title, children }) {
  return (
    <div className="mb-4">
      <h5 className="text-[#0f2016]/70 text-xs font-bold uppercase tracking-wider mb-1.5">{title}</h5>
      <div>{children}</div>
    </div>
  );
}

export default function ManageOnboardingPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

  const fetchSubmissions = async () => {
    setError("");
    try {
      const res = await authFetch("/api/onboarding");
      if (!res.ok) throw new Error("Failed to load submissions");
      setSubmissions(await res.json());
    } catch (err) {
      setError(err.message || "Error loading submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubmissions(); }, []);

  const handleStatusChange = async (id, status) => {
    setSubmissions((prev) => prev.map((s) => (s._id === id ? { ...s, status } : s)));
    try {
      await authFetch(`/api/onboarding/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch {
      setError("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this onboarding submission?")) return;
    try {
      await authFetch(`/api/onboarding/${id}`, { method: "DELETE" });
      setSubmissions((prev) => prev.filter((s) => s._id !== id));
    } catch {
      setError("Error deleting submission");
    }
  };

  return (
    <div className="max-w-5xl">
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading && <p className="text-[#0f2016]/50 text-sm">Loading submissions...</p>}

      {!loading && submissions.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#0f2016]/8 p-8 text-center">
          <FaClipboardList size={32} className="text-[#0f2016]/20 mx-auto mb-3" />
          <p className="text-[#0f2016]/50 text-sm">No onboarding submissions yet.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {submissions.map((s) => {
          const isOpen = expanded === s._id;
          return (
            <div key={s._id} className="bg-white rounded-2xl border border-[#0f2016]/8 overflow-hidden">
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : s._id)}
                className="w-full flex items-center gap-4 p-5 text-left bg-transparent border-0 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-bold text-[#0f2016] text-sm" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                      {s.businessName}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLES[s.status] || STATUS_STYLES.new}`}>
                      {s.status}
                    </span>
                  </div>
                  <p className="text-[#0f2016]/50 text-xs">
                    {s.fullName} · {s.email} · {s.phone}
                    {s.createdAt && ` · ${new Date(s.createdAt).toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" })}`}
                  </p>
                </div>
                {isOpen ? <FaChevronUp size={12} className="text-[#0f2016]/40" /> : <FaChevronDown size={12} className="text-[#0f2016]/40" />}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 border-t border-[#0f2016]/6 pt-4">
                  <div className="flex items-center gap-3 mb-4">
                    <label className="text-xs font-semibold text-[#0f2016]/60">Status:</label>
                    <select
                      value={s.status}
                      onChange={(e) => handleStatusChange(s._id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-[#0f2016]/15 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="quoted">Quoted</option>
                    </select>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-xs font-semibold transition-colors duration-200 border-0 cursor-pointer"
                    >
                      <FaTrash size={10} /> Delete
                    </button>
                  </div>

                  <DetailSection title="Contact & Business Basics">
                    <DetailRow label="Role" value={s.role} />
                    <DetailRow label="Location" value={s.location} />
                    <DetailRow label="Business Description" value={s.businessDescription} />
                    <DetailRow label="Years Operating" value={s.yearsOperating} />
                  </DetailSection>

                  <DetailSection title="Current Digital Presence">
                    <DetailRow label="Has Website" value={s.hasWebsite} />
                    <DetailRow label="Website URL" value={s.websiteUrl} />
                    <DetailRow label="What's Working" value={s.whatsWorking} />
                    <DetailRow label="What's Not Working" value={s.whatsNotWorking} />
                    <DetailRow label="Marketing Channels" value={s.marketingChannels} />
                    <DetailRow label="Google Business Profile" value={s.hasGoogleBusinessProfile} />
                  </DetailSection>

                  <DetailSection title="Goals & Project Scope">
                    <DetailRow label="Goals" value={s.goals} />
                    <DetailRow label="Services Interested" value={s.servicesInterested} />
                    <DetailRow label="Success Definition" value={s.successDefinition} />
                    <DetailRow label="Timeline" value={s.timeline} />
                    <DetailRow label="Urgency Reason" value={s.urgencyReason} />
                  </DetailSection>

                  <DetailSection title="Target Audience & Competitors">
                    <DetailRow label="Ideal Customer" value={s.idealCustomer} />
                    <DetailRow label="Customer Locations" value={s.customerLocations} />
                    <DetailRow label="Competitors" value={s.competitors} />
                    <DetailRow label="Likes/Dislikes" value={s.competitorLikesDislikes} />
                  </DetailSection>

                  <DetailSection title="Brand & Content Assets">
                    <DetailRow label="Has Logo" value={s.hasLogo} />
                    <DetailRow label="Has Brand Colors" value={s.hasBrandColors} />
                    <DetailRow label="Has Media" value={s.hasMedia} />
                    <DetailRow label="Has Copy Ready" value={s.hasCopyReady} />
                  </DetailSection>

                  <DetailSection title="Budget & Decision Process">
                    <DetailRow label="Budget Range" value={s.budgetRange} />
                    <DetailRow label="Open to Installments" value={s.openToInstallments} />
                    <DetailRow label="Decision Makers" value={s.decisionMakers} />
                  </DetailSection>

                  <DetailSection title="Anything Else">
                    <DetailRow label="Additional Notes" value={s.additionalNotes} />
                  </DetailSection>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
