import { Priority } from "../types";

interface PriorityBadgeProps {
  priority: Priority;
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  high: {
    label: "สูง (เร่งด่วน)",
    className: "bg-white text-[#7f0019] border-[#7f0019]",
  },
  medium: {
    label: "ปานกลาง",
    className: "bg-[#ebebec] text-[#1d1d1f] border-[#c4c4c6]",
  },
  low: {
    label: "ทั่วไป",
    className: "bg-[#ebebec] text-[#666666] border-[#e0e0e0]",
  },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority] || {
    label: priority,
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
