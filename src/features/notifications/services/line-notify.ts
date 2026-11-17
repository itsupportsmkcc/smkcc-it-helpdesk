import { TicketStatus } from "@/features/tickets/types";

interface SendStatusNotificationParams {
  lineUserId: string;
  ticketId: string;
  issueType: string;
  status: TicketStatus;
  adminNote?: string;
}

const statusTextMap: Record<TicketStatus, string> = {
  new: "รับเรื่องเรียบร้อย (New)",
  in_progress: "กำลังดำเนินการ (In Progress)",
  pending: "ติดปัญหา/รออะไหล่ (Pending)",
  resolved: "ดำเนินการเสร็จสิ้น (Resolved)",
};

export async function sendLineStatusNotification({
  lineUserId,
  ticketId,
  issueType,
  status,
  adminNote,
}: SendStatusNotificationParams): Promise<{ success: boolean; error?: string }> {
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://smkcc-helpdesk.vercel.app";

  if (!channelAccessToken) {
    console.warn("[LINE Notification] Skipped: LINE_CHANNEL_ACCESS_TOKEN not configured.");
    return { success: true };
  }

  if (!lineUserId || lineUserId.trim() === "") {
    return { success: false, error: "Missing lineUserId" };
  }

  const statusLabel = statusTextMap[status] || status;
  let messageText = `🔔 แจ้งเตือนสถานะงานไอที SMKCC\n\nเรื่อง: ${issueType}\nสถานะปัจจุบัน: ${statusLabel}`;

  if (adminNote && adminNote.trim() !== "") {
    messageText += `\nหมายเหตุจากเจ้าหน้าที่: ${adminNote.trim()}`;
  }

  // หากงานเสร็จสิ้น (Resolved) ให้แนบลิงก์ประเมินความพึงพอใจ
  if (status === "resolved") {
    const feedbackUrl = `${appUrl}/feedback/${ticketId}`;
    messageText += `\n\n🎉 งานของคุณได้รับการแก้ไขเรียบร้อยแล้ว\nกรุณาประเมินความพึงพอใจการให้บริการได้ที่ลิงก์นี้:\n👉 ${feedbackUrl}`;
  }

  try {
    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${channelAccessToken}`,
      },
      body: JSON.stringify({
        to: lineUserId,
        messages: [
          {
            type: "text",
            text: messageText,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("[LINE Notification Error]", errorBody);
      return { success: false, error: errorBody };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error sending LINE push";
    console.error("[LINE Notification Exception]", message);
    return { success: false, error: message };
  }
}
