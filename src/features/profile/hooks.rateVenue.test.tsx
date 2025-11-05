import { beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, act } from "@testing-library/react";
import { useRateVenue } from "./hooks";
import { qk } from "@/lib/queryKeys";

const updateVenueMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/endpoints", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/endpoints")>("@/lib/endpoints");
  return { ...actual, updateVenue: updateVenueMock };
});

describe("useRateVenue", () => {
  beforeEach(() => {
    updateVenueMock.mockReset();
  });

  function setup(profileName?: string) {
    const client = new QueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    return { client, wrapper, profileName };
  }

  it("updates the venue rating and invalidates caches", async () => {
    updateVenueMock.mockResolvedValue({});
    const { client, wrapper } = setup("alice");
    const spy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useRateVenue("alice"), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ venueId: "v1", rating: 4 });
    });

    expect(updateVenueMock).toHaveBeenCalledWith("v1", { rating: 4 });
    expect(spy).toHaveBeenCalledWith({
      queryKey: qk.bookingsByProfile("alice"),
    });
    expect(spy).toHaveBeenCalledWith({ queryKey: qk.venue("v1") });
    expect(spy).toHaveBeenCalledWith({ queryKey: qk.venues() });
  });

  it("skips profile bookings invalidation when no profile name is provided", async () => {
    updateVenueMock.mockResolvedValue({});
    const { client, wrapper } = setup();
    const spy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useRateVenue(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ venueId: "v2", rating: 5 });
    });

    expect(updateVenueMock).toHaveBeenCalledWith("v2", { rating: 5 });
    const queryKeys = spy.mock.calls
      .map(([arg]) =>
        typeof arg === "object"
          ? (arg as { queryKey?: unknown }).queryKey
          : undefined,
      )
      .filter(Boolean);
    expect(
      queryKeys.some(
        (key) =>
          Array.isArray(key) && key[0] === "bookings" && key[1] === "profile",
      ),
    ).toBe(false);
  });
});
