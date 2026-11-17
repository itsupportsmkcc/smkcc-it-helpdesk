import { describe, it, expect } from "vitest";
import {
  createTicketSchema,
  updateTicketStatusSchema,
} from "./ticket-schema";

describe("Ticket Schema Validation", () => {
  it("should validate a valid ticket creation input", () => {
    // Arrange
    const validInput = {
      lineUserId: "U1234567890abcdef",
      fullName: "สมชาย รักการเรียน",
      phone: "0812345678",
      userType: "student",
      issueType: "แจ้งซ่อมคอมพิวเตอร์",
      location: "อาคาร 1 ห้อง 101",
      priority: "medium",
      description: "เปิดเครื่องไม่ติด",
      imageUrl: "",
    };

    // Act
    const result = createTicketSchema.safeParse(validInput);

    // Assert
    expect(result.success).toBe(true);
  });

  it("should fail when phone number format is invalid", () => {
    // Arrange
    const invalidInput = {
      lineUserId: "U1234567890abcdef",
      fullName: "สมชาย รักการเรียน",
      phone: "123456", // Invalid phone
      userType: "student",
      issueType: "แจ้งซ่อมคอมพิวเตอร์",
      location: "อาคาร 1 ห้อง 101",
      priority: "medium",
    };

    // Act
    const result = createTicketSchema.safeParse(invalidInput);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("เบอร์โทรศัพท์ให้ถูกต้อง");
    }
  });

  it("should fail when lineUserId is missing or empty", () => {
    // Arrange
    const invalidInput = {
      lineUserId: "",
      fullName: "สมชาย รักการเรียน",
      phone: "0812345678",
      userType: "student",
      issueType: "แจ้งซ่อมคอมพิวเตอร์",
      location: "อาคาร 1 ห้อง 101",
      priority: "medium",
    };

    // Act
    const result = createTicketSchema.safeParse(invalidInput);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should validate a valid status update input", () => {
    // Arrange
    const validUpdate = {
      ticketId: "123e4567-e89b-12d3-a456-426614174000",
      status: "in_progress",
      adminNote: "กำลังเข้าไปตรวจสอบ",
    };

    // Act
    const result = updateTicketStatusSchema.safeParse(validUpdate);

    // Assert
    expect(result.success).toBe(true);
  });
});
