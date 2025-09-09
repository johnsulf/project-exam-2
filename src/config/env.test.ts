import { describe, expect, it } from "vitest";
import { z } from "zod";

const RawEnv = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_APP_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  VITE_DEBUG: z.coerce.boolean().default(false),
});

describe("env schema", () => {
  it("accepts a valid env", () => {
    const env = RawEnv.parse({
      VITE_API_BASE_URL: "https://v2.api.noroff.dev",
      VITE_APP_ENV: "development",
      VITE_DEBUG: "false",
    });
    expect(env.VITE_API_BASE_URL).toContain("https://");
  });

  it("rejects invalid base URL", () => {
    expect(() => RawEnv.parse({ VITE_API_BASE_URL: "not-a-url" })).toThrow();
  });
});
