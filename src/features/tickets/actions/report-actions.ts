"use server";

import { getAdminSupabase } from "@/lib/supabase";
import { ActionResult } from "../types";

export interface ReportItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  lineDisplayName?: string | null;
  phone: string;
  userType: "student" | "staff";
  issueType: string;
  location: string;
  priority: "low" | "medium" | "high";
  description?: string | null;
  status: "new" | "in_progress" | "pending" | "resolved";
  assignee: string;
  rating?: number | null;
  comment?: string | null;
}

export async function getReportData(): Promise<ActionResult<ReportItem[]>> {
  const supabase = getAdminSupabase();

  // ดึง tickets ทั้งหมด
  const { data: tickets, error: ticketError } = await supabase
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false });

  if (ticketError || !tickets) {
    console.error("[getReportData error]", ticketError);
    return { success: false, error: ticketError?.message || "ไม่สามารถดึงข้อมูลรายงานได้" };
  }

  // ดึง feedbacks ทั้งหมด
  const { data: feedbacks } = await supabase.from("feedbacks").select("*");

  const feedbackMap = new Map<string, { rating: number; comment: string | null }>();
  if (feedbacks) {
    for (const fb of feedbacks) {
      feedbackMap.set(fb.ticket_id, {
        rating: fb.rating,
        comment: fb.comment,
      });
    }
  }

  const reports: ReportItem[] = tickets
    .filter((t) => !t.is_deleted)
    .map((t) => {
    const fb = feedbackMap.get(t.id);
    return {
      id: t.id,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
      fullName: t.full_name,
      lineDisplayName: t.line_display_name,
      phone: t.phone,
      userType: t.user_type,
      issueType: t.issue_type,
      location: t.location,
      priority: t.priority,
      description: t.description,
      status: t.status,
      assignee: t.assignee,
      rating: fb?.rating ?? null,
      comment: fb?.comment ?? null,
    };
  });

  return { success: true, data: reports };
}
