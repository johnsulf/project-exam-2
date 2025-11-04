#!/usr/bin/env node
import { spawn } from "node:child_process";

const baseUrl =
  process.env.E2E_BASE_URL || process.env.PLAYWRIGHT_TEST_BASE_URL || "";

if (!baseUrl) {
  console.log("Skipping end-to-end tests: set E2E_BASE_URL to enable them.");
  process.exit(0);
}

const args = process.argv.slice(2);

const child = spawn(
  process.platform === "win32" ? "pnpm.cmd" : "pnpm",
  ["dlx", "@playwright/test", "test", ...args],
  {
    stdio: "inherit",
    env: {
      ...process.env,
    },
  }
);

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
