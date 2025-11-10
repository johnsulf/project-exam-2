import { ZodError } from "zod";

type ApiErrorPayload = {
  errors?: { message?: string; code?: string; path?: string[] }[];
  status?: string;
  statusCode?: number;
  message?: string;
  error?: string;
};

export function getErrorMessage(err: unknown): string {
  if (err instanceof ZodError) {
    return err.issues?.[0]?.message ?? "Invalid input";
  }

  if (err instanceof Error) return err.message;

  const maybeAxios = err as unknown & { response?: { data?: unknown } };
  const data: ApiErrorPayload =
    maybeAxios?.response?.data ?? (maybeAxios as ApiErrorPayload);

  if (Array.isArray(data?.errors) && data.errors[0]?.message) {
    return data.errors[0].message!;
  }
  if (typeof data?.message === "string" && data.message) return data.message;
  if (typeof data?.error === "string" && data.error) return data.error;

  return "Something went wrong";
}
