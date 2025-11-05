import { describe, expect, it } from "vitest";
import { isVenueAvailable, rangesOverlap } from "./availability";

describe("rangesOverlap", () => {
  it("returns true when ranges overlap", () => {
    const aFrom = new Date("2025-01-01");
    const aTo = new Date("2025-01-05");
    const bFrom = new Date("2025-01-04");
    const bTo = new Date("2025-01-10");

    expect(rangesOverlap(aFrom, aTo, bFrom, bTo)).toBe(true);
  });

  it("returns false when ranges touch but do not overlap", () => {
    const aFrom = new Date("2025-01-01");
    const aTo = new Date("2025-01-05");
    const bFrom = new Date("2025-01-05");
    const bTo = new Date("2025-01-07");

    expect(rangesOverlap(aFrom, aTo, bFrom, bTo)).toBe(false);
  });
});

describe("isVenueAvailable", () => {
  it("returns true when no bookings are present", () => {
    expect(isVenueAvailable({}, new Date(), new Date())).toBe(true);
  });

  it("returns true when the queried range does not overlap existing bookings", () => {
    const venue = {
      bookings: [
        { dateFrom: "2025-03-01", dateTo: "2025-03-05" },
        { dateFrom: "2025-03-10", dateTo: "2025-03-12" },
      ],
    };

    expect(
      isVenueAvailable(venue, new Date("2025-03-05"), new Date("2025-03-08")),
    ).toBe(true);
  });

  it("returns false when the queried range overlaps existing bookings", () => {
    const venue = {
      bookings: [{ dateFrom: "2025-03-01", dateTo: "2025-03-05" }],
    };

    expect(
      isVenueAvailable(venue, new Date("2025-03-02"), new Date("2025-03-04")),
    ).toBe(false);
  });

  it("prefers _bookings over bookings when both exist", () => {
    const venue = {
      bookings: [{ dateFrom: "2025-04-01", dateTo: "2025-04-02" }],
      _bookings: [{ dateFrom: "2025-05-01", dateTo: "2025-05-06" }],
    };

    expect(
      isVenueAvailable(venue, new Date("2025-05-02"), new Date("2025-05-04")),
    ).toBe(false);
  });
});
