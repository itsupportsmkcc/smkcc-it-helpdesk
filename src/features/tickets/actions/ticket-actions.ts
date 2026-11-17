"use server";

import { getAdminSupabase } from "@/lib/supabase";
import {
  createTicketSchema,
  CreateTicketInput,
  updateTicketStatusSchema,
  UpdateTicketStatusInput,
} from "../schemas/ticket-schema";
import { ActionResult, TicketItem } from "../types";
import {
  sendLineStatusNotification,
  sendLineAdminNewTicketAlert,
} from "@/features/notifications/services/line-notify";

interface DbTicketRow {
  id: string;
  line_user_id: string;
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
}

function mapRowToTicketItem(row: DbTicketRow): TicketItem {
  return {
    id: row.id,
    lineUserId: row.line_user_id,
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

  const items = (data as DbTicketRow[]).map(mapRowToTicketItem);
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

  return { success: true, data: mapRowToTicketItem(data as DbTicketRow) };
}
