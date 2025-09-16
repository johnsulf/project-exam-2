import { describe, it, expect } from "vitest";
import { nightsBetween, isRangeAvailable } from "./date";

describe("dates", () => {
  it("nightsBetween calculates whole nights", () => {
    const a = new Date("2025-09-10");
    const b = new Date("2025-09-13");
    expect(nightsBetween(a, b)).toBe(3);
  });

  it("detects overlap (end exclusive)", () => {
    const from = new Date("2025-09-10");
    const to = new Date("2025-09-13");
    const bookings = [
      { dateFrom: "2025-09-08", dateTo: "2025-09-10" },
      { dateFrom: "2025-09-12", dateTo: "2025-09-15" },
    ];
    expect(isRangeAvailable(from, to, bookings)).toBe(false); // overlaps second
  });

  it("no overlap at exact checkout boundary", () => {
    const from = new Date("2025-09-10");
    const to = new Date("2025-09-12");
    const bookings = [{ dateFrom: "2025-09-12", dateTo: "2025-09-14" }];
    expect(isRangeAvailable(from, to, bookings)).toBe(true);
  });
});
