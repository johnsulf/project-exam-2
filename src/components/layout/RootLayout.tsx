import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SkipLink } from "./SkipLink";
import { AppCrashBoundary } from "@/components/errors/AppCrashBoundary";
import { useRef, useEffect, Suspense } from "react";
import { PageSkeleton } from "../skeletons/PageSkeleton";
import { RouteAnnouncer } from "../a11y/RouteAnnouncer";
import { ToastAnnouncer } from "../a11y/ToastAnnouncer";

export default function RootLayout() {
  const mainRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const mainEl = mainRef.current;
    if (!mainEl) return;

    const heading = mainEl.querySelector("h1");
    if (heading instanceof HTMLElement) {
      if (heading.tabIndex < 0) {
        heading.tabIndex = -1;
      }
      heading.focus({ preventScroll: true });
      return;
    }

    mainEl.focus({ preventScroll: true });
  }, [pathname]);
  return (
    <div className="min-h-dvh flex flex-col">
      <SkipLink />
      <Header />
      <RouteAnnouncer />
      <ToastAnnouncer />
      <main
        id="main"
        ref={mainRef}
        role="main"
        tabIndex={-1}
        className="flex-1"
      >
        <div className="mx-auto max-w-screen-xl px-4 py-6">
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
