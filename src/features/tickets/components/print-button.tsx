"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#00754A] hover:bg-[#006241] text-white text-xs font-semibold tracking-[-0.16px] transition-all duration-200 active:scale-[0.95] shadow-sm cursor-pointer"
    >
      <Printer className="w-4 h-4" />
      <span>พิมพ์รายงาน / บันทึก PDF</span>
    </button>
  );
}
