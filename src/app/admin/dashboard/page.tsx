import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { isAdminAuthenticated, logoutAdmin } from "../actions";
import { getTickets } from "@/features/tickets/actions/ticket-actions";
import { TicketTable } from "@/features/tickets/components/ticket-table";
import { ExportCsvButton } from "@/features/tickets/components/export-csv-button";
import { getAdminSupabase } from "@/lib/supabase";
import { LogOut, Star, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

interface FeedbackStats {
  averageRating: number;
  totalFeedbacks: number;
}

async function getFeedbackStats(): Promise<FeedbackStats> {
  const supabase = getAdminSupabase();
  const { data, error } = await supabase.from("feedbacks").select("rating");

  if (error || !data || data.length === 0) {
    return { averageRating: 0, totalFeedbacks: 0 };
  }

  const sum = data.reduce((acc, curr) => acc + (curr.rating || 0), 0);
  const avg = Number((sum / data.length).toFixed(1));
  return { averageRating: avg, totalFeedbacks: data.length };
}

export default async function AdminDashboardPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }

  const ticketsRes = await getTickets();
  const tickets = ticketsRes.success ? ticketsRes.data : [];
  const feedbackStats = await getFeedbackStats();

  return (
    <main className="min-h-screen bg-[#f2f0eb]">
      {/* Top Navbar: Starbucks House Green (#1E3932) */}
      <header className="bg-[#1E3932] text-white sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_2px_2px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-sm ring-2 ring-white/20 bg-white shrink-0">
              <Image
                src="/logo.jpg"
                alt="SMKCC IT Support Logo"
                fill
                priority
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-[-0.16px] text-white">
                SMKCC IT Helpdesk Dashboard
              </h1>
              <p className="text-[11px] text-[#d4e9e2]">
                ผู้ดูแลระบบ: นายเอกพงศ์ • วิทยาลัยชุมชนสมุทรสาคร
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            {feedbackStats.totalFeedbacks > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-[#dfc49d]/40 text-[#faf6ee] rounded-full text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-[#cba258] text-[#cba258]" />
                <span>ความพึงพอใจ: {feedbackStats.averageRating} / 5</span>
                <span className="text-white/60 font-normal">
                  ({feedbackStats.totalFeedbacks})
                </span>
              </div>
            )}

            <form action={logoutAdmin}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/20 text-white hover:bg-white/10 text-xs font-semibold tracking-[-0.16px] transition-all duration-200 active:scale-[0.95]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>ออกจากระบบ</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Quick Report & Export Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#e7e7e7] shadow-[0_0_1px_rgba(0,0,0,0.14),0_1px_2px_rgba(0,0,0,0.12)]">
          <div>
            <h2 className="text-sm font-bold text-[#1E3932] tracking-[-0.16px]">
              แผงควบคุมและจัดการคำขอแจ้งซ่อมไอที
            </h2>
            <p className="text-xs text-[rgba(0,0,0,0.58)] mt-0.5">
              จัดการสถานะงาน ส่งการแจ้งเตือนกลับทาง LINE และส่งออกข้อมูลสรุป
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <ExportCsvButton />

            <Link
              href="/admin/reports"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00754A] hover:bg-[#006241] text-white text-xs font-semibold tracking-[-0.16px] transition-all duration-200 active:scale-[0.95] shadow-sm"
              title="ดูหน้ารายงานสรุปทางการสำหรับพิมพ์หรือบันทึก PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>พิมพ์รายงานสรุป (PDF)</span>
            </Link>
          </div>
        </div>

        {/* Tickets Management Table */}
        <TicketTable initialTickets={tickets} />
      </div>
    </main>
  );
}
