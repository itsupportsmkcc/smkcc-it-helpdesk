import { CheckCircle2, Clock, Star, Layers } from "lucide-react";

interface KpiCardsProps {
  totalTickets: number;
  resolvedRate: number;
  averageRating: number;
  totalFeedbacks: number;
  activePendingCount: number;
}

export function KpiCards({
  totalTickets,
  resolvedRate,
  averageRating,
  totalFeedbacks,
  activePendingCount,
}: KpiCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Total Tickets */}
      <div className="bg-white p-5 rounded-2xl border border-[#e7e7e7] shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[rgba(0,0,0,0.58)] tracking-wide">
            เคสทั้งหมด
          </p>
          <div className="w-8 h-8 rounded-xl bg-[#f2f0eb] flex items-center justify-center text-[#1E3932]">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <p className="text-3xl font-extrabold text-[#1E3932] mt-2 tracking-tight">
          {totalTickets}
        </p>
        <p className="text-[11px] text-[rgba(0,0,0,0.5)] mt-1">
          รายการคำขอแจ้งซ่อมสะสม
        </p>
      </div>

      {/* 2. Resolved Rate */}
      <div className="bg-white p-5 rounded-2xl border border-[#e7e7e7] shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[rgba(0,0,0,0.58)] tracking-wide">
            อัตราแก้ไขสำเร็จ
          </p>
          <div className="w-8 h-8 rounded-xl bg-[#d4e9e2] flex items-center justify-center text-[#006241]">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <p className="text-3xl font-extrabold text-[#00754A] mt-2 tracking-tight">
          {resolvedRate}%
        </p>
        <p className="text-[11px] text-[rgba(0,0,0,0.5)] mt-1">
          คิดจากเคสที่สถานะเสร็จสิ้น
        </p>
      </div>

      {/* 3. Average Rating */}
      <div className="bg-white p-5 rounded-2xl border border-[#e7e7e7] shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[rgba(0,0,0,0.58)] tracking-wide">
            ความพึงพอใจเฉลี่ย
          </p>
          <div className="w-8 h-8 rounded-xl bg-[#faf6ee] flex items-center justify-center text-[#8c6b2d]">
            <Star className="w-4 h-4 fill-[#d97706] text-[#d97706]" />
          </div>
        </div>
        <p className="text-3xl font-extrabold text-[#8c6b2d] mt-2 tracking-tight">
          {averageRating > 0 ? averageRating : "-"}
          <span className="text-sm font-semibold text-[rgba(0,0,0,0.4)] ml-1">
            / 5
          </span>
        </p>
        <p className="text-[11px] text-[rgba(0,0,0,0.5)] mt-1">
          จากผู้ประเมิน {totalFeedbacks} คน
        </p>
      </div>

      {/* 4. Active / Pending */}
      <div className="bg-white p-5 rounded-2xl border border-[#e7e7e7] shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[rgba(0,0,0,0.58)] tracking-wide">
            งานที่ยังค้างอยู่
          </p>
          <div className="w-8 h-8 rounded-xl bg-[#fff7ed] flex items-center justify-center text-[#c2410c]">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <p className="text-3xl font-extrabold text-[#c2410c] mt-2 tracking-tight">
          {activePendingCount}
        </p>
        <p className="text-[11px] text-[rgba(0,0,0,0.5)] mt-1">
          กำลังทำ หรือ รออะไหล่/ข้อมูล
        </p>
      </div>
    </div>
  );
}
