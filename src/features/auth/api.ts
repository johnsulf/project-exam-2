import { authApi } from "@/lib/authApi";
import { getJson, postJson } from "@/lib/api";
import type { AuthLoginResponse, AuthRegisterBody, Profile } from "./types";

// Login
export async function loginRequest(email: string, password: string) {
  const res = await authApi.post("/auth/login", { email, password });
  return res.data as { data: AuthLoginResponse };
}

// Register
export async function registerRequest(body: AuthRegisterBody) {
  const res = await authApi.post("/auth/register", body);
  return res.data as { data: { name: string; email: string } };
}

// Fetch profile by name
export async function fetchProfile(name: string) {
  return getJson<Profile>(`/profiles/${name}`, {
    _venues: false,
    _bookings: false,
  });
}

// Update avatar/banner/bio/venueManager
export async function updateProfile(
  name: string,
  partial: Partial<Pick<Profile, "bio" | "avatar" | "banner" | "venueManager">>,
) {
  return postJson<Profile, typeof partial>(`/profiles/${name}`, partial);
}

// Create API key
export async function createApiKey(token: string, name = "Holidaze Web") {
  const res = await authApi.post(
    "/auth/create-api-key",
    { name },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data as { data: { key: string } };
}
