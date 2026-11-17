import { TicketStatus } from "../types";

interface StatusBadgeProps {
  status: TicketStatus;
}

const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
  new: {
    label: "รับเรื่องแล้ว (New)",
    className: "bg-[#faf6ee] text-[#8c6b2d] border-[#dfc49d]",
  },
  in_progress: {
    label: "กำลังดำเนินการ (In Progress)",
    className: "bg-[#d4e9e2] text-[#006241] border-[#a3d2c1]",
  },
  pending: {
    label: "อยู่ระหว่างดำเนินการ (Pending)",
    className: "bg-[#fff7ed] text-[#c2410c] border-[#fed7aa]",
  },
  resolved: {
    label: "เสร็จสิ้น (Complete)",
    className: "bg-[#1E3932] text-white border-[#1E3932]",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold border tracking-[-0.16px] ${config.className}`}
    >
      {config.label}
    </span>
  );
}
