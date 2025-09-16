import { describe, it, expect } from "vitest";
import { formatMoney } from "./money";

describe("money", () => {
  it("formats with currency", () => {
    const out = formatMoney(199, { currency: "USD", locale: "en-US" });
    expect(out).toMatch(/\$/);
  });
});
