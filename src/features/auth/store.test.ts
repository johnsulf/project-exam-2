import { beforeEach, describe, expect, it, vi } from "vitest";

const mockConfigureAuthTokenGetter = vi.fn();
const mockConfigureApiKeyGetter = vi.fn();
const mockSetUnauthorizedHandler = vi.fn();

const mockLoginRequest = vi.fn();
const mockRegisterRequest = vi.fn();
const mockFetchProfile = vi.fn();
const mockCreateApiKey = vi.fn();

vi.mock("@/lib/api", () => ({
  configureAuthTokenGetter: (...args: unknown[]) =>
    mockConfigureAuthTokenGetter(...(args as [])),
  configureApiKeyGetter: (...args: unknown[]) =>
    mockConfigureApiKeyGetter(...(args as [])),
  setUnauthorizedHandler: (...args: unknown[]) =>
    mockSetUnauthorizedHandler(...(args as [])),
}));

vi.mock("./api", () => ({
  loginRequest: (...args: unknown[]) => mockLoginRequest(...args),
  registerRequest: (...args: unknown[]) => mockRegisterRequest(...args),
  fetchProfile: (...args: unknown[]) => mockFetchProfile(...args),
  createApiKey: (...args: unknown[]) => mockCreateApiKey(...args),
}));

describe("auth store", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear?.();
  });

  async function loadStore() {
    vi.resetModules();
    return (await import("./store")).useAuth;
  }

  it("signs users in and hydrates their profile", async () => {
    mockLoginRequest.mockResolvedValueOnce({
      data: { accessToken: "token", name: "Alice" },
    });
    mockCreateApiKey.mockResolvedValueOnce({ data: { key: "api-key" } });
    mockFetchProfile.mockResolvedValueOnce({
      name: "Alice",
      email: "alice@stud.noroff.no",
      venueManager: true,
    });

    const useAuth = await loadStore();

    await useAuth.getState().signIn("alice@stud.noroff.no", "secret");

    const state = useAuth.getState();
    expect(state.token).toBe("token");
    expect(state.apiKey).toBe("api-key");
    expect(state.profile?.name).toBe("Alice");
    expect(mockFetchProfile).toHaveBeenCalledWith("Alice");
    expect(mockCreateApiKey).toHaveBeenCalledWith("token", "Holidaze Web");
    expect(mockConfigureAuthTokenGetter).toHaveBeenCalled();
    expect(mockConfigureApiKeyGetter).toHaveBeenCalled();
    expect(mockSetUnauthorizedHandler).toHaveBeenCalled();
  });

  it("falls back to an email-derived profile when lookup fails", async () => {
    mockLoginRequest.mockResolvedValueOnce({
      data: { accessToken: "token", email: "sam@stud.noroff.no" },
    });
    mockCreateApiKey.mockResolvedValueOnce({ data: { key: "api-key" } });
    mockFetchProfile.mockRejectedValueOnce(new Error("missing"));

    const useAuth = await loadStore();

    await useAuth
      .getState()
      .signIn("sam@stud.noroff.no", "secret")
      .catch(() => undefined);

    const state = useAuth.getState();
    expect(state.profile?.name).toBe("sam");
    expect(state.profile?.email).toBe("sam@stud.noroff.no");
  });

  it("stores registration errors for non-student emails", async () => {
    const useAuth = await loadStore();

    await expect(
      useAuth.getState().register({
        name: "Bob",
        email: "bob@example.com",
        password: "password123",
      }),
    ).rejects.toThrow(/stud\.noroff\.no/i);

    expect(mockRegisterRequest).not.toHaveBeenCalled();
    expect(useAuth.getState().error).toMatch(/stud\.noroff\.no/i);
  });

  it("registers valid users via the API", async () => {
    mockRegisterRequest.mockResolvedValueOnce({ data: { name: "Eve" } });
    mockLoginRequest.mockResolvedValueOnce({
      data: { accessToken: "token", name: "Eve" },
    });
    mockCreateApiKey.mockResolvedValueOnce({ data: { key: "api-key" } });
    mockFetchProfile.mockResolvedValueOnce({
      name: "Eve",
      email: "eve@stud.noroff.no",
      venueManager: true,
    });

    const useAuth = await loadStore();

    await expect(
      useAuth.getState().register({
        name: "Eve",
        email: "eve@stud.noroff.no",
        password: "password123",
        venueManager: true,
      }),
    ).resolves.toBeUndefined();

    expect(mockRegisterRequest).toHaveBeenCalledWith({
      name: "Eve",
      email: "eve@stud.noroff.no",
      password: "password123",
      venueManager: true,
    });
    expect(mockLoginRequest).toHaveBeenCalledWith(
      "eve@stud.noroff.no",
      "password123",
    );
    expect(mockCreateApiKey).toHaveBeenCalledWith("token", "Holidaze Web");
    expect(mockFetchProfile).toHaveBeenCalledWith("Eve");
    expect(useAuth.getState().token).toBe("token");
    expect(useAuth.getState().profile?.email).toBe("eve@stud.noroff.no");
  });

  it("exposes sign-out and refresh helpers", async () => {
    mockFetchProfile.mockResolvedValueOnce({
      name: "Pat",
      email: "pat@stud.noroff.no",
      venueManager: false,
    });
    mockLoginRequest.mockResolvedValueOnce({
      data: { accessToken: "token", name: "Pat" },
    });
    mockCreateApiKey.mockResolvedValueOnce({ data: { key: "key" } });

    const useAuth = await loadStore();

    await useAuth.getState().signIn("pat@stud.noroff.no", "secret");

    mockFetchProfile.mockResolvedValueOnce({
      name: "Pat",
      email: "pat@stud.noroff.no",
      venueManager: true,
    });

    await useAuth.getState().refreshProfile();
    expect(mockFetchProfile).toHaveBeenCalledWith("Pat");
    expect(useAuth.getState().profile?.venueManager).toBe(true);

    useAuth.getState().signOut();
    expect(useAuth.getState().token).toBeNull();
    expect(useAuth.getState().profile).toBeNull();
  });

  it("records sign-in failures", async () => {
    mockLoginRequest.mockRejectedValueOnce(new Error("invalid credentials"));
    const useAuth = await loadStore();

    await expect(
      useAuth.getState().signIn("fail@stud.noroff.no", "wrong"),
    ).rejects.toThrow("invalid credentials");

    expect(useAuth.getState().error).toBe("invalid credentials");
  });
});
