import { describe, expect, it } from "vitest";
import { getVenueFormDefaults, sanitizeVenueValues } from "./VenueForm";

describe("VenueForm helpers", () => {
  it("sanitizes a valid payload before submission", () => {
    const defaults = getVenueFormDefaults();

    const values = {
      ...defaults,
      name: " Cozy Cabin ",
      description: "A quiet place in the woods with a hot tub.",
      price: 220,
      maxGuests: 3,
      media: [
        { url: " https://example.com/cabin.jpg ", alt: " Cabin exterior " },
        { url: "   ", alt: "Should be dropped" },
      ],
      location: {
        ...defaults.location,
        address: "",
        city: "",
        country: "",
        lat: null,
        lng: null,
      },
    };

    const cleaned = sanitizeVenueValues(values);

    expect(cleaned.media).toEqual([
      { url: "https://example.com/cabin.jpg", alt: "Cabin exterior" },
    ]);
    expect(cleaned.location).toBeUndefined();
    expect(cleaned.price).toBe(220);
    expect(cleaned.maxGuests).toBe(3);
  });
});
