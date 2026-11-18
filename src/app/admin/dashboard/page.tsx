import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "../actions";
import { getAnalyticsData } from "@/features/analytics/actions/analytics-actions";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { KpiCards } from "@/features/analytics/components/kpi-cards";
import { CategoryChart } from "@/features/analytics/components/category-chart";
import { LocationChart } from "@/features/analytics/components/location-chart";
import { UserTypeChart } from "@/features/analytics/components/user-type-chart";
import { RecentPendingCard } from "@/features/analytics/components/recent-pending-card";
import { TimeFilter } from "@/features/analytics/components/time-filter";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: Promise<{ range?: string }>;
}

export default async function AdminDashboardPage({
  searchParams,
}: DashboardPageProps) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }

  const resolvedSearchParams = await searchParams;
  const range = resolvedSearchParams?.range || "all";

  const result = await getAnalyticsData(range);
  if (!result.success) {
    return (
      <main className="min-h-screen bg-white p-6 text-center text-[#7f0019]">
        เกิดข้อผิดพลาดในการโหลดข้อมูลสถิติ: {result.error}
      </main>
    );
  }

  const { data } = result;

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <AdminNavbar
        activeTab="dashboard"
        averageRating={data.kpis.averageRating}
        totalFeedbacks={data.kpis.totalFeedbacks}
      />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Page Header & Time Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-[2px] border border-[#e0e0e0]">
          <div>
            <h1 className="text-base font-bold text-[#1d1d1f] tracking-tight">
              ภาพรวมสถิติและประสิทธิภาพการให้บริการไอที
            </h1>
            <p className="text-xs text-[#666666] mt-0.5">
              วิเคราะห์ตัวชี้วัดสำคัญ หมวดหมู่ปัญหา และความพึงพอใจของผู้ใช้งาน
            </p>
          </div>

          <TimeFilter />
        </div>

        {/* 1. KPI Cards */}
        <KpiCards
          totalTickets={data.kpis.totalTickets}
          resolvedRate={data.kpis.resolvedRate}
          averageRating={data.kpis.averageRating}
          totalFeedbacks={data.kpis.totalFeedbacks}
          activePendingCount={data.kpis.activePendingCount}
        />

        {/* 2. Charts Grid (Category & Location) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CategoryChart categories={data.categories} />
          <LocationChart
            locations={data.topLocations}
            totalTickets={data.kpis.totalTickets}
          />
        </div>

        {/* 3. User Type Ratio & Status Breakdown */}
        <UserTypeChart
          userTypeRatio={data.userTypeRatio}
          statusBreakdown={data.statusBreakdown}
          totalTickets={data.kpis.totalTickets}
        />

        {/* 4. Recent Pending Tickets */}
        <RecentPendingCard tickets={data.recentPendingTickets} />
      </div>
    </main>
  );
}
