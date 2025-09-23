import { useEffect, useRef } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors";

export function useQueryErrorToast<TData = unknown, TError = unknown>(
  q: Pick<
    UseQueryResult<TData, TError>,
    "isError" | "error" | "errorUpdatedAt"
  >,
  makeMessage?: (e: TError) => string,
) {
  const last = useRef<number>(0);
  useEffect(() => {
    if (q.isError && q.error && q.errorUpdatedAt !== last.current) {
      last.current = q.errorUpdatedAt;
      const msg = makeMessage ? makeMessage(q.error) : getErrorMessage(q.error);
      toast.error(msg);
    }
  }, [q.isError, q.error, q.errorUpdatedAt, makeMessage]);
}
