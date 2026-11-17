import { TicketStatus } from "../types";

interface StatusBadgeProps {
  status: TicketStatus;
}

const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
  new: {
    label: "งานใหม่ (New)",
    className: "bg-[#d4e9e2] text-[#006241] border-[#a3d2c1]",
  },
  in_progress: {
    label: "กำลังทำ (In Progress)",
    className: "bg-[#faf6ee] text-[#8c6b2d] border-[#dfc49d]",
  },
  pending: {
    label: "ติดปัญหา (Pending)",
    className: "bg-[#edebe9] text-[rgba(0,0,0,0.87)] border-[#d6dbde]",
  },
  resolved: {
    label: "ปิดงานแล้ว (Resolved)",
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
