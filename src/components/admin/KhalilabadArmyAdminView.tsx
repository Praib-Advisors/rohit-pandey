"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  type KhalilabadArmyMember,
  type MemberStatus,
  INTERESTED_AREAS,
} from "@/lib/khalilabad-army-types";
import { type Locale } from "@/lib/i18n";

interface Props {
  lang: Locale;
}

export default function KhalilabadArmyAdminView({ lang }: Props) {
  const isHi = lang === "hi";
  const [members, setMembers] = useState<KhalilabadArmyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [areaFilter, setAreaFilter] = useState<string>("all");

  // Modals
  const [selectedMember, setSelectedMember] = useState<KhalilabadArmyMember | null>(null);
  const [editingMember, setEditingMember] = useState<KhalilabadArmyMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<KhalilabadArmyMember | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/khalilabad-army/members");
      if (res.ok) {
        const data = (await res.json()) as { members?: KhalilabadArmyMember[] };
        setMembers(data.members || []);
      } else {
        showToast("error", isHi ? "डेटा लोड करने में विफल।" : "Failed to load members.");
      }
    } catch {
      showToast("error", "Network error while loading data.");
    } finally {
      setLoading(false);
    }
  }, [isHi]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const s = search.toLowerCase().trim();
      const matchSearch =
        !s ||
        m.full_name.toLowerCase().includes(s) ||
        m.mobile.includes(s) ||
        m.registration_id.toLowerCase().includes(s) ||
        m.village_ward_area.toLowerCase().includes(s);

      const matchStatus = statusFilter === "all" || m.status === statusFilter;
      const matchArea = areaFilter === "all" || m.interested_area === areaFilter;

      return matchSearch && matchStatus && matchArea;
    });
  }, [members, search, statusFilter, areaFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = members.length;
    const pending = members.filter((m) => m.status === "pending").length;
    const approved = members.filter((m) => m.status === "approved").length;
    const rejected = members.filter((m) => m.status === "rejected").length;
    return { total, pending, approved, rejected };
  }, [members]);

  // Status update
  const handleStatusChange = async (id: string, newStatus: MemberStatus) => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/khalilabad-army/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, updates: { status: newStatus } }),
      });

      if (res.ok) {
        await res.json();
        setMembers((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
        );
        if (selectedMember && selectedMember.id === id) {
          setSelectedMember((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        showToast(
          "success",
          isHi ? `स्थिति बदलकर "${newStatus}" कर दी गई।` : `Status updated to "${newStatus}".`
        );
      } else {
        showToast("error", "Status update failed.");
      }
    } catch {
      showToast("error", "Network error.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Edit save
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setIsUpdating(true);

    try {
      const res = await fetch("/api/khalilabad-army/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingMember.id,
          updates: {
            full_name: editingMember.full_name,
            mobile: editingMember.mobile,
            village_ward_area: editingMember.village_ward_area,
            age: editingMember.age ? Number(editingMember.age) : null,
            interested_area: editingMember.interested_area || null,
            message: editingMember.message || null,
            status: editingMember.status,
          },
        }),
      });

      if (res.ok) {
        setMembers((prev) =>
          prev.map((m) => (m.id === editingMember.id ? editingMember : m))
        );
        setEditingMember(null);
        showToast("success", isHi ? "विवरण सहेजा गया।" : "Member details updated.");
      } else {
        showToast("error", "Failed to update member.");
      }
    } catch {
      showToast("error", "Network error.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete
  const handleConfirmDelete = async () => {
    if (!deletingMember) return;
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/khalilabad-army/members?id=${deletingMember.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== deletingMember.id));
        setDeletingMember(null);
        if (selectedMember?.id === deletingMember.id) setSelectedMember(null);
        showToast("success", isHi ? "सदस्य हटा दिया गया।" : "Member deleted successfully.");
      } else {
        showToast("error", "Delete failed.");
      }
    } catch {
      showToast("error", "Network error.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (members.length === 0) {
      alert(isHi ? "निर्यात के लिए कोई डेटा नहीं है।" : "No data available to export.");
      return;
    }

    const headers = [
      "Registration ID",
      "Full Name",
      "Mobile",
      "Village / Ward / Area",
      "Age",
      "Interested Area",
      "Status",
      "Message",
      "Registered At",
    ];

    const rows = filteredMembers.map((m) => [
      `"${m.registration_id}"`,
      `"${m.full_name.replace(/"/g, '""')}"`,
      `"${m.mobile}"`,
      `"${m.village_ward_area.replace(/"/g, '""')}"`,
      m.age ? `"${m.age}"` : '""',
      `"${(m.interested_area || "").replace(/"/g, '""')}"`,
      `"${m.status}"`,
      `"${(m.message || "").replace(/"/g, '""')}"`,
      `"${new Date(m.created_at).toLocaleString()}"`,
    ]);

    // UTF-8 BOM for Excel support
    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `khalilabad_army_members_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      {/* Alert toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 shadow-lg text-sm font-medium ${
            toast.type === "success"
              ? "bg-green-800 text-white"
              : "bg-red-800 text-white"
          }`}
        >
          {toast.text}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
            {isHi ? "खलीलाबाद आर्मी सदस्य" : "Khalilabad Army Members"}
          </h1>
          <p className="text-xs text-ink-soft mt-1">
            {isHi
              ? "सभी पंजीकृत सदस्यों की सूची, सत्यापन, संपादन एवं प्रबंधन"
              : "View, approve, filter, and manage registered members"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchMembers}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3.5 py-2 text-xs font-medium text-ink hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
          >
            <svg
              className={`size-3.5 ${loading ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>{isHi ? "रिफ्रेश" : "Refresh"}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-md bg-green-dk px-4 py-2 text-xs font-semibold text-white hover:bg-green-deep transition-colors shadow-2xs cursor-pointer"
          >
            <svg
              className="size-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>{isHi ? "Excel / CSV डाउनलोड" : "Export CSV / Excel"}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-line bg-white p-4 shadow-2xs">
          <div className="text-xs font-medium text-ink-soft">
            {isHi ? "कुल पंजीकरण" : "Total Members"}
          </div>
          <div className="mt-2 text-2xl font-bold text-ink">{stats.total}</div>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50/50 p-4 shadow-2xs">
          <div className="text-xs font-medium text-yellow-800">
            {isHi ? "लंबित (Pending)" : "Pending"}
          </div>
          <div className="mt-2 text-2xl font-bold text-yellow-900">{stats.pending}</div>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50/50 p-4 shadow-2xs">
          <div className="text-xs font-medium text-green-800">
            {isHi ? "स्वीकृत (Approved)" : "Approved"}
          </div>
          <div className="mt-2 text-2xl font-bold text-green-900">{stats.approved}</div>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 shadow-2xs">
          <div className="text-xs font-medium text-red-800">
            {isHi ? "अस्वीकृत (Rejected)" : "Rejected"}
          </div>
          <div className="mt-2 text-2xl font-bold text-red-900">{stats.rejected}</div>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="rounded-xl border border-line bg-white p-4 shadow-2xs flex flex-col md:flex-row md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-2.5 size-4 text-ink-soft"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isHi
                ? "नाम, मोबाइल, ID, या गाँव से खोजें..."
                : "Search by Name, Mobile, ID, or Village..."
            }
            className="w-full rounded-md border border-line pl-9 pr-3 py-1.5 text-xs text-ink focus:border-red-dk focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-soft whitespace-nowrap">
            {isHi ? "स्थिति:" : "Status:"}
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-line px-2.5 py-1.5 text-xs text-ink focus:border-red-dk focus:outline-none"
          >
            <option value="all">{isHi ? "सभी (All)" : "All Status"}</option>
            <option value="pending">{isHi ? "लंबित (Pending)" : "Pending"}</option>
            <option value="approved">{isHi ? "स्वीकृत (Approved)" : "Approved"}</option>
            <option value="rejected">{isHi ? "अस्वीकृत (Rejected)" : "Rejected"}</option>
          </select>
        </div>

        {/* Interested Area Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-soft whitespace-nowrap">
            {isHi ? "क्षेत्र:" : "Area:"}
          </span>
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="rounded-md border border-line px-2.5 py-1.5 text-xs text-ink focus:border-red-dk focus:outline-none"
          >
            <option value="all">{isHi ? "सभी क्षेत्र" : "All Areas"}</option>
            {INTERESTED_AREAS.map((a) => (
              <option key={a.id} value={a.id}>
                {isHi ? a.hi : a.en}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="rounded-xl border border-line bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-line bg-gray-50/80 font-semibold text-ink-soft uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Reg ID</th>
                <th className="py-3 px-4">{isHi ? "नाम" : "Name"}</th>
                <th className="py-3 px-4">{isHi ? "मोबाइल" : "Mobile"}</th>
                <th className="py-3 px-4">{isHi ? "गाँव / वार्ड" : "Village/Ward"}</th>
                <th className="py-3 px-4">{isHi ? "आयु" : "Age"}</th>
                <th className="py-3 px-4">{isHi ? "रुचि का क्षेत्र" : "Area"}</th>
                <th className="py-3 px-4">{isHi ? "स्थिति" : "Status"}</th>
                <th className="py-3 px-4">{isHi ? "दिनांक" : "Date"}</th>
                <th className="py-3 px-4 text-right">{isHi ? "कार्रवाई" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-ink-soft">
                    {isHi ? "डेटा लोड हो रहा है..." : "Loading members..."}
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-ink-soft">
                    {isHi
                      ? "कोई सदस्य रिकॉर्ड नहीं मिला।"
                      : "No member records found."}
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-ink">
                      {m.registration_id}
                    </td>
                    <td className="py-3 px-4 font-medium text-ink">
                      {m.full_name}
                    </td>
                    <td className="py-3 px-4 text-ink-soft font-mono">
                      +91 {m.mobile}
                    </td>
                    <td className="py-3 px-4 text-ink-soft max-w-[150px] truncate">
                      {m.village_ward_area}
                    </td>
                    <td className="py-3 px-4 text-ink-soft">
                      {m.age ? `${m.age} yr` : "-"}
                    </td>
                    <td className="py-3 px-4 text-ink-soft max-w-[140px] truncate">
                      {INTERESTED_AREAS.find((a) => a.id === m.interested_area)?.[
                        isHi ? "hi" : "en"
                      ] || m.interested_area || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          m.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : m.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-ink-soft text-[11px]">
                      {new Date(m.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Quick Approve / Reject */}
                        {m.status !== "approved" && (
                          <button
                            type="button"
                            title="Approve"
                            onClick={() => handleStatusChange(m.id, "approved")}
                            disabled={isUpdating}
                            className="p-1 rounded text-green-700 hover:bg-green-50 transition-colors cursor-pointer"
                          >
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        {m.status !== "rejected" && (
                          <button
                            type="button"
                            title="Reject"
                            onClick={() => handleStatusChange(m.id, "rejected")}
                            disabled={isUpdating}
                            className="p-1 rounded text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}

                        {/* View Details */}
                        <button
                          type="button"
                          title="View Details"
                          onClick={() => setSelectedMember(m)}
                          className="p-1 rounded text-ink-soft hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          title="Edit"
                          onClick={() => setEditingMember(m)}
                          className="p-1 rounded text-ink-soft hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => setDeletingMember(m)}
                          className="p-1 rounded text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW MEMBER MODAL */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-ink">
                  {isHi ? "सदस्य विवरण" : "Member Details"}
                </h3>
                <span className="font-mono text-xs text-red-dk font-semibold">
                  {selectedMember.registration_id}
                </span>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-1 text-ink-soft hover:text-ink cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-semibold text-ink-soft">{isHi ? "नाम:" : "Name:"}</span>
                  <div className="text-sm font-medium text-ink">{selectedMember.full_name}</div>
                </div>
                <div>
                  <span className="font-semibold text-ink-soft">{isHi ? "मोबाइल:" : "Mobile:"}</span>
                  <div className="text-sm font-medium text-ink font-mono">+91 {selectedMember.mobile}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-semibold text-ink-soft">{isHi ? "गाँव / वार्ड / क्षेत्र:" : "Area:"}</span>
                  <div className="text-ink">{selectedMember.village_ward_area}</div>
                </div>
                <div>
                  <span className="font-semibold text-ink-soft">{isHi ? "आयु:" : "Age:"}</span>
                  <div className="text-ink">{selectedMember.age ? `${selectedMember.age} वर्ष` : "-"}</div>
                </div>
              </div>

              <div>
                <span className="font-semibold text-ink-soft">{isHi ? "रुचि का क्षेत्र:" : "Interested Area:"}</span>
                <div className="text-ink">
                  {INTERESTED_AREAS.find((a) => a.id === selectedMember.interested_area)?.[isHi ? "hi" : "en"] ||
                    selectedMember.interested_area ||
                    "-"}
                </div>
              </div>

              <div>
                <span className="font-semibold text-ink-soft">{isHi ? "संदेश:" : "Message:"}</span>
                <div className="mt-1 rounded-md bg-gray-50 p-2.5 text-ink leading-relaxed">
                  {selectedMember.message || (isHi ? "कोई संदेश नहीं दिया गया।" : "No message provided.")}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-line text-[11px] text-ink-soft">
                <div>पंजीकरण तिथि: {new Date(selectedMember.created_at).toLocaleString()}</div>
                <div>स्थिति: <strong className="capitalize">{selectedMember.status}</strong></div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedMember.id, "approved")}
                  disabled={isUpdating || selectedMember.status === "approved"}
                  className="rounded bg-green-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-800 disabled:opacity-40 cursor-pointer"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedMember.id, "rejected")}
                  disabled={isUpdating || selectedMember.status === "rejected"}
                  className="rounded bg-red-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-800 disabled:opacity-40 cursor-pointer"
                >
                  Reject
                </button>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="rounded border border-line px-3.5 py-1.5 text-xs text-ink hover:bg-gray-50 cursor-pointer"
              >
                {isHi ? "बंद करें" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <h3 className="font-heading text-lg font-bold text-ink">
                {isHi ? "सदस्य विवरण संपादित करें" : "Edit Member Details"}
              </h3>
              <button
                onClick={() => setEditingMember(null)}
                className="p-1 text-ink-soft hover:text-ink cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-ink-soft mb-1">
                  {isHi ? "पूरा नाम" : "Full Name"} *
                </label>
                <input
                  type="text"
                  required
                  value={editingMember.full_name}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, full_name: e.target.value })
                  }
                  className="w-full rounded border border-line px-3 py-1.5 text-xs text-ink focus:border-red-dk focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-ink-soft mb-1">
                    {isHi ? "मोबाइल" : "Mobile"} *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={editingMember.mobile}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, mobile: e.target.value })
                    }
                    className="w-full rounded border border-line px-3 py-1.5 text-xs text-ink focus:border-red-dk focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-ink-soft mb-1">
                    {isHi ? "आयु" : "Age"}
                  </label>
                  <input
                    type="number"
                    value={editingMember.age ?? ""}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        age: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full rounded border border-line px-3 py-1.5 text-xs text-ink focus:border-red-dk focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-ink-soft mb-1">
                  {isHi ? "गाँव / वार्ड / क्षेत्र" : "Village/Ward/Area"} *
                </label>
                <input
                  type="text"
                  required
                  value={editingMember.village_ward_area}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      village_ward_area: e.target.value,
                    })
                  }
                  className="w-full rounded border border-line px-3 py-1.5 text-xs text-ink focus:border-red-dk focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-ink-soft mb-1">
                    {isHi ? "रुचि का क्षेत्र" : "Area"}
                  </label>
                  <select
                    value={editingMember.interested_area ?? ""}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        interested_area: e.target.value || null,
                      })
                    }
                    className="w-full rounded border border-line px-2 py-1.5 text-xs text-ink focus:border-red-dk focus:outline-none"
                  >
                    <option value="">None</option>
                    {INTERESTED_AREAS.map((a) => (
                      <option key={a.id} value={a.id}>
                        {isHi ? a.hi : a.en}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-ink-soft mb-1">
                    {isHi ? "स्थिति" : "Status"}
                  </label>
                  <select
                    value={editingMember.status}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        status: e.target.value as MemberStatus,
                      })
                    }
                    className="w-full rounded border border-line px-2 py-1.5 text-xs text-ink focus:border-red-dk focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-ink-soft mb-1">
                  {isHi ? "संदेश" : "Message"}
                </label>
                <textarea
                  rows={2}
                  value={editingMember.message ?? ""}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      message: e.target.value || null,
                    })
                  }
                  className="w-full rounded border border-line px-3 py-1.5 text-xs text-ink focus:border-red-dk focus:outline-none"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-line pt-4">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="rounded border border-line px-3 py-1.5 text-xs text-ink hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded bg-red-dk px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-deep disabled:opacity-50 cursor-pointer"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-5 sm:p-6 shadow-2xl">
            <h3 className="font-heading text-lg font-bold text-red-700">
              {isHi ? "सदस्य रिकॉर्ड हटाएं?" : "Delete Member Record?"}
            </h3>
            <p className="mt-2 text-xs text-ink leading-relaxed">
              {isHi
                ? `क्या आप वाकई "${deletingMember.full_name}" (${deletingMember.registration_id}) का रिकॉर्ड हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।`
                : `Are you sure you want to delete "${deletingMember.full_name}" (${deletingMember.registration_id})? This action cannot be undone.`}
            </p>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-line pt-4">
              <button
                type="button"
                onClick={() => setDeletingMember(null)}
                className="rounded border border-line px-3.5 py-1.5 text-xs text-ink hover:bg-gray-50 cursor-pointer"
              >
                {isHi ? "रद्द करें" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isUpdating}
                className="rounded bg-red-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-800 disabled:opacity-50 cursor-pointer"
              >
                {isUpdating ? "Deleting..." : isHi ? "हाँ, हटाएं" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
