import { TicketStatus } from "../types";

interface StatusBadgeProps {
  status: TicketStatus;
}

const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
  new: {
    label: "งานใหม่ (New)",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  in_progress: {
    label: "กำลังทำ (In Progress)",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  pending: {
    label: "ติดปัญหา (Pending)",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  resolved: {
    label: "ปิดงานแล้ว (Resolved)",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
