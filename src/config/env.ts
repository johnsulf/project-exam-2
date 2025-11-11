const DEFAULT_API_BASE_URL = "https://v2.api.noroff.dev";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

const rawAppEnv =
  import.meta.env.VITE_APP_ENV ??
  import.meta.env.MODE ??
  (import.meta.env.DEV ? "development" : "production");

const rawDebug = import.meta.env.VITE_DEBUG;
const DEBUG =
  rawDebug === true ||
  rawDebug === "true" ||
  rawDebug === "1" ||
  (rawDebug === undefined && import.meta.env.DEV);

export const env = {
  API_BASE_URL,
  APP_ENV: rawAppEnv,
  DEBUG,
} as const;
