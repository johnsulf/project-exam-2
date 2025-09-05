import { Outlet, ScrollRestoration } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SkipLink } from "./SkipLink";

export default function RootLayout() {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <SkipLink />
      <Header />
      <main id="main" className="flex-1">
        <div className="mx-auto max-w-[1280px] px-5 py-6">
          <Outlet />
        </div>
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
