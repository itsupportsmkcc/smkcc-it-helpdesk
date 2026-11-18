import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAnalyticsData } from "./analytics-actions";
import * as supabaseLib from "@/lib/supabase";

describe("Analytics Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should calculate correct analytics KPIs and category stats", async () => {
    // Arrange
    const mockTickets = [
      {
        id: "t1",
        line_user_id: "u1",
        full_name: "นาย ก",
        phone: "0812345678",
        user_type: "student",
        issue_type: "อินเทอร์เน็ต / WiFi",
        location: "อาคาร 1 ห้อง 101",
        priority: "medium",
        status: "resolved",
        assignee: "นายเอกพงศ์",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_deleted: false,
      },
      {
        id: "t2",
        line_user_id: "u2",
        full_name: "อาจารย์ ข",
        phone: "0823456789",
        user_type: "staff",
        issue_type: "อินเทอร์เน็ต / WiFi",
        location: "อาคาร 1 ห้อง 101",
        priority: "high",
        status: "in_progress",
        assignee: "นายเอกพงศ์",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_deleted: false,
      },
      {
        id: "t3",
        line_user_id: "u3",
        full_name: "อาจารย์ ค",
        phone: "0834567890",
        user_type: "staff",
        issue_type: "คอมพิวเตอร์ / จอภาพ",
        location: "ห้องประชุม 2",
        priority: "low",
        status: "resolved",
        assignee: "นายเอกพงศ์",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_deleted: false,
      },
      {
        id: "t4_deleted",
        line_user_id: "u4",
        full_name: "เคสที่ถูกลบ",
        phone: "0845678901",
        user_type: "student",
        issue_type: "สแปม",
        location: "ห้อง 999",
        priority: "low",
        status: "new",
        assignee: "นายเอกพงศ์",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_deleted: true, // Should be excluded!
      },
    ];

    const mockFeedbacks = [{ rating: 5 }, { rating: 4 }];

    const mockSupabase = {
      from: vi.fn((table: string) => {
        if (table === "tickets") {
          return {
            select: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: mockTickets,
                error: null,
              }),
            }),
          };
        }
        if (table === "feedbacks") {
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
    const result = await getAnalyticsData("all");

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      const { data } = result;
      // 1. Total valid tickets should be 3 (excluding deleted t4)
      expect(data.kpis.totalTickets).toBe(3);
      // 2 resolved out of 3 = 66.7%
      expect(data.kpis.resolvedRate).toBe(66.7);
      // Average rating (5+4)/2 = 4.5
      expect(data.kpis.averageRating).toBe(4.5);
      expect(data.kpis.totalFeedbacks).toBe(2);
      expect(data.kpis.activePendingCount).toBe(1);

      // Category breakdown
      expect(data.categories[0].category).toBe("อินเทอร์เน็ต / WiFi");
      expect(data.categories[0].count).toBe(2);

      // Top location
      expect(data.topLocations[0].location).toBe("อาคาร 1 ห้อง 101");
      expect(data.topLocations[0].count).toBe(2);

      // User type ratio: 1 student (33.3%), 2 staff (66.7%)
      expect(data.userTypeRatio.student).toBe(1);
      expect(data.userTypeRatio.staff).toBe(2);

      // Status breakdown
      expect(data.statusBreakdown.resolved).toBe(2);
      expect(data.statusBreakdown.inProgress).toBe(1);
      expect(data.statusBreakdown.new).toBe(0);

      // Recent pending tickets should contain only t2
      expect(data.recentPendingTickets.length).toBe(1);
      expect(data.recentPendingTickets[0].id).toBe("t2");
    }
  });

  it("should handle empty ticket dataset gracefully", async () => {
    // Arrange
    const mockSupabase = {
      from: vi.fn((table: string) => {
        if (table === "tickets") {
          return {
            select: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }),
          };
        }
        if (table === "feedbacks") {
          return {
            select: vi.fn().mockResolvedValue({
              data: [],
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
    const result = await getAnalyticsData("all");

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.kpis.totalTickets).toBe(0);
      expect(result.data.kpis.resolvedRate).toBe(0);
      expect(result.data.kpis.averageRating).toBe(0);
      expect(result.data.categories.length).toBe(0);
      expect(result.data.topLocations.length).toBe(0);
    }
  });
});
