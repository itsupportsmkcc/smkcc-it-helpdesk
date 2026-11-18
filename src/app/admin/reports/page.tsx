import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { isAdminAuthenticated } from "../actions";
import { getReportData, ReportItem } from "@/features/tickets/actions/report-actions";
import { ArrowLeft, Star } from "lucide-react";
import { PrintButton } from "@/features/tickets/components/print-button";
import { ReportFilter } from "@/features/tickets/components/report-filter";
import { THAI_MONTHS } from "@/features/tickets/constants";
import { ExportCsvButton } from "@/features/tickets/components/export-csv-button";
import { AdminNavbar } from "@/components/admin/admin-navbar";

export const dynamic = "force-dynamic";

const statusTextMap: Record<string, string> = {
  new: "รับเรื่องแล้ว",
  in_progress: "กำลังดำเนินการ",
  pending: "อยู่ระหว่างดำเนินการ",
  resolved: "เสร็จสิ้น",
};

export default async function AdminReportPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }

  const { year = "all", month = "all" } = await searchParams;

  const res = await getReportData();
  const allReports: ReportItem[] = res.success ? res.data : [];

  // หาปีทั้งหมดที่มีในระบบ
  const yearsSet = new Set<number>();
  const currentCalendarYear = new Date().getFullYear();
  yearsSet.add(currentCalendarYear);
  for (const r of allReports) {
    const yr = new Date(r.createdAt).getFullYear();
    if (!isNaN(yr)) yearsSet.add(yr);
  }
  const availableYears = Array.from(yearsSet).sort((a, b) => b - a);

  // กรองตามปีและเดือน
  const reports = allReports.filter((r) => {
    const d = new Date(r.createdAt);
    if (year !== "all" && d.getFullYear() !== Number(year)) {
      return false;
    }
    if (month !== "all" && d.getMonth() + 1 !== Number(month)) {
      return false;
    }
    return true;
  });

  // ข้อความระบุช่วงเวลาของรายงาน
  let periodLabel = "สรุปภาพรวมสะสมทั้งหมด";
  const selectedMonthObj = THAI_MONTHS.find((m) => m.value === month);
  const monthName = selectedMonthObj && month !== "all" ? selectedMonthObj.label : "";
  const yearBe = year !== "all" ? Number(year) + 543 : "";

  if (year !== "all" && month !== "all") {
    periodLabel = `ประจำเดือน${monthName} พ.ศ. ${yearBe}`;
  } else if (year !== "all") {
    periodLabel = `ประจำปี พ.ศ. ${yearBe}`;
  } else if (month !== "all") {
    periodLabel = `ประจำเดือน${monthName} (ทุกปี)`;
  }

  // คำนวณสถิติ
  const total = reports.length;
  const resolved = reports.filter((r) => r.status === "resolved").length;
  const inProgress = reports.filter((r) => r.status === "in_progress").length;
  const pending = reports.filter((r) => r.status === "pending").length;
  const newCases = reports.filter((r) => r.status === "new").length;

  const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : "0";

  // คะแนนความพึงพอใจ
  const ratedReports = reports.filter((r) => r.rating !== null && r.rating !== undefined);
  const avgRating =
    ratedReports.length > 0
      ? (
          ratedReports.reduce((acc, curr) => acc + (curr.rating || 0), 0) /
          ratedReports.length
        ).toFixed(1)
      : "0";

  // สถิติแยกตามประเภทปัญหา
  const issueCounts: Record<string, number> = {};
  for (const r of reports) {
    issueCounts[r.issueType] = (issueCounts[r.issueType] || 0) + 1;
  }
  const issueStats = Object.entries(issueCounts).sort((a, b) => b[1] - a[1]);

  // สถิติแยกตามกลุ่มผู้ใช้
  const studentCount = reports.filter((r) => r.userType === "student").length;
  const staffCount = reports.filter((r) => r.userType === "staff").length;

  const todayThai = new Date().toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-[#fafafa] print:p-0 print:bg-white text-[#3c3c43] font-sarabun">
      <div className="print:hidden">
        <AdminNavbar
          activeTab="reports"
          averageRating={Number(avgRating)}
          totalFeedbacks={ratedReports.length}
        />
      </div>

      <div className="p-4 sm:p-8 print:p-0">
        {/* Top Action Bar & Filter (ซ่อนเมื่อพิมพ์) */}
        <div className="max-w-5xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <Link
            href="/admin/tickets"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[2px] bg-white border border-[#c4c4c6] text-xs font-medium text-[#1d1d1f] hover:bg-[#ebebec] transition-colors w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#666666]" />
            กลับหน้ารายการแจ้งซ่อม
          </Link>

        {/* ตัวเลือกกรองแยกตามเดือนและปี */}
        <ReportFilter
          availableYears={availableYears}
          currentYear={year}
          currentMonth={month}
        />

        <div className="flex items-center gap-2">
          <ExportCsvButton filteredItems={reports} labelSuffix={`${year}_${month}`} />
          <PrintButton />
        </div>
      </div>

      {/* Official Report Document: กระดาษรายงาน A4 สีขาว */}
      <div className="max-w-5xl mx-auto bg-white rounded-[2px] border border-[#e0e0e0] p-8 sm:p-12 print:border-none print:p-0 print:rounded-none">
        {/* Document Header */}
        <div className="border-b border-[#1d1d1f] pb-6 mb-8 text-center relative">
          <div className="relative w-20 h-20 mx-auto mb-3 rounded-[2px] overflow-hidden border border-[#e0e0e0] bg-white">
            <Image
              src="/logo.jpg"
              alt="SMKCC IT Support Logo"
              fill
              priority
              className="object-cover"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">
            วิทยาลัยชุมชนสมุทรสาคร
          </h1>
          <h2 className="text-base sm:text-lg font-medium text-[#3c3c43] mt-1">
            รายงานสรุปสถิติการให้บริการและแจ้งซ่อมงานเทคโนโลยีสารสนเทศ (IT Support)
          </h2>
          <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-[#ebebec] border border-[#e0e0e0] text-xs font-medium text-[#1d1d1f]">
            {periodLabel}
          </div>
          <p className="text-xs text-[#666666] mt-1.5 font-normal">
            ฝ่ายเทคโนโลยีสารสนเทศ • ข้อมูลรายงานออก ณ วันที่ {todayThai}
          </p>
        </div>

        {/* 1. Summary KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="p-4 rounded-[2px] bg-[#fafafa] border border-[#e0e0e0] text-center">
            <p className="text-xs font-medium text-[#666666] uppercase">คำขอในช่วงเวลา</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] mt-1">{total}</p>
            <p className="text-[11px] text-[#8f8f8f] mt-0.5">รายการ</p>
          </div>
          <div className="p-4 rounded-[2px] bg-[#ebebec] border border-[#e0e0e0] text-center">
            <p className="text-xs font-medium text-[#1d1d1f] uppercase">กำลังดำเนินการ</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] mt-1">{inProgress + newCases + pending}</p>
            <p className="text-[11px] text-[#666666] mt-0.5">รับเรื่อง {newCases} | ทำ {inProgress} | รอ {pending}</p>
          </div>
          <div className="p-4 rounded-[2px] bg-white border border-[#c4c4c6] text-center">
            <p className="text-xs font-medium text-[#009262] uppercase">เสร็จสิ้น (Complete)</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#009262] mt-1">{resolved}</p>
            <p className="text-[11px] text-[#666666] mt-0.5">สำเร็จ {resolutionRate}%</p>
          </div>
          <div className="p-4 rounded-[2px] bg-white border border-[#e0e0e0] text-center">
            <p className="text-xs font-medium text-[#666666] uppercase">คะแนนความพึงพอใจ</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Star className="w-5 h-5 fill-[#ffa826] text-[#ffa826]" />
              <p className="text-2xl sm:text-3xl font-bold text-[#1d1d1f]">{avgRating}</p>
              <span className="text-xs text-[#8f8f8f]">/5</span>
            </div>
            <p className="text-[11px] text-[#8f8f8f] mt-0.5">จาก {ratedReports.length} ผู้ประเมิน</p>
          </div>
        </div>

        {/* 2. Breakdown Tables */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* ปัญหาแยกตามประเภท */}
          <div className="border border-[#e0e0e0] rounded-[2px] p-4 bg-[#fafafa]">
            <h3 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider mb-3 pb-2 border-b border-[#e0e0e0]">
              จำแนกตามประเภทปัญหา / บริการ ({periodLabel})
            </h3>
            {issueStats.length === 0 ? (
              <p className="text-xs text-[#8f8f8f] py-3 text-center">ไม่มีข้อมูลในช่วงเวลานี้</p>
            ) : (
              <table className="w-full text-xs">
                <tbody>
                  {issueStats.map(([issue, count]) => {
                    const pct = total > 0 ? ((count / total) * 100).toFixed(0) : "0";
                    return (
                      <tr key={issue} className="border-b border-[#e0e0e0] last:border-none">
                        <td className="py-1.5 text-[#3c3c43]">{issue}</td>
                        <td className="py-1.5 text-right font-bold text-[#1d1d1f]">{count} เคส</td>
                        <td className="py-1.5 text-right text-[#8f8f8f] w-14 font-mono">({pct}%)</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* สัดส่วนกลุ่มผู้ใช้ */}
          <div className="border border-[#e0e0e0] rounded-[2px] p-4 bg-[#fafafa]">
            <h3 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider mb-3 pb-2 border-b border-[#e0e0e0]">
              จำแนกตามกลุ่มผู้รับบริการ ({periodLabel})
            </h3>
            <table className="w-full text-xs mb-4">
              <tbody>
                <tr className="border-b border-[#e0e0e0]">
                  <td className="py-2 text-[#3c3c43]">นักศึกษา (Students)</td>
                  <td className="py-2 text-right font-bold text-[#1d1d1f]">{studentCount} คน</td>
                  <td className="py-2 text-right text-[#8f8f8f] w-14 font-mono">
                    ({total > 0 ? ((studentCount / total) * 100).toFixed(0) : 0}%)
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-[#3c3c43]">บุคลากร / อาจารย์ (Staff)</td>
                  <td className="py-2 text-right font-bold text-[#1d1d1f]">{staffCount} คน</td>
                  <td className="py-2 text-right text-[#8f8f8f] w-14 font-mono">
                    ({total > 0 ? ((staffCount / total) * 100).toFixed(0) : 0}%)
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="p-3 bg-[#ebebec] rounded-[2px] border border-[#e0e0e0] text-[11px] text-[#3c3c43]">
              <span className="font-medium block mb-0.5">การให้บริการประจำช่วงเวลา:</span>
              มีอัตราการดำเนินการสำเร็จ ({resolutionRate}%) ผู้รับผิดชอบหลัก: นายเอกพงศ์ (เจ้าหน้าที่ไอที)
            </div>
          </div>
        </div>

        {/* 3. Detailed Tickets Log */}
        <div className="mb-10">
          <h3 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider mb-3">
            รายการบันทึกการให้บริการ ({periodLabel} : รวม {reports.length} รายการ)
          </h3>
          <div className="overflow-x-auto border border-[#e0e0e0] rounded-[2px]">
            <table className="w-full text-[11px] text-left">
              <thead className="bg-[#ebebec] text-[#1d1d1f] font-medium uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-2.5">ลำดับ</th>
                  <th className="p-2.5">วันที่</th>
                  <th className="p-2.5">ผู้แจ้ง</th>
                  <th className="p-2.5">เรื่องที่แจ้ง</th>
                  <th className="p-2.5">สถานที่</th>
                  <th className="p-2.5">สถานะ</th>
                  <th className="p-2.5 text-center">ความพึงพอใจ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e0e0]">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-[#8f8f8f]">
                      ไม่พบข้อมูลรายการแจ้งซ่อมในช่วงเวลาที่เลือก
                    </td>
                  </tr>
                ) : (
                  reports.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-[#fafafa]">
                      <td className="p-2.5 font-mono text-[#8f8f8f]">{idx + 1}</td>
                      <td className="p-2.5 font-mono">
                        {new Date(row.createdAt).toLocaleDateString("th-TH")}
                      </td>
                      <td className="p-2.5">
                        <span className="font-medium text-[#1d1d1f]">{row.fullName}</span>
                        <span className="text-[10px] text-[#8f8f8f] block">
                          ({row.userType === "student" ? "นักศึกษา" : "บุคลากร"})
                        </span>
                        {row.lineDisplayName && (
                          <span className="text-[10px] text-[#3c3c43] block font-medium">
                            LINE: {row.lineDisplayName}
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 font-medium text-[#1d1d1f]">{row.issueType}</td>
                      <td className="p-2.5 text-[#666666]">{row.location}</td>
                      <td className="p-2.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            row.status === "resolved"
                              ? "bg-[#1d1d1f] text-white"
                              : row.status === "pending"
                              ? "bg-white border border-[#7f0019] text-[#7f0019]"
                              : row.status === "in_progress"
                              ? "bg-[#ebebec] border border-[#c4c4c6] text-[#1d1d1f]"
                              : "bg-[#ebebec] border border-[#e0e0e0] text-[#666666]"
                          }`}
                        >
                          {statusTextMap[row.status] || row.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        {row.rating ? (
                          <span className="font-bold text-[#ffa826]">
                            ★ {row.rating}
                          </span>
                        ) : (
                          <span className="text-[#c4c4c6]">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Signature Section (ส่วนลงนามทางการ) */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[#e0e0e0] text-center text-xs">
          <div>
            <p className="text-[#666666] mb-14">ผู้จัดทำรายงาน</p>
            <p className="font-bold text-[#1d1d1f]">
              ( นายเอกพงศ์ ................................ )
            </p>
            <p className="text-[11px] text-[#8f8f8f] mt-1">
              เจ้าหน้าที่เทคโนโลยีสารสนเทศ
            </p>
          </div>
          <div>
            <p className="text-[#666666] mb-14">ผู้บริหารรับทราบ / อนุมัติ</p>
            <p className="font-bold text-[#1d1d1f]">
              ( .............................................................. )
            </p>
            <p className="text-[11px] text-[#8f8f8f] mt-1">
              ผู้อำนวยการวิทยาลัยชุมชนสมุทรสาคร
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
);
}
