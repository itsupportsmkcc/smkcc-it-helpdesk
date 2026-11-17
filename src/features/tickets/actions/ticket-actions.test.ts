import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTicket, updateTicketStatus } from "./ticket-actions";
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
});
