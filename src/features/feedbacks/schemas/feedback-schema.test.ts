import { describe, it, expect } from "vitest";
import { createFeedbackSchema } from "./feedback-schema";

describe("Feedback Schema Validation", () => {
  it("should accept valid feedback rating and comment", () => {
    // Arrange
    const validInput = {
      ticketId: "123e4567-e89b-12d3-a456-426614174000",
      rating: 5,
      comment: "บริการรวดเร็วมากครับ",
    };

    // Act
    const result = createFeedbackSchema.safeParse(validInput);

    // Assert
    expect(result.success).toBe(true);
  });

  it("should reject rating greater than 5 or less than 1", () => {
    // Arrange
    const invalidInputHigh = {
      ticketId: "123e4567-e89b-12d3-a456-426614174000",
      rating: 6,
    };
    const invalidInputLow = {
      ticketId: "123e4567-e89b-12d3-a456-426614174000",
      rating: 0,
    };

    // Act & Assert
    expect(createFeedbackSchema.safeParse(invalidInputHigh).success).toBe(false);
    expect(createFeedbackSchema.safeParse(invalidInputLow).success).toBe(false);
  });
});
