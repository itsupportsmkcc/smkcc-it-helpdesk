import { describe, it, expect } from "vitest";
import { THAI_MONTHS } from "./index";

describe("THAI_MONTHS constant (Regression Test)", () => {
  it("should be a valid array supporting .find method", () => {
    // Arrange & Act
    const foundNovember = THAI_MONTHS.find((m) => m.value === "11");
    const foundAll = THAI_MONTHS.find((m) => m.value === "all");

    // Assert
    expect(Array.isArray(THAI_MONTHS)).toBe(true);
    expect(typeof THAI_MONTHS.find).toBe("function");
    expect(foundNovember?.label).toBe("พฤศจิกายน");
    expect(foundAll?.label).toBe("ทุกเดือน (ทั้งปี)");
  });
});
