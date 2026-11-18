import { CategoryStat } from "../types";

interface CategoryChartProps {
  categories: CategoryStat[];
}

const colorPalette = [
  "#1d1d1f",
  "#7f0019",
  "#3c3c43",
  "#009262",
  "#666666",
  "#e48900",
  "#8f8f8f",
  "#c4c4c6",
];

export function CategoryChart({ categories }: CategoryChartProps) {
  if (categories.length === 0) {
    return (
      <div className="bg-white p-6 rounded-[2px] border border-[#e0e0e0] flex flex-col items-center justify-center min-h-[260px] text-xs text-[#8f8f8f]">
        ไม่มีข้อมูลหมวดหมู่ปัญหาในช่วงเวลานี้
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-[2px] border border-[#e0e0e0] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#1d1d1f] tracking-tight">
              สัดส่วนหมวดหมู่ปัญหา
            </h3>
            <p className="text-xs text-[#666666] mt-0.5">
              จัดอันดับประเภทปัญหาที่มีการแจ้งซ่อมเข้ามามากที่สุด
            </p>
          </div>
          <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-[#ebebec] text-[#3c3c43] border border-[#e0e0e0]">
            {categories.length} หมวด
          </span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="w-full h-3 rounded-[2px] overflow-hidden flex bg-[#ebebec] mb-5">
          {categories.map((cat, index) => (
            <div
              key={cat.category}
              style={{
                width: `${cat.percentage}%`,
                backgroundColor: colorPalette[index % colorPalette.length],
              }}
              title={`${cat.category}: ${cat.count} เคส (${cat.percentage}%)`}
              className="h-full transition-all duration-300"
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
                      className="w-2 h-2 rounded-[2px] shrink-0"
                      style={{ backgroundColor: barColor }}
                    />
                    <span className="font-medium text-[#1d1d1f] truncate">
                      {cat.category}
                    </span>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="font-bold text-[#1d1d1f]">{cat.count}</span>
                    <span className="text-[#8f8f8f]">เคส</span>
                    <span className="text-[#666666] font-medium">
                      ({cat.percentage}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-[#ebebec] h-1.5 rounded-[2px] overflow-hidden">
                  <div
                    className="h-full rounded-[2px] transition-all duration-300"
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
