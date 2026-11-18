"use client";

import { useState } from "react";
import { TicketItem, TicketStatus } from "../types";
import {
  updateTicketStatus,
  softDeleteTicket,
  restoreTicket,
  sendDirectMessageToUser,
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
  Send,
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
  const [activeDirectMsgTicketId, setActiveDirectMsgTicketId] = useState<string | null>(null);
  const [directMsgText, setDirectMsgText] = useState<string>("");
  const [sendingDirectMsgId, setSendingDirectMsgId] = useState<string | null>(null);
  const [directMsgSuccessTicketId, setDirectMsgSuccessTicketId] = useState<string | null>(null);

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

  const handleSendDirectMessage = async (ticketId: string) => {
    if (!directMsgText.trim()) return;

    setSendingDirectMsgId(ticketId);
    const result = await sendDirectMessageToUser({
      ticketId,
      message: directMsgText.trim(),
    });
    setSendingDirectMsgId(null);

    if (result.success) {
      setDirectMsgSuccessTicketId(ticketId);
      setDirectMsgText("");
      setTimeout(() => {
        setDirectMsgSuccessTicketId(null);
        setActiveDirectMsgTicketId(null);
      }, 3500);
    } else {
      alert("ไม่สามารถส่งข้อความได้: " + result.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards: MUJI Two-Tier Radius (2px) & Paper Canvas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-5 rounded-[2px] border border-[#e0e0e0]">
          <p className="text-xs font-medium text-[#666666] uppercase tracking-wider">เคสทั้งหมด</p>
          <p className="text-3xl font-bold text-[#1d1d1f] mt-1 tracking-tight">{stats.total}</p>
        </div>
        <div className="bg-[#ebebec] p-5 rounded-[2px] border border-[#e0e0e0]">
          <p className="text-xs font-medium text-[#666666] uppercase tracking-wider">รับเรื่องแล้ว (New)</p>
          <p className="text-3xl font-bold text-[#1d1d1f] mt-1 tracking-tight">{stats.new}</p>
        </div>
        <div className="bg-white p-5 rounded-[2px] border border-[#c4c4c6]">
          <p className="text-xs font-medium text-[#666666] uppercase tracking-wider">กำลังดำเนินการ (In Progress)</p>
          <p className="text-3xl font-bold text-[#1d1d1f] mt-1 tracking-tight">{stats.inProgress}</p>
        </div>
        <div className="bg-[#1d1d1f] p-5 rounded-[2px] border border-[#1d1d1f] text-white">
          <p className="text-xs font-medium text-[#c4c4c6] uppercase tracking-wider">เสร็จสิ้น (Complete)</p>
          <p className="text-3xl font-bold text-white mt-1 tracking-tight">{stats.resolved}</p>
        </div>
      </div>

      {/* Filter Tabs: MUJI 9999px Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-[2px] border border-[#e0e0e0]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "ทั้งหมด" },
            { id: "new", label: "รับเรื่องแล้ว" },
            { id: "in_progress", label: "กำลังดำเนินการ" },
            { id: "pending", label: "อยู่ระหว่างดำเนินการ" },
            { id: "resolved", label: "เสร็จสิ้น" },
            { id: "trash", label: `ถังขยะ (${stats.trash})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-[-0.16px] transition-all duration-150 shrink-0 border ${
                selectedStatus === tab.id
                  ? tab.id === "trash"
                    ? "bg-[#7f0019] text-white border-[#7f0019]"
                    : "bg-[#1d1d1f] text-white border-[#1d1d1f]"
                  : tab.id === "trash"
                  ? "bg-transparent text-[#7f0019] border-[#c4c4c6] hover:bg-[#ebebec]"
                  : "bg-transparent text-[#666666] border-transparent hover:text-[#1d1d1f] hover:bg-[#ebebec]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-[#8f8f8f] font-normal">
          แสดง {filteredTickets.length} รายการ
        </span>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-[2px] border border-[#e0e0e0] p-10 text-center text-[#8f8f8f] text-sm">
            {selectedStatus === "trash"
              ? "ไม่มีรายการในถังขยะ"
              : "ไม่มีรายการแจ้งซ่อมในสถานะนี้"}
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`bg-white rounded-[2px] border p-5 sm:p-6 transition-colors ${
                ticket.isDeleted
                  ? "border-[#c4c4c6] bg-[#ebebec]/40"
                  : "border-[#e0e0e0]"
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e0e0e0] pb-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {ticket.isDeleted ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ebebec] text-[#7f0019] border border-[#7f0019]">
                      <Trash2 className="w-3 h-3" />
                      อยู่ในถังขยะ
                    </span>
                  ) : (
                    <StatusBadge status={ticket.status} />
                  )}
                  <PriorityBadge priority={ticket.priority} />
                  {ticket.rating ? (
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ebebec] border border-[#e0e0e0] text-[#1d1d1f] text-xs font-medium">
                      <div className="flex items-center text-[#ffa826]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= (ticket.rating || 0)
                                ? "fill-[#ffa826] text-[#ffa826]"
                                : "text-[#c4c4c6]"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-0.5">{ticket.rating}/5</span>
                    </div>
                  ) : ticket.status === "resolved" ? (
                    <span className="text-[10px] text-[#8f8f8f] px-2 py-0.5 rounded-full bg-[#ebebec] border border-[#e0e0e0] font-normal">
                      รอผู้ใช้ประเมิน
                    </span>
                  ) : null}
                  <span className="text-xs text-[#8f8f8f] font-mono">
                    #{ticket.id.slice(0, 8)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#666666] font-normal">
                    <Clock className="w-3.5 h-3.5 text-[#8f8f8f]" />
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
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-[2px] text-xs font-medium text-white bg-[#1d1d1f] hover:bg-[#3c3c43] transition-colors disabled:opacity-50"
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
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] text-xs font-medium text-[#7f0019] hover:bg-[#ebebec] border border-[#c4c4c6] transition-colors disabled:opacity-50"
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
                <h3 className="text-base font-bold text-[#1d1d1f] tracking-tight">
                  {ticket.issueType}
                </h3>
                {ticket.description && (
                  <p className="text-xs text-[#3c3c43] mt-1.5 leading-relaxed bg-[#ebebec] p-3 rounded-[2px] border border-[#e0e0e0]">
                    {ticket.description}
                  </p>
                )}
              </div>

              {/* Requester Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[#3c3c43] mb-4 bg-[#fafafa] p-3 rounded-[2px] border border-[#e0e0e0]">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#8f8f8f] shrink-0" />
                    <span className="font-medium text-[#1d1d1f]">{ticket.fullName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ebebec] text-[#3c3c43] border border-[#e0e0e0] font-normal">
                      {ticket.userType === "student" ? "นักศึกษา" : "บุคลากร"}
                    </span>
                  </div>
                  {ticket.lineDisplayName && (
                    <div className="text-[11px] text-[#8f8f8f] pl-6 flex items-center gap-1">
                      <span className="font-normal text-[#666666]">LINE Profile:</span>
                      <span className="text-[#1d1d1f] font-medium">{ticket.lineDisplayName}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#8f8f8f] shrink-0" />
                  <a
                    href={`tel:${ticket.phone}`}
                    className="text-[#1d1d1f] hover:underline font-mono font-medium"
                  >
                    {ticket.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#8f8f8f] shrink-0" />
                  <span className="truncate text-[#3c3c43]">{ticket.location}</span>
                </div>
              </div>

              {/* Image Preview Link */}
              {ticket.imageUrl && (
                <div className="mb-4">
                  <a
                    href={ticket.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#7f0019] font-medium hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    ดูรูปภาพปัญหาที่แนบ
                  </a>
                </div>
              )}

              {/* Satisfaction Rating & Feedback Box */}
              {ticket.rating ? (
                <div className="mb-4 bg-[#ebebec] p-3.5 rounded-[2px] border border-[#e0e0e0] text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-[#1d1d1f] flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-[#ffa826] text-[#ffa826]" />
                      ผลการประเมินความพึงพอใจ:
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-[#1d1d1f]">
                      <div className="flex items-center text-[#ffa826]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= (ticket.rating || 0)
                                ? "fill-[#ffa826] text-[#ffa826]"
                                : "text-[#c4c4c6]"
                            }`}
                          />
                        ))}
                      </div>
                      <span>({ticket.rating} จาก 5 ดาว)</span>
                    </div>
                  </div>
                  {ticket.comment && ticket.comment.trim() !== "" ? (
                    <p className="text-[#3c3c43] bg-white p-2.5 rounded-[2px] border border-[#c4c4c6] mt-1 leading-relaxed">
                      <span className="font-medium text-[#1d1d1f]">ความคิดเห็น/ข้อเสนอแนะ: </span>
                      "{ticket.comment.trim()}"
                    </p>
                  ) : (
                    <p className="text-[#8f8f8f] text-[11px] italic mt-0.5">
                      (ไม่มีข้อเสนอแนะเพิ่มเติม)
                    </p>
                  )}
                </div>
              ) : ticket.status === "resolved" ? (
                <div className="mb-4 bg-[#ebebec] p-2.5 rounded-[2px] border border-[#e0e0e0] text-xs text-[#666666] flex items-center justify-between">
                  <span>สถานะงาน: ดำเนินการเสร็จสิ้นแล้ว</span>
                  <span className="italic text-[11px] text-[#8f8f8f]">รอผู้ใช้ส่งแบบประเมินความพึงพอใจผ่าน LINE</span>
                </div>
              ) : null}

              {/* Status Actions: MUJI 2px Action Buttons */}
              {ticket.isDeleted ? (
                <div className="pt-3 border-t border-[#c4c4c6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#ebebec] p-3 rounded-[2px]">
                  <div className="flex items-center gap-2 text-xs text-[#7f0019] font-medium">
                    <AlertTriangle className="w-4 h-4 text-[#7f0019] shrink-0" />
                    <span>เคสนี้ถูกย้ายลงถังขยะแล้ว (ซ่อนจากหน้ารายงานสรุป)</span>
                    {ticket.deletedAt && (
                      <span className="text-[11px] text-[#8f8f8f]">
                        เมื่อ {new Date(ticket.deletedAt).toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" })}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={restoringId === ticket.id}
                    onClick={() => handleRestore(ticket)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-[2px] text-xs font-medium text-white bg-[#1d1d1f] hover:bg-[#3c3c43] transition-colors disabled:opacity-50 self-start sm:self-auto"
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
                <div className="pt-3 border-t border-[#e0e0e0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-medium text-[#666666] mr-1">
                      ปรับสถานะ:
                    </span>
                    {(["new", "in_progress", "pending", "resolved"] as TicketStatus[]).map(
                      (st) => (
                        <button
                          key={st}
                          type="button"
                          disabled={updatingId === ticket.id || ticket.status === st}
                          onClick={() => handleStatusChange(ticket, st)}
                          className={`px-3 py-1 rounded-[2px] text-xs font-medium tracking-[-0.16px] border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                            ticket.status === st
                              ? "bg-[#1d1d1f] text-white border-[#1d1d1f]"
                              : "bg-[#ebebec] text-[#3c3c43] border-[#e0e0e0] hover:bg-[#e0e0e0]"
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
                      <Loader2 className="w-4 h-4 animate-spin text-[#1d1d1f]" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDirectMsgTicketId(
                          activeDirectMsgTicketId === ticket.id ? null : ticket.id
                        );
                        setActiveNoteTicketId(null);
                      }}
                      className={`text-xs font-medium inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] border transition-colors ${
                        activeDirectMsgTicketId === ticket.id
                          ? "bg-[#1d1d1f] text-white border-[#1d1d1f]"
                          : "bg-white text-[#3c3c43] border-[#c4c4c6] hover:bg-[#ebebec]"
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{activeDirectMsgTicketId === ticket.id ? "ปิดกล่องแชท" : "แชทส่งเข้า LINE"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveNoteTicketId(
                          activeNoteTicketId === ticket.id ? null : ticket.id
                        );
                        setActiveDirectMsgTicketId(null);
                      }}
                      className="text-xs text-[#666666] hover:text-[#1d1d1f] font-medium inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] border border-transparent hover:bg-[#ebebec]"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      {activeNoteTicketId === ticket.id ? "ปิดกล่องโน้ต" : "+ โน้ตย้ายสถานะ"}
                    </button>
                  </div>
                </div>
              )}

              {/* Direct Message to User Box (แชทตรงเข้า LINE) */}
              {!ticket.isDeleted && activeDirectMsgTicketId === ticket.id && (
                <div className="mt-3 p-3.5 bg-[#ebebec] border border-[#c4c4c6] rounded-[2px] space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <label className="text-xs font-bold text-[#1d1d1f] flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-[#1d1d1f]" />
                      <span>ส่งข้อความด่วนเข้า LINE ผู้แจ้ง:</span>
                    </label>
                    <span className="text-[11px] text-[#666666] font-normal">
                      ผู้รับ: <b>{ticket.fullName}</b> {ticket.lineDisplayName ? `(@${ticket.lineDisplayName})` : ""}
                    </span>
                  </div>

                  <textarea
                    rows={2}
                    value={directMsgText}
                    onChange={(e) => setDirectMsgText(e.target.value)}
                    placeholder="พิมพ์ข้อความที่ต้องการแจ้งผู้ใช้ เช่น ช่างกำลังเข้าไปตรวจสอบที่ห้อง 201 ภายใน 10 นาที..."
                    className="w-full px-3 py-2 text-xs rounded-[2px] border border-[#c4c4c6] bg-white focus:outline-none focus:border-[#1d1d1f] resize-none"
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
                    <div className="text-[11px] text-[#666666]">
                      {directMsgSuccessTicketId === ticket.id ? (
                        <span className="text-[#009262] font-medium inline-flex items-center gap-1">
                          ส่งข้อความเข้า LINE ผู้ใช้เรียบร้อยแล้ว
                        </span>
                      ) : (
                        <span>ข้อความจะส่งตรงเข้าแชท LINE ของผู้แจ้งทันที</span>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={sendingDirectMsgId === ticket.id || !directMsgText.trim()}
                      onClick={() => handleSendDirectMessage(ticket.id)}
                      className="px-4 py-1.5 rounded-[2px] text-xs font-medium text-white bg-[#1d1d1f] hover:bg-[#3c3c43] transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5 self-end sm:self-auto"
                    >
                      {sendingDirectMsgId === ticket.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>ส่งเข้า LINE ทันที</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Admin Note Input */}
              {!ticket.isDeleted && activeNoteTicketId === ticket.id && (
                <div className="mt-3 p-3 bg-[#ebebec] border border-[#c4c4c6] rounded-[2px]">
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                    ข้อความหมายเหตุส่งเข้าแชท LINE ผู้แจ้ง (เมื่อกดย้ายสถานะ):
                  </label>
                  <input
                    type="text"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="เช่น กำลังเข้าไปดูที่ห้อง 102 ภายใน 15 นาที หรือ รออะไหล่ 2 วัน..."
                    className="w-full px-3 py-2 text-xs rounded-[2px] border border-[#c4c4c6] bg-white focus:outline-none focus:border-[#1d1d1f]"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal สำหรับการ Soft Delete */}
      {confirmDeleteTicketItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[2px] max-w-md w-full p-6 border border-[#e0e0e0] space-y-4">
            <div className="flex items-center gap-3 text-[#7f0019]">
              <div className="w-10 h-10 rounded-[2px] bg-[#ebebec] flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-[#7f0019]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#1d1d1f]">ยืนยันการย้ายเคสลงถังขยะ?</h4>
                <p className="text-xs text-[#8f8f8f] font-mono mt-0.5">
                  #{confirmDeleteTicketItem.id.slice(0, 8)} • {confirmDeleteTicketItem.fullName}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#3c3c43] leading-relaxed bg-[#ebebec] p-3 rounded-[2px] border border-[#e0e0e0]">
              เคสนี้จะถูกย้ายไปอยู่ในแท็บ <b>"ถังขยะ"</b> และจะไม่นำมาคำนวณในสถิติหรือรายงานสรุป (Reports) แต่ข้อมูลยังคงอยู่และสามารถกดกู้คืนได้ตลอดเวลา
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteTicketItem(null)}
                className="px-4 py-2 rounded-[2px] text-xs font-medium text-[#3c3c43] hover:bg-[#ebebec] transition-colors border border-transparent"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={deletingId === confirmDeleteTicketItem.id}
                onClick={() => handleSoftDelete(confirmDeleteTicketItem)}
                className="px-4 py-2 rounded-[2px] text-xs font-medium text-white bg-[#7f0019] hover:bg-[#600013] transition-colors inline-flex items-center gap-1.5"
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
