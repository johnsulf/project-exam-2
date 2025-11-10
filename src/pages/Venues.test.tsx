import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { renderToString } from "react-dom/server";
import Venues from "./Venues";

vi.mock("@/features/venues/hooks", () => ({
  useVenues: () => ({
    data: {
      data: [
        {
          id: "1",
          name: "Test Venue",
          description: "A test venue without media or amenities",
          media: [],
          price: 120,
          maxGuests: 3,
        },
      ],
    },
    isLoading: false,
    isError: false,
    isFetching: false,
    refetch: vi.fn(),
  }),
}));

describe("Venues", () => {
  it("renders a placeholder when media and meta are missing", () => {
    const html = renderToString(
      <MemoryRouter>
        <Venues />
      </MemoryRouter>,
    );

    expect(html).toContain("No image available");
    expect(html).toContain("Up to <!-- -->3<!-- --> guests");
    expect(html).not.toContain("WiFi");
    expect(html).toContain("No ratings");
  });
});
