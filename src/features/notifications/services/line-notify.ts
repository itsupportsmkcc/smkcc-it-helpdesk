import { TicketStatus, Priority, UserType } from "@/features/tickets/types";

interface SendStatusNotificationParams {
  lineUserId: string;
  ticketId: string;
  issueType: string;
  status: TicketStatus;
  adminNote?: string;
}

export interface SendAdminNewTicketParams {
  ticketId: string;
  fullName: string;
  userType: UserType;
  phone: string;
  issueType: string;
  location: string;
  priority: Priority;
  description?: string;
}

const statusTextMap: Record<TicketStatus, string> = {
  new: "รับเรื่องแล้ว (New)",
  in_progress: "กำลังดำเนินการ (In Progress)",
  pending: "อยู่ระหว่างดำเนินการ (Pending)",
  resolved: "เสร็จสิ้น (Complete)",
};

const priorityTextMap: Record<Priority, string> = {
  high: "🔴 สูง (กระทบการสอน/เร่งด่วน)",
  medium: "🟠 ปานกลาง",
  low: "🟢 ทั่วไป / ต่ำ",
};

/**
 * ดึง Base URL ของระบบ โดยตัด localhost ออก เพื่อให้ลิงก์ที่ส่งเข้า LINE กดเข้าจากมือถือได้จริงเสมอ
 */
function getAppUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://smkcc-it-helpdesk.vercel.app";
}

export async function sendLineStatusNotification({
  lineUserId,
  ticketId,
  issueType,
  status,
  adminNote,
}: SendStatusNotificationParams): Promise<{ success: boolean; error?: string }> {
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const appUrl = getAppUrl();


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

/**
 * ส่งแจ้งเตือนไปยัง LINE ส่วนตัวของแอดมิน (นายเอกพงศ์) เมื่อมีเคสใหม่ถูกส่งเข้ามา
 */
export async function sendLineAdminNewTicketAlert({
  ticketId,
  fullName,
  userType,
  phone,
  issueType,
  location,
  priority,
  description,
}: SendAdminNewTicketParams): Promise<{ success: boolean; error?: string }> {
  const adminLineUserId = process.env.ADMIN_LINE_USER_ID;
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const appUrl = getAppUrl();

  if (!channelAccessToken || !adminLineUserId) {
    console.warn(
      "[Admin LINE Alert] Skipped: ADMIN_LINE_USER_ID or LINE_CHANNEL_ACCESS_TOKEN not set."
    );
    return { success: true };
  }

  const userTypeLabel = userType === "student" ? "นักศึกษา" : "บุคลากร";
  const priorityLabel = priorityTextMap[priority] || priority;

  let messageText = `🚨 มีรายการแจ้งซ่อมไอทีใหม่!\n(SMKCC IT Helpdesk)\n\n`;
  messageText += `📌 เรื่อง: ${issueType}\n`;
  messageText += `👤 ผู้แจ้ง: ${fullName} (${userTypeLabel})\n`;
  messageText += `📞 เบอร์โทร: ${phone}\n`;
  messageText += `📍 สถานที่: ${location}\n`;
  messageText += `⚡ ความเร่งด่วน: ${priorityLabel}\n`;

  if (description && description.trim() !== "") {
    messageText += `📝 รายละเอียด: ${description.trim()}\n`;
  }

  messageText += `\n👉 เข้าจัดการงานได้ที่:\n${appUrl}/admin/dashboard`;

  try {
    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${channelAccessToken}`,
      },
      body: JSON.stringify({
        to: adminLineUserId,
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
      console.error("[Admin LINE Alert Error]", errorBody);
      return { success: false, error: errorBody };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error sending admin LINE alert";
    console.error("[Admin LINE Alert Exception]", message);
    return { success: false, error: message };
  }
}

export interface SendDirectAdminMessageParams {
  lineUserId: string;
  ticketId: string;
  issueType: string;
  message: string;
  adminName?: string;
}

/**
 * ส่งข้อความด่วนจากแอดมินตรงเข้าแชท LINE ของผู้ใช้โดยเฉพาะ
 */
export async function sendLineDirectAdminMessage({
  lineUserId,
  ticketId,
  issueType,
  message,
  adminName = "เจ้าหน้าที่ไอที (นายเอกพงศ์)",
}: SendDirectAdminMessageParams): Promise<{ success: boolean; error?: string }> {
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

  if (!channelAccessToken) {
    console.warn("[LINE Direct Message] Skipped: LINE_CHANNEL_ACCESS_TOKEN not configured.");
    return { success: true };
  }

  if (!lineUserId || lineUserId.trim() === "") {
    return { success: false, error: "Missing lineUserId" };
  }

  const shortTicketId = ticketId.slice(0, 8);
  let messageText = `💬 ข้อความจากงานไอที SMKCC\n`;
  messageText += `(อ้างอิงเคส #${shortTicketId}: ${issueType})\n\n`;
  messageText += `${message.trim()}\n\n`;
  messageText += `— จาก: ${adminName}`;

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
      console.error("[LINE Direct Message Error]", errorBody);
      return { success: false, error: errorBody };
    }

    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error sending direct LINE message";
    console.error("[LINE Direct Message Exception]", errorMsg);
    return { success: false, error: errorMsg };
  }
}
