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
    <header className="bg-white text-[#3c3c43] sticky top-0 z-30 border-b border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-9 h-9 rounded-[2px] overflow-hidden border border-[#e0e0e0] bg-white shrink-0">
            <Image
              src="/logo.jpg"
              alt="SMKCC IT Support Logo"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-[#1d1d1f]">
                SMKCC IT Helpdesk
              </span>
              <span className="bg-[#7f0019] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] tracking-wider uppercase">
                ADMIN
              </span>
            </div>
            <span className="text-[11px] text-[#666666] hidden sm:block">
              งานเทคโนโลยีสารสนเทศ วิทยาลัยชุมชนสมุทรสาคร
            </span>
          </div>
        </div>

        {/* Navigation Tabs: MUJI 9999px pill tabs */}
        <nav className="flex items-center bg-[#ebebec] p-1 rounded-full border border-[#e0e0e0] shrink-0">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-[-0.16px] transition-all duration-150 ${
                  isActive
                    ? "bg-[#1d1d1f] text-white font-bold"
                    : "text-[#666666] hover:text-[#1d1d1f] hover:bg-white/50"
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
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-[#ebebec] border border-[#e0e0e0] text-[#3c3c43] rounded-full text-xs font-medium">
              <Star className="w-3.5 h-3.5 fill-[#e48900] text-[#e48900]" />
              <span>ความพึงพอใจ: {averageRating} / 5</span>
              <span className="text-[#8f8f8f] font-normal">({totalFeedbacks})</span>
            </div>
          )}

          <form action={logoutAdmin}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] border border-[#c4c4c6] text-[#3c3c43] bg-white hover:bg-[#ebebec] text-xs font-medium tracking-[-0.16px] transition-colors duration-150"
              title="ออกจากระบบ"
            >
              <LogOut className="w-3.5 h-3.5 text-[#666666]" />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
