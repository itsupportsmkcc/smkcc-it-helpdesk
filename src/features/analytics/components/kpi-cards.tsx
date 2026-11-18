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
      <div className="bg-white p-5 rounded-[2px] border border-[#e0e0e0]">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-[#666666] tracking-wide">
            เคสทั้งหมด
          </p>
          <div className="w-7 h-7 rounded-[2px] bg-[#ebebec] flex items-center justify-center text-[#3c3c43]">
            <Layers className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className="text-3xl font-bold text-[#1d1d1f] mt-2 tracking-tight">
          {totalTickets}
        </p>
        <p className="text-[11px] text-[#8f8f8f] mt-1">
          รายการคำขอแจ้งซ่อมสะสม
        </p>
      </div>

      {/* 2. Resolved Rate */}
      <div className="bg-white p-5 rounded-[2px] border border-[#e0e0e0]">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-[#666666] tracking-wide">
            อัตราแก้ไขสำเร็จ
          </p>
          <div className="w-7 h-7 rounded-[2px] bg-[#ebebec] flex items-center justify-center text-[#009262]">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className="text-3xl font-bold text-[#009262] mt-2 tracking-tight">
          {resolvedRate}%
        </p>
        <p className="text-[11px] text-[#8f8f8f] mt-1">
          คิดจากเคสที่สถานะเสร็จสิ้น
        </p>
      </div>

      {/* 3. Average Rating */}
      <div className="bg-white p-5 rounded-[2px] border border-[#e0e0e0]">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-[#666666] tracking-wide">
            ความพึงพอใจเฉลี่ย
          </p>
          <div className="w-7 h-7 rounded-[2px] bg-[#ebebec] flex items-center justify-center text-[#e48900]">
            <Star className="w-3.5 h-3.5 fill-[#ffa826] text-[#ffa826]" />
          </div>
        </div>
        <p className="text-3xl font-bold text-[#1d1d1f] mt-2 tracking-tight">
          {averageRating > 0 ? averageRating : "-"}
          <span className="text-sm font-normal text-[#8f8f8f] ml-1">
            / 5
          </span>
        </p>
        <p className="text-[11px] text-[#8f8f8f] mt-1">
          จากผู้ประเมิน {totalFeedbacks} คน
        </p>
      </div>

      {/* 4. Active / Pending */}
      <div className="bg-white p-5 rounded-[2px] border border-[#e0e0e0]">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-[#666666] tracking-wide">
            งานที่ยังค้างอยู่
          </p>
          <div className="w-7 h-7 rounded-[2px] bg-[#ebebec] flex items-center justify-center text-[#7f0019]">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className="text-3xl font-bold text-[#7f0019] mt-2 tracking-tight">
          {activePendingCount}
        </p>
        <p className="text-[11px] text-[#8f8f8f] mt-1">
          กำลังทำ หรือ รออะไหล่/ข้อมูล
        </p>
      </div>
    </div>
  );
}
