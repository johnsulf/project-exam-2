import { test, expect } from "@playwright/test";

const configuredBase =
  process.env.E2E_BASE_URL || process.env.PLAYWRIGHT_TEST_BASE_URL || "";
const baseUrl = configuredBase || undefined;

test.skip(!configuredBase, "E2E_BASE_URL is not configured");

test.describe("public smoke tests", () => {
  test("home page hero is visible", async ({ page }) => {
    await page.goto(baseUrl ? baseUrl : "/");
    await expect(
      page.getByRole("heading", { name: /find your next stay/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: /search venues/i }),
    ).toBeVisible();
  });

  test("login form renders", async ({ page }) => {
    const target = baseUrl
      ? new URL("/auth/login", baseUrl).toString()
      : "/auth/login";
    await page.goto(target);
    await expect(
      page.getByRole("heading", { name: /welcome back/i }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("venues listing displays results", async ({ page }) => {
    const target = baseUrl ? new URL("/venues", baseUrl).toString() : "/venues";
    await page.goto(target);
    await expect(page.getByText(/results/iu)).toBeVisible();
  });
});
