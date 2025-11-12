import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SkipLink } from "./SkipLink";
import { AppCrashBoundary } from "@/components/errors/AppCrashBoundary";
import { useRef, useEffect } from "react";
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

    if (
      mainEl.hasAttribute("aria-hidden") ||
      mainEl.closest('[aria-hidden="true"], [inert]')
    ) {
      return;
    }

    if (mainEl.tabIndex < 0) {
      mainEl.tabIndex = -1;
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
