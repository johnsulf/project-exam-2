declare module "@playwright/test" {
  export type PlaywrightTestConfig = Record<string, unknown>;
  export const test: unknown;
  export const expect: unknown;
  export const devices: Record<string, unknown>;
  export function defineConfig<T extends PlaywrightTestConfig>(config: T): T;
}
