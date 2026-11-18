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
      <div className="bg-white p-6 rounded-[2px] border border-[#e0e0e0] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#1d1d1f] tracking-tight">
                สัดส่วนผู้แจ้งซ่อม
              </h3>
              <p className="text-xs text-[#666666] mt-0.5">
                เปรียบเทียบระหว่างอาจารย์/บุคลากร และนักศึกษา
              </p>
            </div>
            <div className="w-7 h-7 rounded-[2px] bg-[#ebebec] text-[#3c3c43] flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Ratio Visual Bar */}
          <div className="w-full h-2.5 rounded-[2px] overflow-hidden flex bg-[#ebebec] mb-6">
            <div
              style={{ width: `${userTypeRatio.staffPercentage}%` }}
              title={`บุคลากร: ${userTypeRatio.staff} (${userTypeRatio.staffPercentage}%)`}
              className="bg-[#1d1d1f] h-full transition-all duration-300"
            />
            <div
              style={{ width: `${userTypeRatio.studentPercentage}%` }}
              title={`นักศึกษา: ${userTypeRatio.student} (${userTypeRatio.studentPercentage}%)`}
              className="bg-[#8f8f8f] h-full transition-all duration-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#ebebec] p-3.5 rounded-[2px] border border-[#e0e0e0]">
              <div className="flex items-center gap-1.5 text-xs text-[#1d1d1f] font-medium mb-1">
                <Briefcase className="w-3.5 h-3.5 text-[#3c3c43]" />
                <span>อาจารย์ / บุคลากร</span>
              </div>
              <p className="text-2xl font-bold text-[#1d1d1f]">
                {userTypeRatio.staff}
                <span className="text-xs font-normal text-[#666666] ml-1">
                  คน ({userTypeRatio.staffPercentage}%)
                </span>
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-[2px] border border-[#c4c4c6]">
              <div className="flex items-center gap-1.5 text-xs text-[#3c3c43] font-medium mb-1">
                <GraduationCap className="w-3.5 h-3.5 text-[#666666]" />
                <span>นักศึกษา</span>
              </div>
              <p className="text-2xl font-bold text-[#3c3c43]">
                {userTypeRatio.student}
                <span className="text-xs font-normal text-[#8f8f8f] ml-1">
                  คน ({userTypeRatio.studentPercentage}%)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Status Breakdown */}
      <div className="bg-white p-6 rounded-[2px] border border-[#e0e0e0] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#1d1d1f] tracking-tight">
                สถานะงานปัจจุบัน
              </h3>
              <p className="text-xs text-[#666666] mt-0.5">
                จำแนกตามขั้นตอนการดำเนินงานทั้งหมด
              </p>
            </div>
            <span className="text-xs font-medium text-[#666666]">
              รวม {totalTickets} เคส
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#ebebec] p-3 rounded-[2px] border border-[#e0e0e0]">
              <span className="text-[11px] font-medium text-[#666666] block">
                รับเรื่องแล้ว (New)
              </span>
              <span className="text-xl font-bold text-[#1d1d1f] mt-1 block">
                {statusBreakdown.new}
              </span>
            </div>

            <div className="bg-[#ebebec] p-3 rounded-[2px] border border-[#e0e0e0]">
              <span className="text-[11px] font-medium text-[#666666] block">
                กำลังดำเนินการ (In Progress)
              </span>
              <span className="text-xl font-bold text-[#1d1d1f] mt-1 block">
                {statusBreakdown.inProgress}
              </span>
            </div>

            <div className="bg-white p-3 rounded-[2px] border border-[#c4c4c6]">
              <span className="text-[11px] font-medium text-[#7f0019] block">
                อยู่ระหว่างดำเนินการ (Pending)
              </span>
              <span className="text-xl font-bold text-[#7f0019] mt-1 block">
                {statusBreakdown.pending}
              </span>
            </div>

            <div className="bg-[#1d1d1f] text-white p-3 rounded-[2px] border border-[#1d1d1f]">
              <span className="text-[11px] font-medium text-[#c4c4c6] block">
                เสร็จสิ้น (Complete)
              </span>
              <span className="text-xl font-bold text-white mt-1 block">
                {statusBreakdown.resolved}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
