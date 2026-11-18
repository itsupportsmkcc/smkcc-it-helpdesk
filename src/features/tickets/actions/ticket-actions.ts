"use server";

import { getAdminSupabase } from "@/lib/supabase";
import {
  createTicketSchema,
  CreateTicketInput,
  updateTicketStatusSchema,
  UpdateTicketStatusInput,
  ticketIdSchema,
  sendDirectMessageSchema,
} from "../schemas/ticket-schema";
import { ActionResult, TicketItem } from "../types";
import {
  sendLineStatusNotification,
  sendLineAdminNewTicketAlert,
  sendLineDirectAdminMessage,
} from "@/features/notifications/services/line-notify";

interface DbTicketRow {
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
  deleted_at?: string | null;
}

function mapRowToTicketItem(row: DbTicketRow): TicketItem {
  return {
    id: row.id,
    lineUserId: row.line_user_id,
    lineDisplayName: row.line_display_name,
    fullName: row.full_name,
    phone: row.phone,
    userType: row.user_type,
    issueType: row.issue_type,
    location: row.location,
    priority: row.priority,
    description: row.description,
    imageUrl: row.image_url,
    status: row.status,
    assignee: row.assignee,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isDeleted: Boolean(row.is_deleted),
    deletedAt: row.deleted_at ?? null,
  };
}

export async function createTicket(
  rawInput: unknown
): Promise<ActionResult<TicketItem>> {
  const parsed = createTicketSchema.safeParse(rawInput);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง";
    return { success: false, error: errorMsg };
  }

  const {
    lineUserId,
    lineDisplayName,
    fullName,
    phone,
    userType,
    issueType,
    location,
    priority,
    description,
    imageUrl,
  } = parsed.data;

  const supabase = getAdminSupabase();

  const { data, error } = await supabase
    .from("tickets")
    .insert({
      line_user_id: lineUserId,
      line_display_name: lineDisplayName || null,
      full_name: fullName,
      phone,
      user_type: userType,
      issue_type: issueType,
      location,
      priority,
      description: description || null,
      image_url: imageUrl || null,
      status: "new",
      assignee: "นายเอกพงศ์ (IT Admin)",
    })
    .select()
    .single();

  if (error || !data) {
    console.error("[createTicket error]", error);
    return { success: false, error: error?.message || "ไม่สามารถบันทึกข้อมูลได้" };
  }

  const item = mapRowToTicketItem(data as DbTicketRow);

  // แจ้งเตือนผู้ใช้ครั้งแรกว่าได้รับเรื่องแล้ว
  await sendLineStatusNotification({
    lineUserId: item.lineUserId,
    ticketId: item.id,
    issueType: item.issueType,
    status: "new",
  });

  // แจ้งเตือนไปยัง LINE ส่วนตัวของแอดมิน (นายเอกพงศ์)
  await sendLineAdminNewTicketAlert({
    ticketId: item.id,
    fullName: item.fullName,
    userType: item.userType,
    phone: item.phone,
    issueType: item.issueType,
    location: item.location,
    priority: item.priority,
    description: item.description ?? undefined,
  });

  return { success: true, data: item };
}

export async function updateTicketStatus(
  rawInput: unknown
): Promise<ActionResult<TicketItem>> {
  const parsed = updateTicketStatusSchema.safeParse(rawInput);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง";
    return { success: false, error: errorMsg };
  }

  const { ticketId, status, adminNote } = parsed.data;
  const supabase = getAdminSupabase();

  const { data, error } = await supabase
    .from("tickets")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", ticketId)
    .select()
    .single();

  if (error || !data) {
    console.error("[updateTicketStatus error]", error);
    return { success: false, error: error?.message || "ไม่สามารถอัปเดตสถานะได้" };
  }

  const item = mapRowToTicketItem(data as DbTicketRow);

  // ยิง LINE Push Notification หาผู้แจ้ง
  await sendLineStatusNotification({
    lineUserId: item.lineUserId,
    ticketId: item.id,
    issueType: item.issueType,
    status: item.status,
    adminNote,
  });

  return { success: true, data: item };
}

export async function softDeleteTicket(
  rawInput: unknown
): Promise<ActionResult<TicketItem>> {
  const parsed = ticketIdSchema.safeParse(rawInput);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง";
    return { success: false, error: errorMsg };
  }

  const { ticketId } = parsed.data;
  const supabase = getAdminSupabase();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("tickets")
    .update({
      is_deleted: true,
      deleted_at: now,
      updated_at: now,
    })
    .eq("id", ticketId)
    .select()
    .single();

  if (error || !data) {
    console.error("[softDeleteTicket error]", error);
    return { success: false, error: error?.message || "ไม่สามารถย้ายเคสลงถังขยะได้" };
  }

  const item = mapRowToTicketItem(data as DbTicketRow);
  return { success: true, data: item };
}

