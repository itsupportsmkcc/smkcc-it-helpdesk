import { z } from "zod";

export const UserTypeEnum = z.enum(["student", "staff"]);
export const PriorityEnum = z.enum(["low", "medium", "high"]);
export const TicketStatusEnum = z.enum(["new", "in_progress", "pending", "resolved"]);

export const createTicketSchema = z.object({
  lineUserId: z.string().min(1, "ไม่พบข้อมูล LINE User ID กรุณาเปิดผ่าน LINE"),
  lineDisplayName: z.string().optional(),
  fullName: z.string().trim().min(2, "กรุณากรอกชื่อ-นามสกุล (อย่างน้อย 2 ตัวอักษร)"),
  phone: z.string().trim().regex(/^0[0-9]{8,9}$/, "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (9-10 หลักขึ้นต้นด้วย 0)"),
  userType: UserTypeEnum,
  issueType: z.string().trim().min(1, "กรุณาเลือกหรือระบุหัวข้อปัญหา"),
  location: z.string().trim().min(1, "กรุณาระบุสถานที่หรือห้องที่เกิดปัญหา"),
  priority: PriorityEnum,
  description: z.string().trim().optional(),
  imageUrl: z.string().url("URL รูปภาพไม่ถูกต้อง").optional().or(z.literal("")),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

export const updateTicketStatusSchema = z.object({
  ticketId: z.string().uuid("Ticket ID ไม่ถูกต้อง"),
  status: TicketStatusEnum,
  adminNote: z.string().trim().optional(),
});

export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusSchema>;

export const ticketIdSchema = z.object({
  ticketId: z.string().uuid("Ticket ID ต้องเป็น UUID ที่ถูกต้อง"),
});

export type TicketIdInput = z.infer<typeof ticketIdSchema>;

export const sendDirectMessageSchema = z.object({
  ticketId: z.string().uuid("รหัสเคสต้องเป็น UUID ที่ถูกต้อง"),
  message: z
    .string()
    .trim()
    .min(1, "กรุณากรอกข้อความที่ต้องการส่งถึงผู้ใช้")
    .max(1000, "ข้อความต้องมีความยาวไม่เกิน 1,000 ตัวอักษร"),
});

export type SendDirectMessageInput = z.infer<typeof sendDirectMessageSchema>;
