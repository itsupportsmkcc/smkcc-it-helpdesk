"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1E3932] text-white hover:bg-[#00754A] text-xs font-semibold tracking-[-0.16px] shadow-sm transition-all duration-200 active:scale-[0.95]"
    >
      <Printer className="w-3.5 h-3.5" />
      <span>พิมพ์คู่มือ / บันทึก PDF (1 หน้า A4)</span>
    </button>
  );
}
