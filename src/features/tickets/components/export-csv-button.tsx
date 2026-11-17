"use client";

import { useState } from "react";
import { getReportData, ReportItem } from "../actions/report-actions";
import { Download, Loader2 } from "lucide-react";

const statusTextMap: Record<string, string> = {
  new: "งานใหม่ (New)",
  in_progress: "กำลังดำเนินการ (In Progress)",
  pending: "ติดปัญหา (Pending)",
  resolved: "ปิดงานแล้ว (Resolved)",
};

const priorityTextMap: Record<string, string> = {
  high: "สูง (เร่งด่วน)",
  medium: "ปานกลาง",
  low: "ทั่วไป / ต่ำ",
};

export function ExportCsvButton() {
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await getReportData();
      if (!res.success) {
        alert("ไม่สามารถส่งออกข้อมูลได้: " + res.error);
        setIsExporting(false);
        return;
      }

      const rows: ReportItem[] = res.data;

      // หัวตาราง CSV ภาษาไทย
      const headers = [
        "รหัส Ticket",
        "วันที่แจ้ง",
        "เวลาที่แจ้ง",
        "ชื่อ-นามสกุล ผู้แจ้ง",
        "กลุ่มผู้ใช้งาน",
        "เบอร์โทรศัพท์",
        "ประเภทปัญหา",
        "สถานที่/ห้อง",
        "ระดับความเร่งด่วน",
        "รายละเอียดปัญหา",
        "สถานะ",
        "ผู้รับผิดชอบ",
        "วันที่อัปเดตล่าสุด",
        "คะแนนความพึงพอใจ (1-5)",
        "ความคิดเห็นประเมิน",
      ];

      const csvRows = [headers.join(",")];

      for (const row of rows) {
        const dateObj = new Date(row.createdAt);
        const dateStr = dateObj.toLocaleDateString("th-TH");
        const timeStr = dateObj.toLocaleTimeString("th-TH");

        const updateDate = new Date(row.updatedAt).toLocaleString("th-TH");

        const userTypeLabel = row.userType === "student" ? "นักศึกษา" : "บุคลากร";
        const statusLabel = statusTextMap[row.status] || row.status;
        const priorityLabel = priorityTextMap[row.priority] || row.priority;

        const escapeCsv = (str: string | null | undefined) => {
          if (!str) return '""';
          const clean = str.replace(/"/g, '""').replace(/\n/g, " ");
          return `"${clean}"`;
        };

        const values = [
          escapeCsv(row.id),
          escapeCsv(dateStr),
          escapeCsv(timeStr),
          escapeCsv(row.fullName),
          escapeCsv(userTypeLabel),
          escapeCsv(row.phone),
          escapeCsv(row.issueType),
          escapeCsv(row.location),
          escapeCsv(priorityLabel),
          escapeCsv(row.description || "-"),
          escapeCsv(statusLabel),
          escapeCsv(row.assignee),
          escapeCsv(updateDate),
          escapeCsv(row.rating ? `${row.rating} ดาว` : "ยังไม่ประเมิน"),
          escapeCsv(row.comment || "-"),
        ];

        csvRows.push(values.join(","));
      }

      // UTF-8 BOM (\uFEFF) ป้องกันภาษาไทยเพี้ยนใน Microsoft Excel
      const csvContent = "\uFEFF" + csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      const nowStr = new Date().toISOString().slice(0, 10);
      link.setAttribute("href", url);
      link.setAttribute("download", `SMKCC_IT_Helpdesk_Report_${nowStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export CSV error:", e);
      alert("เกิดข้อผิดพลาดในการส่งออกไฟล์");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#d6dbde] text-[#1E3932] hover:bg-[#faf6ee] text-xs font-semibold tracking-[-0.16px] transition-all duration-200 active:scale-[0.95] disabled:opacity-50 shadow-sm"
      title="ดาวน์โหลดไฟล์ตารางสำหรับเปิดใน Excel"
    >
      {isExporting ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00754A]" />
      ) : (
        <Download className="w-3.5 h-3.5 text-[#00754A]" />
      )}
      <span>ส่งออก Excel / CSV</span>
    </button>
  );
}
