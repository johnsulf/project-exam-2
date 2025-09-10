import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error: unknown) => {
          const err = error as
            | { status?: number; response?: { status?: number } }
            | undefined;
          const status = err?.status ?? err?.response?.status;
          if (status && status >= 400 && status < 500 && status !== 408)
            return false;
          return failureCount < 1;
        },
        staleTime: 60_000, // 1 min fresh
        gcTime: 5 * 60_000, // cache 5 min
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
