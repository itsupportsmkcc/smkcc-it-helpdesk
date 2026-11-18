"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[2px] bg-[#1d1d1f] hover:bg-[#3c3c43] text-white text-xs font-medium tracking-[-0.16px] transition-colors cursor-pointer"
    >
      <Printer className="w-3.5 h-3.5" />
      <span>พิมพ์รายงาน / บันทึก PDF</span>
    </button>
  );
}
