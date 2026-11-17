import { Priority } from "../types";

interface PriorityBadgeProps {
  priority: Priority;
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  high: {
    label: "🔴 สูง (กระทบการสอน/เร่งด่วน)",
    className: "bg-red-50 text-[#c82014] border-red-200",
  },
  medium: {
    label: "🟠 ปานกลาง",
    className: "bg-[#d4e9e2] text-[#00754A] border-[#a3d2c1]",
  },
  low: {
    label: "🟢 ทั่วไป / ต่ำ",
    className: "bg-[#edebe9] text-[rgba(0,0,0,0.7)] border-[#d6dbde]",
  },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority] || {
    label: priority,
    className: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-[-0.16px] ${config.className}`}
    >
      {config.label}
    </span>
  );
}
