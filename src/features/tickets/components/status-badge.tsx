import { TicketStatus } from "../types";

interface StatusBadgeProps {
  status: TicketStatus;
}

const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
  new: {
    label: "รับเรื่องแล้ว (New)",
    className: "bg-[#ebebec] text-[#3c3c43] border-[#e0e0e0]",
  },
  in_progress: {
    label: "กำลังดำเนินการ (In Progress)",
    className: "bg-[#ebebec] text-[#1d1d1f] border-[#c4c4c6]",
  },
  pending: {
    label: "อยู่ระหว่างดำเนินการ (Pending)",
    className: "bg-white text-[#7f0019] border-[#7f0019]",
  },
  resolved: {
    label: "เสร็จสิ้น (Complete)",
    className: "bg-[#1d1d1f] text-white border-[#1d1d1f]",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-[#ebebec] text-[#666666] border-[#e0e0e0]",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-[-0.16px] ${config.className}`}
    >
      {config.label}
    </span>
  );
}
