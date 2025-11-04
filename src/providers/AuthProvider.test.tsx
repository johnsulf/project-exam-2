import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";
import { routes } from "@/router/routes";

const mockNavigate = vi.fn();

vi.mock("@/router/router", () => ({
  router: {
    navigate: mockNavigate,
  },
}));

const refreshProfile = vi.fn();
const signOut = vi.fn();

const storeState = {
  token: null as string | null,
  loading: false,
  error: null as string | null,
  refreshProfile,
  signOut,
};

vi.mock("@/features/auth/store", () => ({
  useAuth: () => storeState,
}));

describe("AuthProvider", () => {
  beforeEach(() => {
    storeState.token = null;
    storeState.loading = false;
    storeState.error = null;
    refreshProfile.mockReset();
    signOut.mockReset();
    mockNavigate.mockReset();
  });

  function renderWithProvider(children: ReactNode) {
    return render(<AuthProvider>{children}</AuthProvider>);
  }

  it("renders children immediately when there is no active session", () => {
    renderWithProvider(<div>content</div>);

    expect(screen.getByText("content")).toBeInTheDocument();
    expect(refreshProfile).not.toHaveBeenCalled();
  });

  it("refreshes the profile when a token is present", async () => {
    storeState.token = "token";
    refreshProfile.mockResolvedValue(undefined);

    renderWithProvider(<div>content</div>);

    await waitFor(() => expect(refreshProfile).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      /session ready/i,
    );
  });

  it("signs the user out and redirects when refreshing fails", async () => {
    storeState.token = "token";
    refreshProfile.mockRejectedValue(new Error("bad token"));

    renderWithProvider(<div>content</div>);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledTimes(1);
    });
    expect(mockNavigate).toHaveBeenCalledWith(routes.auth.login);
    expect(screen.getByTestId("auth-error")).toHaveTextContent(/bad token/i);
  });
});
