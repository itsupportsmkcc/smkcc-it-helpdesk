"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { TimeRangeFilter } from "../schemas/analytics-schema";

export function TimeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = (searchParams.get("range") as TimeRangeFilter) || "all";

  const options: { id: TimeRangeFilter; label: string }[] = [
    { id: "all", label: "ทั้งหมด" },
    { id: "this_month", label: "เดือนนี้" },
    { id: "last_30_days", label: "30 วันล่าสุด" },
    { id: "this_year", label: "ปีนี้" },
  ];

  const handleSelect = (range: TimeRangeFilter) => {
    const params = new URLSearchParams(searchParams.toString());
    if (range === "all") {
      params.delete("range");
    } else {
      params.set("range", range);
    }
    const queryString = params.toString();
    router.push(`/admin/dashboard${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-[#e7e7e7] shadow-sm overflow-x-auto shrink-0">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => handleSelect(opt.id)}
          className={`px-3.5 py-1 rounded-full text-xs font-semibold tracking-[-0.16px] transition-all duration-200 active:scale-[0.95] shrink-0 ${
            currentRange === opt.id
              ? "bg-[#00754A] text-white shadow-sm"
              : "text-[rgba(0,0,0,0.7)] hover:bg-[#edebe9]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
