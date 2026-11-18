"use client";

import { useState } from "react";
import { TicketItem, TicketStatus } from "../types";
import {
  updateTicketStatus,
  softDeleteTicket,
  restoreTicket,
} from "../actions/ticket-actions";
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
  Star,
  Trash2,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

interface TicketTableProps {
  initialTickets: TicketItem[];
}

export function TicketTable({ initialTickets }: TicketTableProps) {
  const [tickets, setTickets] = useState<TicketItem[]>(initialTickets);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [confirmDeleteTicketItem, setConfirmDeleteTicketItem] = useState<TicketItem | null>(null);
  const [activeNoteTicketId, setActiveNoteTicketId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState<string>("");

  const activeTickets = tickets.filter((t) => !t.isDeleted);
  const trashTickets = tickets.filter((t) => t.isDeleted);

  const filteredTickets =
    selectedStatus === "trash"
      ? trashTickets
      : selectedStatus === "all"
      ? activeTickets
      : activeTickets.filter((t) => t.status === selectedStatus);

  const stats = {
    total: activeTickets.length,
    new: activeTickets.filter((t) => t.status === "new").length,
    inProgress: activeTickets.filter((t) => t.status === "in_progress").length,
    pending: activeTickets.filter((t) => t.status === "pending").length,
    resolved: activeTickets.filter((t) => t.status === "resolved").length,
    trash: trashTickets.length,
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

  const handleSoftDelete = async (ticket: TicketItem) => {
    setDeletingId(ticket.id);
    const result = await softDeleteTicket({ ticketId: ticket.id });
    setDeletingId(null);
    setConfirmDeleteTicketItem(null);

    if (result.success) {
      setTickets((prev) =>
        prev.map((t) => (t.id === ticket.id ? { ...result.data, isDeleted: true } : t))
      );
    } else {
      alert("ไม่สามารถย้ายลงถังขยะได้: " + result.error);
    }
  };

  const handleRestore = async (ticket: TicketItem) => {
    setRestoringId(ticket.id);
    const result = await restoreTicket({ ticketId: ticket.id });
    setRestoringId(null);

    if (result.success) {
      setTickets((prev) =>
        prev.map((t) => (t.id === ticket.id ? { ...result.data, isDeleted: false } : t))
      );
    } else {
      alert("ไม่สามารถกู้คืนได้: " + result.error);
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
          <p className="text-xs font-semibold text-[#8c6b2d] uppercase tracking-wider">รับเรื่องแล้ว (New)</p>
          <p className="text-3xl font-bold text-[#8c6b2d] mt-1 tracking-tight">{stats.new}</p>
        </div>
        <div className="bg-[#d4e9e2]/60 p-5 rounded-[12px] shadow-[0_0_1px_rgba(0,0,0,0.14),0_1px_2px_rgba(0,0,0,0.12)] border border-[#a3d2c1]">
          <p className="text-xs font-semibold text-[#006241] uppercase tracking-wider">กำลังดำเนินการ (In Progress)</p>
          <p className="text-3xl font-bold text-[#006241] mt-1 tracking-tight">{stats.inProgress}</p>
        </div>
        <div className="bg-[#1E3932] p-5 rounded-[12px] shadow-[0_0_1px_rgba(0,0,0,0.14),0_1px_2px_rgba(0,0,0,0.12)] text-white">
          <p className="text-xs font-semibold text-[#d4e9e2] uppercase tracking-wider">เสร็จสิ้น (Complete)</p>
          <p className="text-3xl font-bold text-white mt-1 tracking-tight">{stats.resolved}</p>
        </div>
      </div>

      {/* Filter Tabs: Starbucks 50px Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-[12px] shadow-[0_0_1px_rgba(0,0,0,0.14),0_1px_2px_rgba(0,0,0,0.12)] border border-[#e7e7e7]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "ทั้งหมด" },
            { id: "new", label: "รับเรื่องแล้ว" },
            { id: "in_progress", label: "กำลังดำเนินการ" },
            { id: "pending", label: "อยู่ระหว่างดำเนินการ" },
            { id: "resolved", label: "เสร็จสิ้น" },
            { id: "trash", label: `🗑️ ถังขยะ (${stats.trash})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-[-0.16px] transition-all duration-200 active:scale-[0.95] shrink-0 border ${
                selectedStatus === tab.id
                  ? tab.id === "trash"
                    ? "bg-[#c2410c] text-white border-[#c2410c] shadow-sm"
                    : "bg-[#00754A] text-white border-[#00754A] shadow-sm"
                  : tab.id === "trash"
                  ? "bg-transparent text-[#c2410c] border-[#fed7aa] hover:bg-[#fff7ed]"
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
            {selectedStatus === "trash"
              ? "ไม่มีรายการในถังขยะ"
              : "ไม่มีรายการแจ้งซ่อมในสถานะนี้"}
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`bg-white rounded-[12px] border p-5 sm:p-6 shadow-[0_0_1px_rgba(0,0,0,0.14),0_1px_2px_rgba(0,0,0,0.12)] hover:shadow-md transition-shadow ${
                ticket.isDeleted
                  ? "border-red-200 bg-red-50/20"
                  : "border-[#e7e7e7]"
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e7e7e7] pb-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {ticket.isDeleted ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                      <Trash2 className="w-3 h-3" />
                      อยู่ในถังขยะ
                    </span>
                  ) : (
                    <StatusBadge status={ticket.status} />
                  )}
                  <PriorityBadge priority={ticket.priority} />
                  {ticket.rating ? (
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#faf6ee] border border-[#dfc49d] text-[#8c6b2d] text-xs font-bold shadow-sm">
                      <div className="flex items-center text-[#d97706]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= (ticket.rating || 0)
                                ? "fill-[#d97706] text-[#d97706]"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-0.5">{ticket.rating}/5</span>
                    </div>
                  ) : ticket.status === "resolved" ? (
                    <span className="text-[10px] text-[rgba(0,0,0,0.5)] px-2 py-0.5 rounded-full bg-[#f2f0eb] border border-[#e7e7e7] font-medium">
                      รอผู้ใช้ประเมิน
                    </span>
                  ) : null}
                  <span className="text-xs text-[rgba(0,0,0,0.4)] font-mono">
                    #{ticket.id.slice(0, 8)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-[rgba(0,0,0,0.58)] font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#00754A]" />
                    <span>
                      {new Date(ticket.createdAt).toLocaleString("th-TH", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>

                  {ticket.isDeleted ? (
                    <button
                      type="button"
                      disabled={restoringId === ticket.id}
                      onClick={() => handleRestore(ticket)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white bg-[#00754A] hover:bg-[#006241] transition-all disabled:opacity-50 shadow-sm"
                      title="กู้คืนรายการนี้กลับมาเป็นเคสปกติ"
                    >
                      {restoringId === ticket.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <RotateCcw className="w-3.5 h-3.5" />
                      )}
                      <span>กู้คืนเคส</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={deletingId === ticket.id}
                      onClick={() => setConfirmDeleteTicketItem(ticket)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all disabled:opacity-50"
                      title="ย้ายเคสนี้ลงถังขยะ (สามารถกู้คืนได้ภายหลัง)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ย้ายลงถังขยะ</span>
                    </button>
                  )}
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

              {/* Satisfaction Rating & Feedback Box */}
              {ticket.rating ? (
                <div className="mb-4 bg-[#faf6ee] p-3.5 rounded-xl border border-[#dfc49d] text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-[#8c6b2d] flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-[#d97706] text-[#d97706]" />
                      ผลการประเมินความพึงพอใจ:
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-[#8c6b2d]">
                      <div className="flex items-center text-[#d97706]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= (ticket.rating || 0)
                                ? "fill-[#d97706] text-[#d97706]"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span>({ticket.rating} จาก 5 ดาว)</span>
                    </div>
                  </div>
                  {ticket.comment && ticket.comment.trim() !== "" ? (
                    <p className="text-[rgba(0,0,0,0.78)] bg-white/90 p-2.5 rounded-lg border border-[#dfc49d]/60 mt-1 leading-relaxed">
                      <span className="font-semibold text-[#8c6b2d]">ความคิดเห็น/ข้อเสนอแนะ: </span>
                      "{ticket.comment.trim()}"
                    </p>
                  ) : (
                    <p className="text-[rgba(0,0,0,0.45)] text-[11px] italic mt-0.5">
                      (ไม่มีข้อเสนอแนะเพิ่มเติม)
                    </p>
                  )}
                </div>
              ) : ticket.status === "resolved" ? (
                <div className="mb-4 bg-[#faf9f7] p-2.5 rounded-xl border border-dashed border-[#d6dbde] text-xs text-[rgba(0,0,0,0.5)] flex items-center justify-between">
                  <span>สถานะงาน: ดำเนินการเสร็จสิ้นแล้ว</span>
                  <span className="italic text-[11px]">⏳ รอผู้ใช้กดส่งแบบประเมินความพึงพอใจผ่าน LINE...</span>
                </div>
              ) : null}

              {/* Status Actions: Starbucks 50px Pills หรือ ข้อมูลถังขยะ */}
              {ticket.isDeleted ? (
                <div className="pt-3 border-t border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-red-50/50 p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-red-800 font-medium">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>เคสนี้ถูกย้ายลงถังขยะแล้ว (ซ่อนจากหน้ารายงานสรุป)</span>
                    {ticket.deletedAt && (
                      <span className="text-[11px] text-red-600/80">
                        เมื่อ {new Date(ticket.deletedAt).toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" })}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={restoringId === ticket.id}
                    onClick={() => handleRestore(ticket)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-[#00754A] hover:bg-[#006241] transition-all disabled:opacity-50 shadow-sm self-start sm:self-auto"
                  >
                    {restoringId === ticket.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RotateCcw className="w-3.5 h-3.5" />
                    )}
                    <span>กู้คืนเคสนี้กลับมา</span>
                  </button>
                </div>
              ) : (
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
                          {st === "resolved" && "Complete"}
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
              )}

              {/* Admin Note Input */}
              {!ticket.isDeleted && activeNoteTicketId === ticket.id && (
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

      {/* Confirmation Modal สำหรับการ Soft Delete */}
      {confirmDeleteTicketItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#e7e7e7] space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#1E3932]">ยืนยันการย้ายเคสลงถังขยะ?</h4>
                <p className="text-xs text-[rgba(0,0,0,0.58)] font-mono mt-0.5">
                  #{confirmDeleteTicketItem.id.slice(0, 8)} • {confirmDeleteTicketItem.fullName}
                </p>
              </div>
            </div>

            <p className="text-xs text-[rgba(0,0,0,0.7)] leading-relaxed bg-[#faf9f7] p-3 rounded-xl border border-[#e7e7e7]">
              เคสนี้จะถูกย้ายไปอยู่ในแท็บ <b>"ถังขยะ"</b> และจะไม่นำมาคำนวณในสถิติหรือรายงานสรุป (Reports) แต่ข้อมูลยังคงอยู่และสามารถกดกู้คืนได้ตลอดเวลา
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteTicketItem(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[rgba(0,0,0,0.7)] hover:bg-[#edebe9] transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={deletingId === confirmDeleteTicketItem.id}
                onClick={() => handleSoftDelete(confirmDeleteTicketItem)}
                className="px-4 py-2 rounded-full text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm inline-flex items-center gap-1.5"
              >
                {deletingId === confirmDeleteTicketItem.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>ยืนยันย้ายลงถังขยะ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
