import { CategoryStat } from "../types";

interface CategoryChartProps {
  categories: CategoryStat[];
}

const colorPalette = [
  "#00754A",
  "#cba258",
  "#2563eb",
  "#dc2626",
  "#9333ea",
  "#0891b2",
  "#ea580c",
  "#64748b",
];

export function CategoryChart({ categories }: CategoryChartProps) {
  if (categories.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-[#e7e7e7] shadow-sm flex flex-col items-center justify-center min-h-[260px] text-xs text-[rgba(0,0,0,0.5)]">
        ไม่มีข้อมูลหมวดหมู่ปัญหาในช่วงเวลานี้
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#e7e7e7] shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#1E3932] tracking-tight">
              สัดส่วนหมวดหมู่ปัญหา
            </h3>
            <p className="text-xs text-[rgba(0,0,0,0.55)] mt-0.5">
              จัดอันดับประเภทปัญหาที่มีการแจ้งซ่อมเข้ามามากที่สุด
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#f2f0eb] text-[#1E3932]">
            {categories.length} หมวด
          </span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-gray-100 mb-5">
          {categories.map((cat, index) => (
            <div
              key={cat.category}
              style={{
                width: `${cat.percentage}%`,
                backgroundColor: colorPalette[index % colorPalette.length],
              }}
              title={`${cat.category}: ${cat.count} เคส (${cat.percentage}%)`}
              className="h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full"
            />
          ))}
        </div>

        {/* Categories List */}
        <div className="space-y-3">
          {categories.slice(0, 6).map((cat, index) => {
            const barColor = colorPalette[index % colorPalette.length];
            return (
              <div key={cat.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: barColor }}
                    />
                    <span className="font-semibold text-[#1E3932] truncate">
                      {cat.category}
                    </span>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="font-bold text-[#1E3932]">{cat.count}</span>
                    <span className="text-[rgba(0,0,0,0.45)]">เคส</span>
                    <span className="text-[rgba(0,0,0,0.55)] font-semibold">
                      ({cat.percentage}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-[#f2f0eb] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
