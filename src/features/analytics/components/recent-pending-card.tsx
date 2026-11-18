import Link from "next/link";
import { TicketItem } from "@/features/tickets/types";
import { StatusBadge } from "@/features/tickets/components/status-badge";
import { PriorityBadge } from "@/features/tickets/components/priority-badge";
import { ArrowRight, Clock, MapPin, User } from "lucide-react";

interface RecentPendingCardProps {
  tickets: TicketItem[];
}

export function RecentPendingCard({ tickets }: RecentPendingCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#e7e7e7] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#1E3932] tracking-tight">
            งานล่าสุดที่รอช่างดำเนินการ
          </h3>
          <p className="text-xs text-[rgba(0,0,0,0.55)] mt-0.5">
            5 เคสล่าสุดที่ยังไม่เสร็จสิ้น เพื่อติดตามงานได้ทันท่วงที
          </p>
        </div>

        <Link
          href="/admin/tickets"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f2f0eb] hover:bg-[#edebe9] text-xs font-bold text-[#1E3932] transition-colors"
        >
          <span>ไปที่รายการแจ้งซ่อมทั้งหมด</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#00754A] font-semibold bg-[#d4e9e2]/30 rounded-xl border border-[#a3d2c1]">
          ✨ ยอดเยี่ยม! ขณะนี้ไม่มีงานแจ้งซ่อมค้างในระบบ
        </div>
      ) : (
        <div className="divide-y divide-[#e7e7e7]">
          {tickets.map((t) => (
            <div
              key={t.id}
              className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={t.status} />
                  <PriorityBadge priority={t.priority} />
                  <span className="font-mono text-xs text-[rgba(0,0,0,0.4)]">
                    #{t.id.slice(0, 8)}
                  </span>
                  <span className="font-bold text-xs text-[#1E3932]">
                    {t.issueType}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-[rgba(0,0,0,0.58)] flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    <User className="w-3 h-3 text-[#00754A]" />
                    {t.fullName} ({t.userType === "student" ? "นักศึกษา" : "บุคลากร"})
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#00754A]" />
                    {t.location}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-[#00754A]" />
                    {new Date(t.createdAt).toLocaleString("th-TH", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>

              <Link
                href="/admin/tickets"
                className="text-xs font-semibold text-[#00754A] hover:underline shrink-0"
              >
                จัดการงานนี้ →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