export async function restoreTicket(
  rawInput: unknown
): Promise<ActionResult<TicketItem>> {
  const parsed = ticketIdSchema.safeParse(rawInput);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง";
    return { success: false, error: errorMsg };
  }

  const { ticketId } = parsed.data;
  const supabase = getAdminSupabase();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("tickets")
    .update({
      is_deleted: false,
      deleted_at: null,
      updated_at: now,
    })
    .eq("id", ticketId)
    .select()
    .single();

  if (error || !data) {
    console.error("[restoreTicket error]", error);
    return { success: false, error: error?.message || "ไม่สามารถกู้คืนเคสได้" };
  }

  const item = mapRowToTicketItem(data as DbTicketRow);
  return { success: true, data: item };
}

export async function sendDirectMessageToUser(
  rawInput: unknown
): Promise<ActionResult<{ ticketId: string; sentAt: string }>> {
  const parsed = sendDirectMessageSchema.safeParse(rawInput);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง";
    return { success: false, error: errorMsg };
  }

  const { ticketId, message } = parsed.data;
  const supabase = getAdminSupabase();

  const { data: ticket, error } = await supabase
    .from("tickets")
    .select("id, line_user_id, issue_type, assignee")
    .eq("id", ticketId)
    .single();

  if (error || !ticket) {
    return { success: false, error: "ไม่พบข้อมูลเคสนี้ในระบบ" };
  }

  if (!ticket.line_user_id) {
    return { success: false, error: "เคสนี้ไม่มีข้อมูล LINE User ID ของผู้แจ้ง" };
  }

  const lineResult = await sendLineDirectAdminMessage({
    lineUserId: ticket.line_user_id,
    ticketId: ticket.id,
    issueType: ticket.issue_type,
    message,
    adminName: ticket.assignee || "เจ้าหน้าที่ไอที (นายเอกพงศ์)",
  });

  if (!lineResult.success) {
    return {
      success: false,
      error: lineResult.error || "ไม่สามารถส่งข้อความเข้า LINE ได้",
    };
  }

  return {
    success: true,
    data: {
      ticketId: ticket.id,
      sentAt: new Date().toISOString(),
    },
  };
}

export async function getTickets(filterStatus?: string): Promise<ActionResult<TicketItem[]>> {
  const supabase = getAdminSupabase();
  let query = supabase
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false });

  if (filterStatus && filterStatus !== "all") {
    query = query.eq("status", filterStatus);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error("[getTickets error]", error);
    return { success: false, error: error?.message || "ไม่สามารถดึงข้อมูล Ticket ได้" };
  }

  // ดึง feedbacks เพื่อผูกคะแนนและความคิดเห็นกับแต่ละงาน
  const { data: feedbacks } = await supabase
    .from("feedbacks")
    .select("ticket_id, rating, comment");

  const feedbackMap = new Map<string, { rating: number; comment: string | null }>();
  if (feedbacks) {
    for (const fb of feedbacks) {
      feedbackMap.set(fb.ticket_id, {
        rating: fb.rating,
        comment: fb.comment,
      });
    }
  }

  const items = (data as DbTicketRow[]).map((row) => {
    const item = mapRowToTicketItem(row);
    const fb = feedbackMap.get(item.id);
    if (fb) {
      item.rating = fb.rating;
      item.comment = fb.comment;
    }
    return item;
  });

  return { success: true, data: items };
}

export async function getTicketById(ticketId: string): Promise<ActionResult<TicketItem>> {
  if (!ticketId) {
    return { success: false, error: "ระบุ Ticket ID ไม่ถูกต้อง" };
  }

  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", ticketId)
    .single();

  if (error || !data) {
    return { success: false, error: "ไม่พบข้อมูล Ticket นี้" };
  }

  const { data: feedback } = await supabase
    .from("feedbacks")
    .select("rating, comment")
    .eq("ticket_id", ticketId)
    .maybeSingle();

  const item = mapRowToTicketItem(data as DbTicketRow);
  if (feedback) {
    item.rating = feedback.rating;
    item.comment = feedback.comment;
  }

  return { success: true, data: item };
}
