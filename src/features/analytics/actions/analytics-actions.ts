"use server";

import { getAdminSupabase } from "@/lib/supabase";
import { timeRangeFilterSchema, TimeRangeFilter } from "../schemas/analytics-schema";
import { AnalyticsActionResult, AnalyticsData, CategoryStat, LocationStat } from "../types";
import { TicketItem } from "@/features/tickets/types";

interface DbTicket {
  id: string;
  line_user_id: string;
  line_display_name?: string | null;
  full_name: string;
  phone: string;
  user_type: "student" | "staff";
  issue_type: string;
  location: string;
  priority: "low" | "medium" | "high";
  description: string | null;
  image_url: string | null;
  status: "new" | "in_progress" | "pending" | "resolved";
  assignee: string;
  created_at: string;
  updated_at: string;
  is_deleted?: boolean | null;
}

export async function getAnalyticsData(
  rangeInput: unknown = "all"
): Promise<AnalyticsActionResult> {
  const parsedRange = timeRangeFilterSchema.safeParse(rangeInput);
  const range: TimeRangeFilter = parsedRange.success ? parsedRange.data : "all";

  const supabase = getAdminSupabase();
  let query = supabase
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false });

  // กรองเฉพาะเคสที่ไม่ถูกลบ
  // Note: ใน DB บางแถวอาจเป็น null หรือ false
  const now = new Date();
  if (range === "this_month") {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    query = query.gte("created_at", startOfMonth);
  } else if (range === "last_30_days") {
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    query = query.gte("created_at", thirtyDaysAgo);
  } else if (range === "this_year") {
    const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();
    query = query.gte("created_at", startOfYear);
  }

  const { data: rawTickets, error: ticketError } = await query;
  if (ticketError || !rawTickets) {
    console.error("[getAnalyticsData error]", ticketError);
    return { success: false, error: ticketError?.message || "ไม่สามารถดึงข้อมูลสถิติได้" };
  }

  // คัดกรองเคสที่ไม่ถูกลบ (is_deleted === false หรือ null)
  const tickets = (rawTickets as DbTicket[]).filter((t) => !t.is_deleted);
  const totalTickets = tickets.length;

  // ดึง feedbacks
  const { data: rawFeedbacks } = await supabase.from("feedbacks").select("rating");
  const feedbacks = rawFeedbacks || [];
  const totalFeedbacks = feedbacks.length;
  const ratingSum = feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0);
  const averageRating = totalFeedbacks > 0 ? Number((ratingSum / totalFeedbacks).toFixed(1)) : 0;

  // คำนวณสถานะงาน
  const statusCounts = {
    new: 0,
    inProgress: 0,
    pending: 0,
    resolved: 0,
  };

  for (const t of tickets) {
    if (t.status === "new") statusCounts.new += 1;
    else if (t.status === "in_progress") statusCounts.inProgress += 1;
    else if (t.status === "pending") statusCounts.pending += 1;
    else if (t.status === "resolved") statusCounts.resolved += 1;
  }

  const activePendingCount = statusCounts.new + statusCounts.inProgress + statusCounts.pending;
  const resolvedRate = totalTickets > 0 ? Number(((statusCounts.resolved / totalTickets) * 100).toFixed(1)) : 0;

  // คำนวณหมวดหมู่ปัญหา
  const categoryMap = new Map<string, number>();
  for (const t of tickets) {
    const cat = t.issue_type || "อื่นๆ";
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
  }

  const categories: CategoryStat[] = Array.from(categoryMap.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: totalTickets > 0 ? Number(((count / totalTickets) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // คำนวณสถานที่/ห้องที่พบบ่อย (Top 5)
  const locationMap = new Map<string, number>();
  for (const t of tickets) {
    const loc = t.location || "ไม่ระบุสถานที่";
    locationMap.set(loc, (locationMap.get(loc) || 0) + 1);
  }

  const topLocations: LocationStat[] = Array.from(locationMap.entries())
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // คำนวณสัดส่วนผู้แจ้ง (บุคลากร vs นักศึกษา)
  let studentCount = 0;
  let staffCount = 0;
  for (const t of tickets) {
    if (t.user_type === "student") studentCount += 1;
    else staffCount += 1;
  }

  const studentPercentage = totalTickets > 0 ? Number(((studentCount / totalTickets) * 100).toFixed(1)) : 0;
  const staffPercentage = totalTickets > 0 ? Number(((staffCount / totalTickets) * 100).toFixed(1)) : 0;

  // 5 เคสล่าสุดที่ยังรอช่างดำเนินการ
  const pendingTickets = tickets
    .filter((t) => t.status === "new" || t.status === "in_progress" || t.status === "pending")
    .slice(0, 5)
    .map((t): TicketItem => ({
      id: t.id,
      lineUserId: t.line_user_id,
      lineDisplayName: t.line_display_name,
      fullName: t.full_name,
      phone: t.phone,
      userType: t.user_type,
      issueType: t.issue_type,
      location: t.location,
      priority: t.priority,
      description: t.description,
      imageUrl: t.image_url,
      status: t.status,
      assignee: t.assignee,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    }));

  const analyticsData: AnalyticsData = {
    kpis: {
      totalTickets,
      resolvedRate,
      averageRating,
      totalFeedbacks,
      activePendingCount,
    },
    categories,
    topLocations,
    userTypeRatio: {
      student: studentCount,
      staff: staffCount,
      studentPercentage,
      staffPercentage,
    },
    statusBreakdown: statusCounts,
    recentPendingTickets: pendingTickets,
  };

  return { success: true, data: analyticsData };
}
