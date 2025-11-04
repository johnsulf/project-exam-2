import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { DateRange } from "react-day-picker";
import { routes } from "@/router/routes";
import { BookingWidget } from "./BookingWidget";
import { toast } from "sonner";

const mockNavigate = vi.hoisted(() => vi.fn());
const mockLocation = {
  pathname: "/venues/1",
  search: "",
  hash: "",
  state: null,
  key: "key",
};
const mutateAsync = vi.fn();

const authState = { token: "token" as string | null };

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    message: vi.fn(),
    dismiss: vi.fn(),
  },
}));

vi.mock("@/components/ui/calendar", () => ({
  Calendar: ({ onSelect }: { onSelect?: (range: DateRange) => void }) => (
    <button
      type="button"
      onClick={() =>
        onSelect?.({
          from: new Date("2025-05-01"),
          to: new Date("2025-05-03"),
        })
      }
    >
      Select dates
    </button>
  ),
}));

vi.mock("@/features/auth/store", () => ({
  useAuth: () => authState,
}));

vi.mock("@/features/venues/hooks", () => ({
  useCreateBooking: () => ({ mutateAsync, isPending: false }),
}));

vi.mock("react-router-dom", async () => {
  const actual: typeof import("react-router-dom") =
    await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

describe("BookingWidget", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.token = "token";
  });

  it("redirects guests to the login page when not authenticated", () => {
    authState.token = null;

    render(<BookingWidget venueId="1" price={120} maxGuests={4} />);

    const button = screen.getByRole("button", { name: /sign in to book/i });
    expect(button).toBeEnabled();

    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith(routes.auth.login, {
      state: { from: mockLocation },
    });
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("submits a booking when the form is valid", async () => {
    mutateAsync.mockResolvedValueOnce(undefined);

    render(<BookingWidget venueId="abc" price={150} maxGuests={3} />);

    fireEvent.click(screen.getByRole("button", { name: /select dates/i }));

    await waitFor(() => {
      expect(screen.getByText(/2 nights/i)).toBeInTheDocument();
    });

    const actionButton = screen.getByRole("button", { name: /book now/i });
    expect(actionButton).toBeEnabled();

    fireEvent.click(actionButton);

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));

    expect(mutateAsync).toHaveBeenCalledWith({
      dateFrom: "2025-05-01",
      dateTo: "2025-05-03",
      guests: 1,
    });

    expect(toast.success).toHaveBeenCalledWith("Booking confirmed!");
    expect(toast.error).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(
        screen.getByText(/select dates to see the price\./i),
      ).toBeInTheDocument();
    });
  });
});
