import { z } from "zod";

/**
 * Raw schema against Vite's injected vars.
 * Only VITE_* are exposed to the client.
 */
const RawEnv = z.object({
  VITE_API_BASE_URL: z.string().url({
    message:
      "VITE_API_BASE_URL must be a valid URL (f.ex. https://v2.api.noroff.dev)",
  }),
  VITE_APP_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  VITE_DEBUG: z.coerce.boolean().default(false),
});

/**
 * Parse once at module load. If this throws, the app won't boot.
 */
const parsed = RawEnv.safeParse(import.meta.env);
if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error(
    "Invalid environment variables. Check your .env*. See console for details.",
  );
}

/**
 * Normalized, app-friendly shape.
 * - Trim trailing slash on base URL
 */
const _base = parsed.data.VITE_API_BASE_URL.replace(/\/+$/, "");

export const env = {
  API_BASE_URL: _base, // f.ex. https://v2.api.noroff.dev
  APP_ENV: parsed.data.VITE_APP_ENV, // "development" | "test" | "production"
  DEBUG: parsed.data.VITE_DEBUG, // boolean
} as const;
