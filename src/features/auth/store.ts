import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  configureApiKeyGetter,
  configureAuthTokenGetter,
  setUnauthorizedHandler,
} from "@/lib/api";
import {
  createApiKey,
  fetchProfile,
  loginRequest,
  registerRequest,
} from "./api";
import type { Profile } from "@/types/api";

type AuthState = {
  token: string | null;
  apiKey: string | null;
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
  setProfile: (
    next: Profile | ((prev: Profile | null) => Profile | null),
  ) => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      apiKey: null,
      profile: null,
      loading: false,

      setProfile(next) {
        if (typeof next === "function") {
          set((s) => ({
            profile: (next as (p: Profile | null) => Profile | null)(s.profile),
          }));
        } else {
          set({ profile: next });
        }
      },

      async signIn(email, password) {
        set({ loading: true, error: undefined });
        try {
          const { data } = await loginRequest(email, password);
          const token = data.accessToken;
          set({ token });

          configureAuthTokenGetter(() => get().token);

          let key = get().apiKey;
          if (!key) {
            const created = await createApiKey(token, "Holidaze Web");
            key = created.data.key;
            set({ apiKey: key });
          }
          configureApiKeyGetter(() => get().apiKey);

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
        set({ token: null, profile: null, apiKey: null });
      },
    }),
    {
      name: "holidaze_auth_v1",
      partialize: (s) => ({
        token: s.token,
        apiKey: s.apiKey,
        profile: s.profile,
      }),
    },
  ),
);

configureAuthTokenGetter(() => useAuth.getState().token);
configureApiKeyGetter(() => useAuth.getState().apiKey);
setUnauthorizedHandler(() => useAuth.getState().signOut());
