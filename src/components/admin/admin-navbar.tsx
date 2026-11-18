import Image from "next/image";
import Link from "next/link";
import { logoutAdmin } from "@/app/admin/actions";
import { LogOut, Star } from "lucide-react";

interface AdminNavbarProps {
  activeTab: "dashboard" | "tickets" | "reports";
  averageRating?: number;
  totalFeedbacks?: number;
}

export function AdminNavbar({
  activeTab,
  averageRating,
  totalFeedbacks = 0,
}: AdminNavbarProps) {
  const navItems = [
    { id: "dashboard", label: "ภาพรวม", href: "/admin/dashboard" },
    { id: "tickets", label: "รายการแจ้งซ่อม", href: "/admin/tickets" },
    { id: "reports", label: "ออกรายงาน", href: "/admin/reports" },
  ];

  return (
    <header className="bg-[#1E3932] text-white sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_2px_2px_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-9 h-9 rounded-full overflow-hidden shadow-sm ring-2 ring-white/20 bg-white shrink-0">
            <Image
              src="/logo.jpg"
              alt="SMKCC IT Support Logo"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-white block">
              SMKCC IT Helpdesk
            </span>
            <span className="text-[11px] text-[#d4e9e2] hidden sm:block">
              งานเทคโนโลยีสารสนเทศ วิทยาลัยชุมชนสมุทรสาคร
            </span>
          </div>
        </div>

        {/* Navigation Tabs: ข้อความล้วน สะอาดตา ไม่มีอิโมจิ */}
        <nav className="flex items-center bg-black/20 p-1 rounded-full border border-white/10 shrink-0">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-[-0.16px] transition-all duration-200 ${
                  isActive
                    ? "bg-white text-[#1E3932] shadow-sm font-bold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Info & Logout */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {totalFeedbacks > 0 && averageRating !== undefined && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-[#dfc49d]/40 text-[#faf6ee] rounded-full text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-[#cba258] text-[#cba258]" />
              <span>ความพึงพอใจ: {averageRating} / 5</span>
              <span className="text-white/60 font-normal">({totalFeedbacks})</span>
            </div>
          )}

          <form action={logoutAdmin}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/20 text-white hover:bg-white/10 text-xs font-semibold tracking-[-0.16px] transition-all duration-200 active:scale-[0.95]"
              title="ออกจากระบบ"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
