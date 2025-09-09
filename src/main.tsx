import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./router/router";
import { AppProviders } from "./providers/AppProviders";
import { env } from "@/config/env";

if (env.DEBUG) {
  // eslint-disable-next-line no-console
  console.info("[env]", env);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
);
