import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile } from "./types";
import { configureAuthTokenGetter, setUnauthorizedHandler } from "@/lib/api";
import { fetchProfile, loginRequest, registerRequest } from "./api";

type AuthState = {
  token: string | null;
  profile: Profile | null;
  loading: boolean;
  error?: string;

  // actions
  signIn: (email: string, password: string) => Promise<void>;
  register: (args: {
    name: string;
    email: string;
    password: string;
    venueManager?: boolean;
  }) => Promise<void>;
  refreshProfile: () => Promise<void>;
  signOut: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      profile: null,
      loading: false,

      async signIn(email, password) {
        set({ loading: true, error: undefined });
        try {
          const { data } = await loginRequest(email, password);
          const token = data.accessToken;
          set({ token });

          configureAuthTokenGetter(() => get().token);

          const name = data.name ?? email.split("@")[0];
          try {
            const p = await fetchProfile(name);
            set({ profile: p });
          } catch {
            set({ profile: { name, email, venueManager: false } as Profile });
          }
        } catch (e: unknown) {
          set({ error: e instanceof Error ? e.message : "Login failed" });
          throw e;
        } finally {
          set({ loading: false });
        }
      },

      async register({ name, email, password, venueManager }) {
        set({ loading: true, error: undefined });
        try {
          if (!/@stud\.noroff\.no$/i.test(email)) {
            throw new Error("Please use a stud.noroff.no email to register.");
          }
          await registerRequest({
            name,
            email,
            password,
            venueManager: !!venueManager,
          });
        } catch (e: unknown) {
          set({
            error: e instanceof Error ? e.message : "Registration failed",
          });
          throw e;
        } finally {
          set({ loading: false });
        }
      },

      async refreshProfile() {
        const p = get().profile;
        if (!p?.name) return;
        const updated = await fetchProfile(p.name);
        set({ profile: updated });
      },

      signOut() {
        set({ token: null, profile: null });
      },
    }),
    {
      name: "holidaze_auth_v1",
      partialize: (s) => ({ token: s.token, profile: s.profile }),
    },
  ),
);

configureAuthTokenGetter(() => useAuth.getState().token);
setUnauthorizedHandler(() => useAuth.getState().signOut());
