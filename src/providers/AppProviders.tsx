import type { PropsWithChildren } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { makeQueryClient } from "@/lib/queryClient";
import { ThemeProvider } from "@/components/theme-provider";

const client = makeQueryClient();

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider delayDuration={200} skipDelayDuration={400}>
        <QueryClientProvider client={client}>
          {children}
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
          <Toaster />
        </QueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
