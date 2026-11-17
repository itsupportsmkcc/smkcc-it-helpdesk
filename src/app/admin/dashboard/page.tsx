import { redirect } from "next/navigation";
import { isAdminAuthenticated, logoutAdmin } from "../actions";
import { getTickets } from "@/features/tickets/actions/ticket-actions";
import { TicketTable } from "@/features/tickets/components/ticket-table";
import { getAdminSupabase } from "@/lib/supabase";
import { ShieldCheck, LogOut, Star, LifeBuoy } from "lucide-react";

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
    <main className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800">
                SMKCC IT Helpdesk Dashboard
              </h1>
              <p className="text-[11px] text-slate-500">
                ผู้ดูแลระบบ: นายเอกพงศ์ (วิทยาลัยชุมชนสมุทรสาคร)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {feedbackStats.totalFeedbacks > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>ความพึงพอใจ: {feedbackStats.averageRating} / 5</span>
                <span className="text-slate-400 font-normal">
                  ({feedbackStats.totalFeedbacks} รีวิว)
                </span>
              </div>
            )}

            <form action={logoutAdmin}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>ออกจากระบบ</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <TicketTable initialTickets={tickets} />
      </div>
    </main>
  );
}
