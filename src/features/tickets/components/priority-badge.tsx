import { Priority } from "../types";

interface PriorityBadgeProps {
  priority: Priority;
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  high: {
    label: "สูง (กระทบการสอน/เร่งด่วน)",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  medium: {
    label: "ปานกลาง",
    className: "bg-orange-100 text-orange-700 border-orange-200",
  },
  low: {
    label: "ทั่วไป / ต่ำ",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority] || {
    label: priority,
    className: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
