import test, { expect } from "@playwright/test";
import { ensureLoggedOut, signIn } from "./support/auth";

const venueUrl =
  "http://localhost:5173/venues/f92f5fba-8177-4999-bec6-34657f2dd98d";

test("Booking - unauthenticated users must sign in before booking", async ({
  page,
}) => {
  await ensureLoggedOut(page);

  await page.goto(venueUrl);
  await expect(page).toHaveURL(venueUrl);

  await expect(
    page.getByRole("button", { name: "Sign in to book" }),
  ).toBeVisible();

  await test.step("redirect unauthenticated visitors to login", async () => {
    await page.getByRole("button", { name: "Sign in to book" }).click();
    await expect(page).toHaveURL("http://localhost:5173/auth/login");
  });

  await test.step("authenticate and return to the venue", async () => {
    await signIn(page, undefined, { expectUrl: venueUrl });
    await expect(page.getByRole("button", { name: "Book now" })).toBeVisible();
  });

  await test.step("select dates and open the booking confirmation", async () => {
    const bookNowButton = page.getByRole("button", { name: "Book now" });
    await expect(bookNowButton).toBeDisabled();

    const availableDays = page.locator(
      '[data-slot="calendar"] [data-day]:not([disabled])',
    );
    await expect(availableDays.first()).toBeVisible();
    await expect(availableDays.nth(1)).toBeVisible();

    const dayCount = await availableDays.count();
    expect(dayCount).toBeGreaterThan(1);

    const startDay = availableDays.first();
    const endDay = availableDays.nth(dayCount - 1);

    await startDay.click();
    await endDay.click();

    await expect(bookNowButton).toBeEnabled();
    await bookNowButton.click();

    const confirmDialog = page.getByRole("dialog", { name: "Confirm booking" });
    await expect(confirmDialog).toBeVisible();
    await confirmDialog.getByRole("button", { name: "Cancel" }).click();
    await expect(confirmDialog).not.toBeVisible();
  });
});
