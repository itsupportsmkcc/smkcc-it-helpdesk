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
    <div className="bg-white p-6 rounded-[2px] border border-[#e0e0e0]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#1d1d1f] tracking-tight">
            งานล่าสุดที่รอช่างดำเนินการ
          </h3>
          <p className="text-xs text-[#666666] mt-0.5">
            5 เคสล่าสุดที่ยังไม่เสร็จสิ้น เพื่อติดตามงานได้ทันท่วงที
          </p>
        </div>

        <Link
          href="/admin/tickets"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-[#ebebec] hover:bg-[#e0e0e0] border border-[#c4c4c6] text-xs font-medium text-[#1d1d1f] transition-colors"
        >
          <span>ไปที่รายการแจ้งซ่อมทั้งหมด</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#3c3c43] bg-[#ebebec] rounded-[2px] border border-[#e0e0e0]">
          ขณะนี้ไม่มีงานแจ้งซ่อมค้างในระบบ
        </div>
      ) : (
        <div className="divide-y divide-[#e0e0e0]">
          {tickets.map((t) => (
            <div
              key={t.id}
              className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={t.status} />
                  <PriorityBadge priority={t.priority} />
                  <span className="font-mono text-xs text-[#8f8f8f]">
                    #{t.id.slice(0, 8)}
                  </span>
                  <span className="font-bold text-xs text-[#1d1d1f]">
                    {t.issueType}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-[#666666] flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    <User className="w-3 h-3 text-[#8f8f8f]" />
                    {t.fullName} ({t.userType === "student" ? "นักศึกษา" : "บุคลากร"})
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#8f8f8f]" />
                    {t.location}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-[#8f8f8f]" />
                    {new Date(t.createdAt).toLocaleString("th-TH", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>

              <Link
                href="/admin/tickets"
                className="text-xs font-medium text-[#1d1d1f] hover:text-[#7f0019] hover:underline shrink-0"
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
