import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createTicket,
  updateTicketStatus,
  softDeleteTicket,
  restoreTicket,
  sendDirectMessageToUser,
} from "./ticket-actions";
import * as supabaseLib from "@/lib/supabase";
import * as lineNotifyLib from "@/features/notifications/services/line-notify";

describe("Ticket Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create ticket successfully and trigger LINE notification", async () => {
    // Arrange
    const mockDbRow = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      line_user_id: "U_TEST_USER_123",
      full_name: "นายทดสอบ ไอที",
      phone: "0891234567",
      user_type: "staff",
      issue_type: "แจ้งซ่อมจอภาพ",
      location: "ห้อง 201",
      priority: "high",
      description: "จอภาพกระพริบ",
      image_url: null,
      status: "new",
      assignee: "นายเอกพงศ์ (IT Admin)",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockDbRow,
              error: null,
            }),
          }),
        }),
      }),
    };

    vi.spyOn(supabaseLib, "getAdminSupabase").mockReturnValue(
      mockSupabase as unknown as ReturnType<typeof supabaseLib.getAdminSupabase>
    );
    const lineSpy = vi
      .spyOn(lineNotifyLib, "sendLineStatusNotification")
      .mockResolvedValue({ success: true });
    const adminAlertSpy = vi
      .spyOn(lineNotifyLib, "sendLineAdminNewTicketAlert")
      .mockResolvedValue({ success: true });

    const input = {
      lineUserId: "U_TEST_USER_123",
      fullName: "นายทดสอบ ไอที",
      phone: "0891234567",
      userType: "staff",
      issueType: "แจ้งซ่อมจอภาพ",
      location: "ห้อง 201",
      priority: "high",
      description: "จอภาพกระพริบ",
    };

    // Act
    const result = await createTicket(input);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe("123e4567-e89b-12d3-a456-426614174000");
      expect(result.data.fullName).toBe("นายทดสอบ ไอที");
      expect(result.data.status).toBe("new");
    }
    expect(lineSpy).toHaveBeenCalledTimes(1);
    expect(lineSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        lineUserId: "U_TEST_USER_123",
        status: "new",
      })
    );
    expect(adminAlertSpy).toHaveBeenCalledTimes(1);
    expect(adminAlertSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        fullName: "นายทดสอบ ไอที",
        priority: "high",
      })
    );
  });

  it("should fail validation and return early with error when data is invalid", async () => {
    // Arrange
    const invalidInput = {
      fullName: "ก", // too short
      phone: "invalid",
    };

    // Act
    const result = await createTicket(invalidInput);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(typeof result.error).toBe("string");
    }
  });

  it("should update ticket status and trigger notification with admin note", async () => {
    // Arrange
    const mockUpdatedRow = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      line_user_id: "U_TEST_USER_123",
      full_name: "นายทดสอบ ไอที",
      phone: "0891234567",
      user_type: "staff",
      issue_type: "แจ้งซ่อมจอภาพ",
      location: "ห้อง 201",
      priority: "high",
      description: "จอภาพกระพริบ",
      image_url: null,
      status: "resolved",
      assignee: "นายเอกพงศ์ (IT Admin)",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockUpdatedRow,
                error: null,
              }),
            }),
          }),
        }),
      }),
    };

    vi.spyOn(supabaseLib, "getAdminSupabase").mockReturnValue(
      mockSupabase as unknown as ReturnType<typeof supabaseLib.getAdminSupabase>
    );
    const lineSpy = vi
      .spyOn(lineNotifyLib, "sendLineStatusNotification")
      .mockResolvedValue({ success: true });
    const adminAlertSpy = vi
      .spyOn(lineNotifyLib, "sendLineAdminNewTicketAlert")
      .mockResolvedValue({ success: true });

    // Act
    const result = await updateTicketStatus({
      ticketId: "123e4567-e89b-12d3-a456-426614174000",
      status: "resolved",
      adminNote: "เปลี่ยนสายจอภาพเรียบร้อยแล้วครับ",
    });

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("resolved");
    }
    expect(lineSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "resolved",
        adminNote: "เปลี่ยนสายจอภาพเรียบร้อยแล้วครับ",
      })
    );
  });

  it("should soft delete ticket successfully", async () => {
    // Arrange
    const mockDeletedRow = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      line_user_id: "U_TEST_USER_123",
      full_name: "นายทดสอบ ไอที",
      phone: "0891234567",
      user_type: "staff",
      issue_type: "แจ้งซ่อมจอภาพ",
      location: "ห้อง 201",
      priority: "high",
      description: null,
      image_url: null,
      status: "new",
      assignee: "นายเอกพงศ์ (IT Admin)",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: true,
      deleted_at: new Date().toISOString(),
    };

    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockDeletedRow,
                error: null,
              }),
            }),
          }),
        }),
      }),
    };

    vi.spyOn(supabaseLib, "getAdminSupabase").mockReturnValue(
      mockSupabase as unknown as ReturnType<typeof supabaseLib.getAdminSupabase>
    );

    // Act
    const result = await softDeleteTicket({
      ticketId: "123e4567-e89b-12d3-a456-426614174000",
    });

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isDeleted).toBe(true);
      expect(result.data.deletedAt).toBeDefined();
    }
  });

  it("should restore ticket successfully", async () => {
    // Arrange
    const mockRestoredRow = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      line_user_id: "U_TEST_USER_123",
      full_name: "นายทดสอบ ไอที",
      phone: "0891234567",
      user_type: "staff",
      issue_type: "แจ้งซ่อมจอภาพ",
      location: "ห้อง 201",
      priority: "high",
      description: null,
      image_url: null,
      status: "new",
      assignee: "นายเอกพงศ์ (IT Admin)",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: false,
      deleted_at: null,
    };

    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockRestoredRow,
                error: null,
              }),
            }),
          }),
        }),
      }),
    };

    vi.spyOn(supabaseLib, "getAdminSupabase").mockReturnValue(
      mockSupabase as unknown as ReturnType<typeof supabaseLib.getAdminSupabase>
    );

    // Act
    const result = await restoreTicket({
      ticketId: "123e4567-e89b-12d3-a456-426614174000",
    });

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isDeleted).toBe(false);
      expect(result.data.deletedAt).toBeNull();
    }
  });

  it("should fail soft delete when ticketId is invalid", async () => {
    // Act
    const result = await softDeleteTicket({ ticketId: "invalid-id" });

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("UUID ที่ถูกต้อง");
    }
  });

  it("should send direct message to user successfully via LINE push", async () => {
    // Arrange
    const mockTicketRow = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      line_user_id: "U_TEST_USER_123",
      issue_type: "แจ้งซ่อมโปรเจกเตอร์",
      assignee: "นายเอกพงศ์ (IT Admin)",
    };

    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockTicketRow,
              error: null,
            }),
          }),
        }),
      }),
    };

    vi.spyOn(supabaseLib, "getAdminSupabase").mockReturnValue(
      mockSupabase as unknown as ReturnType<typeof supabaseLib.getAdminSupabase>
    );

    const directMsgSpy = vi
      .spyOn(lineNotifyLib, "sendLineDirectAdminMessage")
      .mockResolvedValue({ success: true });

    // Act
    const result = await sendDirectMessageToUser({
      ticketId: "123e4567-e89b-12d3-a456-426614174000",
      message: "กำลังนำหลอดภาพสำรองไปเปลี่ยนที่ห้อง 301 ครับ",
    });

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ticketId).toBe("123e4567-e89b-12d3-a456-426614174000");
      expect(result.data.sentAt).toBeDefined();
    }
    expect(directMsgSpy).toHaveBeenCalledTimes(1);
    expect(directMsgSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        lineUserId: "U_TEST_USER_123",
        message: "กำลังนำหลอดภาพสำรองไปเปลี่ยนที่ห้อง 301 ครับ",
      })
    );
  });

  it("should fail sendDirectMessageToUser when ticket has no lineUserId", async () => {
    // Arrange
    const mockTicketRow = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      line_user_id: "",
      issue_type: "แจ้งซ่อมโปรเจกเตอร์",
      assignee: "นายเอกพงศ์ (IT Admin)",
    };

    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockTicketRow,
              error: null,
            }),
          }),
        }),
      }),
    };

    vi.spyOn(supabaseLib, "getAdminSupabase").mockReturnValue(
      mockSupabase as unknown as ReturnType<typeof supabaseLib.getAdminSupabase>
    );

    // Act
    const result = await sendDirectMessageToUser({
      ticketId: "123e4567-e89b-12d3-a456-426614174000",
      message: "ทดสอบ",
    });

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("LINE User ID");
    }
  });
});
