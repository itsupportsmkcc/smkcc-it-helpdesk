"use client";

import { useState } from "react";
import { TicketItem, TicketStatus } from "../types";
import { updateTicketStatus } from "../actions/ticket-actions";
import { StatusBadge } from "./status-badge";
import { PriorityBadge } from "./priority-badge";
import {
  Clock,
  Phone,
  MapPin,
  User,
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
      {/* Stats Cards: Starbucks Clean Café Style */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-5 rounded-[12px] shadow-[0_0_1px_rgba(0,0,0,0.14),0_1px_2px_rgba(0,0,0,0.12)] border border-[#e7e7e7]">
          <p className="text-xs font-semibold text-[rgba(0,0,0,0.58)] uppercase tracking-wider">เคสทั้งหมด</p>
          <p className="text-3xl font-bold text-[#1E3932] mt-1 tracking-tight">{stats.total}</p>
        </div>
        <div className="bg-[#faf6ee] p-5 rounded-[12px] shadow-[0_0_1px_rgba(0,0,0,0.14),0_1px_2px_rgba(0,0,0,0.12)] border border-[#dfc49d]">
          <p className="text-xs font-semibold text-[#8c6b2d] uppercase tracking-wider">งานใหม่ (New)</p>
          <p className="text-3xl font-bold text-[#8c6b2d] mt-1 tracking-tight">{stats.new}</p>
        </div>
        <div className="bg-[#d4e9e2]/60 p-5 rounded-[12px] shadow-[0_0_1px_rgba(0,0,0,0.14),0_1px_2px_rgba(0,0,0,0.12)] border border-[#a3d2c1]">
          <p className="text-xs font-semibold text-[#006241] uppercase tracking-wider">กำลังทำ (In Progress)</p>
          <p className="text-3xl font-bold text-[#006241] mt-1 tracking-tight">{stats.inProgress}</p>
        </div>
        <div className="bg-[#1E3932] p-5 rounded-[12px] shadow-[0_0_1px_rgba(0,0,0,0.14),0_1px_2px_rgba(0,0,0,0.12)] text-white">
          <p className="text-xs font-semibold text-[#d4e9e2] uppercase tracking-wider">ปิดงานแล้ว (Resolved)</p>
          <p className="text-3xl font-bold text-white mt-1 tracking-tight">{stats.resolved}</p>
        </div>
      </div>

      {/* Filter Tabs: Starbucks 50px Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-[12px] shadow-[0_0_1px_rgba(0,0,0,0.14),0_1px_2px_rgba(0,0,0,0.12)] border border-[#e7e7e7]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
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
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-[-0.16px] transition-all duration-200 active:scale-[0.95] shrink-0 border ${
                selectedStatus === tab.id
                  ? "bg-[#00754A] text-white border-[#00754A] shadow-sm"
                  : "bg-transparent text-[rgba(0,0,0,0.87)] border-transparent hover:bg-[#edebe9]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-[rgba(0,0,0,0.58)] font-medium">
          แสดง {filteredTickets.length} รายการ
        </span>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-[12px] border border-[#e7e7e7] p-10 text-center text-[rgba(0,0,0,0.58)] text-sm">
            ไม่มีรายการแจ้งซ่อมในสถานะนี้
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-[12px] border border-[#e7e7e7] p-5 sm:p-6 shadow-[0_0_1px_rgba(0,0,0,0.14),0_1px_2px_rgba(0,0,0,0.12)] hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e7e7e7] pb-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                  <span className="text-xs text-[rgba(0,0,0,0.4)] font-mono">
                    #{ticket.id.slice(0, 8)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[rgba(0,0,0,0.58)] font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#00754A]" />
                  <span>
                    {new Date(ticket.createdAt).toLocaleString("th-TH", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="mb-4">
                <h3 className="text-base font-bold text-[#1E3932] tracking-[-0.16px]">
                  {ticket.issueType}
                </h3>
                {ticket.description && (
                  <p className="text-xs text-[rgba(0,0,0,0.7)] mt-1.5 leading-relaxed bg-[#f2f0eb] p-3 rounded-xl border border-[#e7e7e7]">
                    {ticket.description}
                  </p>
                )}
              </div>

              {/* Requester Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[rgba(0,0,0,0.87)] mb-4 bg-[#faf9f7] p-3 rounded-xl border border-[#e7e7e7]">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#00754A] shrink-0" />
                    <span className="font-semibold">{ticket.fullName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4e9e2] text-[#006241] font-semibold">
                      {ticket.userType === "student" ? "นักศึกษา" : "บุคลากร"}
                    </span>
                  </div>
                  {ticket.lineDisplayName && (
                    <div className="text-[11px] text-[rgba(0,0,0,0.55)] pl-6 flex items-center gap-1">
                      <span className="font-medium text-[#1E3932]">LINE Profile:</span>
                      <span className="text-[#00754A] font-semibold">{ticket.lineDisplayName}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#00754A] shrink-0" />
                  <a
                    href={`tel:${ticket.phone}`}
                    className="text-[#00754A] hover:underline font-mono font-medium"
                  >
                    {ticket.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00754A] shrink-0" />
                  <span className="truncate">{ticket.location}</span>
                </div>
              </div>

              {/* Image Preview Link */}
              {ticket.imageUrl && (
                <div className="mb-4">
                  <a
                    href={ticket.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#00754A] font-semibold hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    ดูรูปภาพปัญหาที่แนบ
                  </a>
                </div>
              )}

              {/* Status Actions: Starbucks 50px Pills */}
              <div className="pt-3 border-t border-[#e7e7e7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-[rgba(0,0,0,0.87)] mr-1">
                    ปรับสถานะ:
                  </span>
                  {(["new", "in_progress", "pending", "resolved"] as TicketStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        disabled={updatingId === ticket.id || ticket.status === st}
                        onClick={() => handleStatusChange(ticket, st)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold tracking-[-0.16px] border transition-all duration-200 active:scale-[0.95] disabled:opacity-40 disabled:cursor-not-allowed ${
                          ticket.status === st
                            ? "bg-[#00754A] text-white border-[#00754A] shadow-sm"
                            : "bg-[#f2f0eb] text-[rgba(0,0,0,0.87)] border-[#d6dbde] hover:bg-[#edebe9]"
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
                    <Loader2 className="w-4 h-4 animate-spin text-[#00754A]" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveNoteTicketId(
                      activeNoteTicketId === ticket.id ? null : ticket.id
                    )
                  }
                  className="text-xs text-[#00754A] hover:text-[#006241] font-semibold inline-flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {activeNoteTicketId === ticket.id ? "ปิดกล่องโน้ต" : "+ แนบโน้ตแจ้งผู้ใช้ใน LINE"}
                </button>
              </div>

              {/* Admin Note Input */}
              {activeNoteTicketId === ticket.id && (
                <div className="mt-3 p-3 bg-[#faf6ee] border border-[#dfc49d] rounded-xl">
                  <label className="block text-xs font-semibold text-[#8c6b2d] mb-1">
                    ข้อความหมายเหตุส่งเข้าแชท LINE ผู้แจ้ง (เมื่อกดย้ายสถานะ):
                  </label>
                  <input
                    type="text"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="เช่น กำลังเข้าไปดูที่ห้อง 102 ภายใน 15 นาที หรือ รออะไหล่ 2 วัน..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#dfc49d] bg-white focus:outline-none focus:ring-1 focus:ring-[#00754A]"
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
