import { Users, GraduationCap, Briefcase } from "lucide-react";

interface UserTypeChartProps {
  userTypeRatio: {
    student: number;
    staff: number;
    studentPercentage: number;
    staffPercentage: number;
  };
  statusBreakdown: {
    new: number;
    inProgress: number;
    pending: number;
    resolved: number;
  };
  totalTickets: number;
}

export function UserTypeChart({
  userTypeRatio,
  statusBreakdown,
  totalTickets,
}: UserTypeChartProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. User Type Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-[#e7e7e7] shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#1E3932] tracking-tight">
                สัดส่วนผู้แจ้งซ่อม
              </h3>
              <p className="text-xs text-[rgba(0,0,0,0.55)] mt-0.5">
                เปรียบเทียบระหว่างอาจารย์/บุคลากร และนักศึกษา
              </p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-[#faf6ee] text-[#8c6b2d] flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Ratio Visual Bar */}
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-gray-100 mb-6">
            <div
              style={{ width: `${userTypeRatio.staffPercentage}%` }}
              title={`บุคลากร: ${userTypeRatio.staff} (${userTypeRatio.staffPercentage}%)`}
              className="bg-[#1E3932] h-full transition-all duration-500 first:rounded-l-full"
            />
            <div
              style={{ width: `${userTypeRatio.studentPercentage}%` }}
              title={`นักศึกษา: ${userTypeRatio.student} (${userTypeRatio.studentPercentage}%)`}
              className="bg-[#cba258] h-full transition-all duration-500 last:rounded-r-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#faf9f7] p-3.5 rounded-xl border border-[#e7e7e7]">
              <div className="flex items-center gap-1.5 text-xs text-[#1E3932] font-semibold mb-1">
                <Briefcase className="w-3.5 h-3.5 text-[#00754A]" />
                <span>อาจารย์ / บุคลากร</span>
              </div>
              <p className="text-2xl font-black text-[#1E3932]">
                {userTypeRatio.staff}
                <span className="text-xs font-semibold text-[rgba(0,0,0,0.45)] ml-1">
                  คน ({userTypeRatio.staffPercentage}%)
                </span>
              </p>
            </div>

            <div className="bg-[#faf6ee] p-3.5 rounded-xl border border-[#dfc49d]">
              <div className="flex items-center gap-1.5 text-xs text-[#8c6b2d] font-semibold mb-1">
                <GraduationCap className="w-3.5 h-3.5 text-[#cba258]" />
                <span>นักศึกษา</span>
              </div>
              <p className="text-2xl font-black text-[#8c6b2d]">
                {userTypeRatio.student}
                <span className="text-xs font-semibold text-[#8c6b2d]/70 ml-1">
                  คน ({userTypeRatio.studentPercentage}%)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Status Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-[#e7e7e7] shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#1E3932] tracking-tight">
                สถานะงานปัจจุบัน
              </h3>
              <p className="text-xs text-[rgba(0,0,0,0.55)] mt-0.5">
                จำแนกตามขั้นตอนการดำเนินงานทั้งหมด
              </p>
            </div>
            <span className="text-xs font-bold text-[#1E3932]">
              รวม {totalTickets} เคส
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#fefce8] p-3 rounded-xl border border-[#fef08a]">
              <span className="text-[11px] font-bold text-[#854d0e] block">
                รับเรื่องแล้ว (New)
              </span>
              <span className="text-xl font-black text-[#854d0e] mt-1 block">
                {statusBreakdown.new}
              </span>
            </div>

            <div className="bg-[#eff6ff] p-3 rounded-xl border border-[#bfdbfe]">
              <span className="text-[11px] font-bold text-[#1e40af] block">
                กำลังดำเนินการ (In Progress)
              </span>
              <span className="text-xl font-black text-[#1e40af] mt-1 block">
                {statusBreakdown.inProgress}
              </span>
            </div>

            <div className="bg-[#fff7ed] p-3 rounded-xl border border-[#fed7aa]">
              <span className="text-[11px] font-bold text-[#c2410c] block">
                อยู่ระหว่างดำเนินการ (Pending)
              </span>
              <span className="text-xl font-black text-[#c2410c] mt-1 block">
                {statusBreakdown.pending}
              </span>
            </div>

            <div className="bg-[#1E3932] text-white p-3 rounded-xl">
              <span className="text-[11px] font-bold text-[#d4e9e2] block">
                เสร็จสิ้น (Complete)
              </span>
              <span className="text-xl font-black text-white mt-1 block">
                {statusBreakdown.resolved}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
