import { LocationStat } from "../types";
import { MapPin } from "lucide-react";

interface LocationChartProps {
  locations: LocationStat[];
  totalTickets: number;
}

export function LocationChart({ locations, totalTickets }: LocationChartProps) {
  if (locations.length === 0) {
    return (
      <div className="bg-white p-6 rounded-[2px] border border-[#e0e0e0] flex flex-col items-center justify-center min-h-[260px] text-xs text-[#8f8f8f]">
        ไม่มีข้อมูลสถานที่ในช่วงเวลานี้
      </div>
    );
  }

  const maxCount = Math.max(...locations.map((l) => l.count), 1);

  return (
    <div className="bg-white p-6 rounded-[2px] border border-[#e0e0e0] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#1d1d1f] tracking-tight">
              สถานที่ที่แจ้งซ่อมบ่อยที่สุด 5 อันดับแรก
            </h3>
            <p className="text-xs text-[#666666] mt-0.5">
              วิเคราะห์อาคาร/ห้องที่มีการส่งเรื่องซ่อมบำรุงซ้ำ
            </p>
          </div>
          <div className="w-7 h-7 rounded-[2px] bg-[#ebebec] text-[#3c3c43] flex items-center justify-center shrink-0">
            <MapPin className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="space-y-3.5 mt-2">
          {locations.map((loc, idx) => {
            const barWidthPercent = Math.round((loc.count / maxCount) * 100);
            const overallPercent =
              totalTickets > 0
                ? ((loc.count / totalTickets) * 100).toFixed(1)
                : "0";

            return (
              <div key={loc.location} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="w-5 h-5 rounded-[2px] bg-[#ebebec] text-[#1d1d1f] font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-[#1d1d1f] truncate">
                      {loc.location}
                    </span>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="font-bold text-[#1d1d1f]">{loc.count}</span>
                    <span className="text-[#8f8f8f]">ครั้ง</span>
                    <span className="text-[#666666]">({overallPercent}%)</span>
                  </div>
                </div>

                <div className="w-full bg-[#ebebec] h-1.5 rounded-[2px] overflow-hidden">
                  <div
                    className="h-full bg-[#3c3c43] rounded-[2px] transition-all duration-300"
                    style={{ width: `${barWidthPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
