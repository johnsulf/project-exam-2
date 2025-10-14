import { describe, expect, it } from "vitest";
import { Venue } from "./schemas";

describe("Venue schema", () => {
  it("parses a valid payload", () => {
    const payload = {
      id: "abc123",
      name: "Test venue",
      description: "A lovely place to stay with all amenities included.",
      media: [{ url: "https://example.com/image.jpg", alt: "Image" }],
      price: 120,
      maxGuests: 4,
      rating: 4,
      meta: { wifi: true, parking: false },
      location: {
        address: "123 Main St",
        city: "Testville",
        country: "Norway",
        lat: 60.39,
        lng: 5.32,
      },
    };

    const parsed = Venue.parse(payload);
    expect(parsed).toMatchObject({
      id: "abc123",
      name: "Test venue",
      media: [{ url: "https://example.com/image.jpg" }],
    });
  });

  it("throws when required fields are missing", () => {
    const invalidPayload = {
      id: "bad",
      description: "Missing critical fields",
      media: [{ url: "not-a-url" }],
      price: -5,
      maxGuests: 0,
    };

    expect(() => Venue.parse(invalidPayload)).toThrow();
  });
});
