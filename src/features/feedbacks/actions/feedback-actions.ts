"use server";

import { getAdminSupabase } from "@/lib/supabase";
import { createFeedbackSchema } from "../schemas/feedback-schema";
import { FeedbackItem } from "../types";
import { ActionResult } from "@/features/tickets/types";

interface DbFeedbackRow {
  id: string;
  ticket_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export async function createFeedback(
  rawInput: unknown
): Promise<ActionResult<FeedbackItem>> {
  const parsed = createFeedbackSchema.safeParse(rawInput);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง";
    return { success: false, error: errorMsg };
  }

  const { ticketId, rating, comment } = parsed.data;
  const supabase = getAdminSupabase();

  // ตรวจสอบว่ามีการประเมินเคสนี้ไปแล้วหรือไม่
  const { data: existing } = await supabase
    .from("feedbacks")
    .select("id")
    .eq("ticket_id", ticketId)
    .maybeSingle();

  if (existing) {
    return { success: false, error: "เคสนี้ได้รับการประเมินความพึงพอใจไปแล้ว ขอบคุณครับ" };
  }

  const { data, error } = await supabase
    .from("feedbacks")
    .insert({
      ticket_id: ticketId,
      rating,
      comment: comment || null,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("[createFeedback error]", error);
    return { success: false, error: error?.message || "ไม่สามารถบันทึกผลการประเมินได้" };
  }

  const row = data as DbFeedbackRow;
  return {
    success: true,
    data: {
      id: row.id,
      ticketId: row.ticket_id,
      rating: row.rating,
      comment: row.comment,
      createdAt: row.created_at,
    },
  };
}
