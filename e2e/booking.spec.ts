import test from "@playwright/test";

test("Booking", async ({ page }) => {
  await page.goto("http://localhost:5173/venues");
});
