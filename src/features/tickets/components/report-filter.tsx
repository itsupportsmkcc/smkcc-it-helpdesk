"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { THAI_MONTHS } from "../constants";

interface ReportFilterProps {
  availableYears: number[];
  currentYear: string;
  currentMonth: string;
}

export function ReportFilter({
  availableYears,
  currentYear,
  currentMonth,
}: ReportFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleYearChange = (year: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", year);
    router.push(`/admin/reports?${params.toString()}`);
  };

  const handleMonthChange = (month: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", month);
    router.push(`/admin/reports?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap bg-white px-4 py-2 rounded-full border border-[#d6dbde] shadow-sm text-xs">
      <div className="flex items-center gap-1.5 text-[#1E3932] font-semibold">
        <Filter className="w-3.5 h-3.5 text-[#00754A]" />
        <span>เลือกช่วงเวลา:</span>
      </div>

      {/* เลือกปี */}
      <select
        value={currentYear}
        onChange={(e) => handleYearChange(e.target.value)}
        className="px-2.5 py-1 rounded-lg border border-[#d6dbde] bg-[#faf9f7] text-[#1E3932] font-semibold focus:outline-none focus:ring-1 focus:ring-[#00754A]"
      >
        <option value="all">ทุกปี (ทั้งหมด)</option>
        {availableYears.map((yr) => (
          <option key={yr} value={yr.toString()}>
            ปี พ.ศ. {yr + 543} ({yr})
          </option>
        ))}
      </select>

      {/* เลือกเดือน */}
      <select
        value={currentMonth}
        onChange={(e) => handleMonthChange(e.target.value)}
        className="px-2.5 py-1 rounded-lg border border-[#d6dbde] bg-[#faf9f7] text-[#1E3932] font-semibold focus:outline-none focus:ring-1 focus:ring-[#00754A]"
      >
        {THAI_MONTHS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
  );
}
