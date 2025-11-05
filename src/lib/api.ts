import axios, { AxiosError } from "axios";
import { env } from "@/config/env";

const BASE = `${env.API_BASE_URL.replace(/\/+$/, "")}/holidaze`;

export const api = axios.create({
  baseURL: BASE,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// ---- Auth plumbing ----
type TokenGetter = () => string | null;
let getToken: TokenGetter = () => localStorage.getItem("access_token"); // default fallback
export function configureAuthTokenGetter(fn: TokenGetter) {
  getToken = fn;
}

type ApiKeyGetter = () => string | null;
let getApiKey: ApiKeyGetter = () => null;

export function configureApiKeyGetter(fn: ApiKeyGetter) {
  getApiKey = fn;
}

type UnauthorizedHandler = () => void;
let on401: UnauthorizedHandler | null = null;
export function setUnauthorizedHandler(fn: UnauthorizedHandler) {
  on401 = fn;
}

// ---- Interceptors ----
api.interceptors.request.use((config) => {
  const token = getToken?.();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization =
      `Bearer ${token}`;
  }
  const apiKey = getApiKey?.();
  if (apiKey) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)["X-Noroff-API-Key"] = apiKey;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) on401?.();
    return Promise.reject(normalizeApiError(err));
  },
);

// ---- Error normalization ----
export class ApiError extends Error {
  status?: number;
  code?: string;
  details?: unknown;
  constructor(
    message: string,
    status?: number,
    code?: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface ApiErrorData {
  message?: string;
  error?: string;
  code?: string;
  errorCode?: string;
  detail?: string;
  error_description?: string;
  errors?: unknown;
  [key: string]: unknown;
}

export function extractErrorMessages(payload: unknown): string[] {
  const messages: string[] = [];
  const push = (raw?: unknown, prefix?: string) => {
    if (typeof raw !== "string") return;
    const trimmed = raw.trim();
    if (!trimmed) return;
    const full = prefix ? `${prefix}: ${trimmed}` : trimmed;
    if (!messages.includes(full)) messages.push(full);
  };

  const handleEntry = (entry: unknown, prefix?: string) => {
    if (!entry) return;
    if (typeof entry === "string") {
      push(entry, prefix);
      return;
    }
    if (typeof entry === "number" || typeof entry === "boolean") {
      push(String(entry), prefix);
      return;
    }
    if (Array.isArray(entry)) {
      for (const item of entry) handleEntry(item, prefix);
      return;
    }
    if (typeof entry === "object") {
      const obj = entry as Record<string, unknown>;
      const path =
        Array.isArray(obj.path) && obj.path.length > 0
          ? obj.path
              .filter(
                (segment) =>
                  typeof segment === "string" || typeof segment === "number",
              )
              .map(String)
              .join(".")
          : typeof obj.field === "string"
            ? obj.field
            : typeof obj.property === "string"
              ? obj.property
              : undefined;

      if (typeof obj.message === "string") {
        push(obj.message, path ?? prefix);
      }
      if (typeof obj.detail === "string") {
        push(obj.detail, path ?? prefix);
      }
      if (typeof obj.description === "string") {
        push(obj.description, path ?? prefix);
      }

      for (const [key, value] of Object.entries(obj)) {
        if (
          key === "message" ||
          key === "detail" ||
          key === "description" ||
          key === "path" ||
          key === "field" ||
          key === "property"
        ) {
          continue;
        }
        const nextPrefix =
          path ??
          prefix ??
          (typeof key === "string" && !/^(errors?|issues?|details?)$/i.test(key)
            ? key
            : undefined);
        handleEntry(value, nextPrefix);
      }
    }
  };

  if (payload && typeof payload === "object") {
    const data = payload as Record<string, unknown>;
    push(data.message);
    push(data.error);
    push(data.error_description);
    push(data.detail);
    handleEntry(data.errors);
    handleEntry(data.issues);
    handleEntry(data.details);
    handleEntry(data.errorDetails);
  } else if (typeof payload === "string") {
    push(payload);
  }

  return messages;
}

function normalizeApiError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data as ApiErrorData | undefined;
    const extracted = extractErrorMessages(data);
    const msg =
      extracted[0] ||
      data?.message ||
      data?.error ||
      err.message ||
      "Request failed";
    const code = (data && (data.code || data.errorCode)) || undefined;
    const details =
      data && typeof data === "object"
        ? { ...data, messages: extracted.length > 0 ? extracted : undefined }
        : data;
    return new ApiError(msg, status, code, details);
  }
  return new ApiError("Unknown error");
}

// ---- Helpers ----
export async function getJson<T>(
  url: string,
  params?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const res = await api.get(url, { params, signal });
  const body = res.data;
  return (body && body.data !== undefined ? body.data : body) as T;
}

export async function getEnvelope<T>(
  url: string,
  params?: unknown,
  signal?: AbortSignal,
): Promise<{ data: T; meta?: unknown }> {
  const res = await api.get(url, { params, signal });
  return res.data as { data: T; meta?: unknown };
}

export async function postJson<T, B = unknown>(
  url: string,
  body?: B,
): Promise<T> {
  const res = await api.post(url, body);
  const b = res.data;
  return (b && b.data !== undefined ? b.data : b) as T;
}

export async function putJson<T, B = unknown>(
  url: string,
  body?: B,
): Promise<T> {
  const res = await api.put(url, body);
  const b = res.data;
  return (b && b.data !== undefined ? b.data : b) as T;
}

export async function deleteJson<T = void>(url: string): Promise<T> {
  const res = await api.delete(url);
  const b = res.data;
  return (b && b.data !== undefined ? b.data : b) as T;
}
