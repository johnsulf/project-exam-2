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
  [key: string]: unknown;
}

function normalizeApiError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data as ApiErrorData | undefined;
    const msg = data?.message || data?.error || err.message || "Request failed";
    const code = (data && (data.code || data.errorCode)) || undefined;
    return new ApiError(msg, status, code, data);
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
