import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SkipLink } from "./SkipLink";
import { AppCrashBoundary } from "@/components/errors/AppCrashBoundary";
import { useRef, useEffect } from "react";

export default function RootLayout() {
  const mainRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    // move focus to main on navigation
    mainRef.current?.focus();
  }, [pathname]);
  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <SkipLink />
      <Header />
      <main
        id="main"
        ref={mainRef}
        tabIndex={-1}
        className="flex-1 focus:outline-none"
      >
        <div className="mx-auto max-w-[1280px] px-5 py-6">
          <AppCrashBoundary>
            <Outlet />
          </AppCrashBoundary>
        </div>
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
