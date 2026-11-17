"use client";

import { useState } from "react";
import { TicketItem, TicketStatus } from "../types";
import { updateTicketStatus } from "../actions/ticket-actions";
import { StatusBadge } from "./status-badge";
import { PriorityBadge } from "./priority-badge";
import {
  Clock,
  Filter,
  Phone,
  MapPin,
  User,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

interface TicketTableProps {
  initialTickets: TicketItem[];
}

export function TicketTable({ initialTickets }: TicketTableProps) {
  const [tickets, setTickets] = useState<TicketItem[]>(initialTickets);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeNoteTicketId, setActiveNoteTicketId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState<string>("");

  const filteredTickets =
    selectedStatus === "all"
      ? tickets
      : tickets.filter((t) => t.status === selectedStatus);

  const stats = {
    total: tickets.length,
    new: tickets.filter((t) => t.status === "new").length,
    inProgress: tickets.filter((t) => t.status === "in_progress").length,
    pending: tickets.filter((t) => t.status === "pending").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  const handleStatusChange = async (ticket: TicketItem, newStatus: TicketStatus) => {
    if (ticket.status === newStatus) return;

    setUpdatingId(ticket.id);
    const result = await updateTicketStatus({
      ticketId: ticket.id,
      status: newStatus,
      adminNote: activeNoteTicketId === ticket.id ? adminNote : undefined,
    });

    setUpdatingId(null);
    setActiveNoteTicketId(null);
    setAdminNote("");

    if (result.success) {
      setTickets((prev) =>
        prev.map((t) => (t.id === ticket.id ? result.data : t))
      );
    } else {
      alert("ไม่สามารถเปลี่ยนสถานะได้: " + result.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">เคสทั้งหมด</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</p>
        </div>
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200/60 shadow-sm">
          <p className="text-xs font-semibold text-blue-700">งานใหม่ (New)</p>
          <p className="text-2xl font-bold text-blue-800 mt-1">{stats.new}</p>
        </div>
        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 shadow-sm">
          <p className="text-xs font-semibold text-amber-700">กำลังทำ (In Progress)</p>
          <p className="text-2xl font-bold text-amber-800 mt-1">{stats.inProgress}</p>
        </div>
        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200/60 shadow-sm">
          <p className="text-xs font-semibold text-emerald-700">ปิดงานแล้ว (Resolved)</p>
          <p className="text-2xl font-bold text-emerald-800 mt-1">{stats.resolved}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "ทั้งหมด" },
            { id: "new", label: "งานใหม่" },
            { id: "in_progress", label: "กำลังทำ" },
            { id: "pending", label: "ติดปัญหา" },
            { id: "resolved", label: "ปิดงานแล้ว" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                selectedStatus === tab.id
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500">
          แสดง {filteredTickets.length} รายการ
        </span>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
            ไม่มีรายการแจ้งซ่อมในสถานะนี้
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                  <span className="text-xs text-slate-400">
                    ID: {ticket.id.slice(0, 8)}...
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {new Date(ticket.createdAt).toLocaleString("th-TH", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>

              {/* Title & Location */}
              <div className="mb-3">
                <h3 className="text-base font-bold text-slate-800">
                  {ticket.issueType}
                </h3>
                {ticket.description && (
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded-lg">
                    {ticket.description}
                  </p>
                )}
              </div>

              {/* User details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 mb-4 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800">{ticket.fullName}</span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                    {ticket.userType === "student" ? "นักศึกษา" : "บุคลากร"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <a
                    href={`tel:${ticket.phone}`}
                    className="text-blue-600 hover:underline font-mono"
                  >
                    {ticket.phone}
                  </a>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{ticket.location}</span>
                </div>
              </div>

              {/* Image Preview if available */}
              {ticket.imageUrl && (
                <div className="mb-4">
                  <a
                    href={ticket.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    ดูรูปภาพแนบ
                  </a>
                </div>
              )}

              {/* Actions & Status Control */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-slate-700">
                    ปรับสถานะ:
                  </span>
                  {(["new", "in_progress", "pending", "resolved"] as TicketStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        disabled={updatingId === ticket.id || ticket.status === st}
                        onClick={() => handleStatusChange(ticket, st)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                          ticket.status === st
                            ? "bg-slate-800 text-white border-slate-800"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {st === "new" && "New"}
                        {st === "in_progress" && "In Progress"}
                        {st === "pending" && "Pending"}
                        {st === "resolved" && "Resolved"}
                      </button>
                    )
                  )}
                  {updatingId === ticket.id && (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveNoteTicketId(
                      activeNoteTicketId === ticket.id ? null : ticket.id
                    )
                  }
                  className="text-xs text-slate-500 hover:text-blue-600 inline-flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {activeNoteTicketId === ticket.id ? "ปิดข้อความ" : "+ แนบโน้ตแจ้งผู้ใช้"}
                </button>
              </div>

              {/* Admin Note Box */}
              {activeNoteTicketId === ticket.id && (
                <div className="mt-3 p-3 bg-blue-50/60 border border-blue-200 rounded-lg">
                  <label className="block text-xs font-semibold text-blue-900 mb-1">
                    ข้อความหมายเหตุส่งเข้า LINE ผู้ใช้ (เมื่อกดย้ายสถานะ):
                  </label>
                  <input
                    type="text"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="เช่น รออะไหล่จอภาพ 2 วัน หรือ กำลังเข้าไปตรวจสอบที่ห้อง 102..."
                    className="w-full px-3 py-1.5 text-xs rounded-md border border-blue-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
