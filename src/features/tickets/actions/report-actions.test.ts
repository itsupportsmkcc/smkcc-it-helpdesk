import { describe, it, expect, vi, beforeEach } from "vitest";
import { getReportData } from "./report-actions";
import * as supabaseLib from "@/lib/supabase";

describe("Report Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should combine tickets and feedbacks into report items successfully", async () => {
    // Arrange
    const mockTickets = [
      {
        id: "ticket-1",
        created_at: "2026-11-17T10:00:00Z",
        updated_at: "2026-11-17T11:00:00Z",
        full_name: "นายทดสอบ สมมุติ",
        phone: "0812345678",
        user_type: "student",
        issue_type: "ขอเลขห้อง Zoom",
        location: "ห้อง 101",
        priority: "medium",
        description: "ขอเลขห้องสำหรับวิชาคอมพิวเตอร์",
        status: "resolved",
        assignee: "นายเอกพงศ์ (IT Admin)",
      },
    ];

    const mockFeedbacks = [
      {
        ticket_id: "ticket-1",
        rating: 5,
        comment: "ได้รับเลขห้องรวดเร็วมากครับ",
      },
    ];

    const mockSupabase = {
      from: vi.fn((tableName: string) => {
        if (tableName === "tickets") {
          return {
            select: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: mockTickets,
                error: null,
              }),
            }),
          };
        }
        if (tableName === "feedbacks") {
          return {
            select: vi.fn().mockResolvedValue({
              data: mockFeedbacks,
              error: null,
            }),
          };
        }
        return {};
      }),
    };

    vi.spyOn(supabaseLib, "getAdminSupabase").mockReturnValue(
      mockSupabase as unknown as ReturnType<typeof supabaseLib.getAdminSupabase>
    );

  // Act
  const result = await getReportData();

  // Assert
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe("ticket-1");
    expect(result.data[0].issueType).toBe("ขอเลขห้อง Zoom");
    expect(result.data[0].rating).toBe(5);
    expect(result.data[0].comment).toBe("ได้รับเลขห้องรวดเร็วมากครับ");
  }
  });
});
