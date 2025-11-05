import { ApiError, extractErrorMessages } from "@/lib/api";

const joinUniqueMessages = (messages: string[]): string | null => {
  const unique = Array.from(
    new Set(messages.map((msg) => msg.trim()).filter(Boolean)),
  );
  return unique.length > 0 ? unique.join("\n") : null;
};

export const getErrorMessage = (err: unknown) => {
  if (err instanceof ApiError) {
    const detailMessages = extractErrorMessages(err.details);
    const combined = joinUniqueMessages([err.message, ...detailMessages]);
    if (combined) return combined;
  }
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;

  const derived = extractErrorMessages(err);
  const combined = joinUniqueMessages(derived);
  if (combined) return combined;

  try {
    return JSON.stringify(err);
  } catch {
    return "Something went wrong";
  }
};
