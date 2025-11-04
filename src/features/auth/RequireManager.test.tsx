import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { toast } from "sonner";
import { routes } from "@/router/routes";

const mockNavigate = vi.fn();

const authState = {
  token: "token",
  loading: false,
  profile: { name: "Ada", email: "ada@example.com", venueManager: false },
};

vi.mock("react-router-dom", () => ({
  Navigate: (props: unknown) => {
    mockNavigate(props);
    return null;
  },
  Outlet: () => null,
  useLocation: () => ({ pathname: "/manage" }),
}));

vi.mock("./store", () => {
  const useAuth = Object.assign(() => authState, {
    setState(next: Partial<typeof authState>) {
      Object.assign(authState, next);
    },
    getState() {
      return authState;
    },
  });
  return { useAuth };
});

import { RequireManager, __resetManagerAccessNotice } from "./RequireManager";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    promise: vi.fn(),
  },
}));

describe("RequireManager", () => {
  beforeEach(() => {
    authState.token = "token";
    authState.loading = false;
    authState.profile = {
      name: "Ada",
      email: "ada@example.com",
      venueManager: false,
    };
    __resetManagerAccessNotice();
    mockNavigate.mockClear();
    vi.clearAllMocks();
  });

  it("redirects non-managers to the profile page", () => {
    renderToString(<RequireManager />);

    expect(mockNavigate).toHaveBeenCalled();
    const props = mockNavigate.mock.calls[0][0] as { to: string };
    expect(props.to).toBe(routes.profile);
    expect(toast.error).toHaveBeenCalledWith("Manager access required");
  });
});
