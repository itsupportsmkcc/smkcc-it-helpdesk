import { z } from "zod";

export const createFeedbackSchema = z.object({
  ticketId: z.string().uuid("Ticket ID ไม่ถูกต้อง"),
  rating: z.number().int().min(1, "กรุณาให้คะแนนอย่างน้อย 1 ดาว").max(5, "คะแนนสูงสุดคือ 5 ดาว"),
  comment: z.string().trim().max(500, "ความคิดเห็นต้องไม่เกิน 500 ตัวอักษร").optional(),
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
