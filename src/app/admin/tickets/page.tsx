import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "../actions";
import { getTickets } from "@/features/tickets/actions/ticket-actions";
import { TicketTable } from "@/features/tickets/components/ticket-table";
import { ExportCsvButton } from "@/features/tickets/components/export-csv-button";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { getAdminSupabase } from "@/lib/supabase";
import { FileText } from "lucide-react";

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

export default async function AdminTicketsPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }

  const ticketsRes = await getTickets();
  const tickets = ticketsRes.success ? ticketsRes.data : [];
  const feedbackStats = await getFeedbackStats();

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <AdminNavbar
        activeTab="tickets"
        averageRating={feedbackStats.averageRating}
        totalFeedbacks={feedbackStats.totalFeedbacks}
      />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Quick Report & Export Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-[2px] border border-[#e0e0e0]">
          <div>
            <h2 className="text-sm font-bold text-[#1d1d1f] tracking-tight">
              จัดการรายการคำขอแจ้งซ่อมไอที
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              จัดการสถานะงาน แชทส่งข้อความตรงเข้า LINE ผู้แจ้ง และกู้คืนเคสจากถังขยะ
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <ExportCsvButton />

            <Link
              href="/admin/reports"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[2px] bg-[#1d1d1f] hover:bg-[#3c3c43] text-white text-xs font-medium tracking-[-0.16px] transition-colors"
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
