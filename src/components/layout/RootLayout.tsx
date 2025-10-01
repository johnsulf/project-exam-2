import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SkipLink } from "./SkipLink";
import { AppCrashBoundary } from "@/components/errors/AppCrashBoundary";
import { useRef, useEffect, Suspense } from "react";
import { PageSkeleton } from "../skeletons/PageSkeleton";
import { RouteAnnouncer } from "../a11y/RouteAnnouncer";

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
      <RouteAnnouncer />
      <main
        id="main"
        ref={mainRef}
        tabIndex={-1}
        className="flex-1 focus:outline-none"
      >
        <div className="mx-auto max-w-[1280px] px-5 py-6">
          <Suspense fallback={<PageSkeleton />}>
            <AppCrashBoundary>
              <Outlet />
            </AppCrashBoundary>
          </Suspense>
        </div>
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
