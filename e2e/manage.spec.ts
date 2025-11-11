import test, { expect } from "@playwright/test";
import { ensureLoggedOut, routes, signIn } from "./support/auth";

test("Venue management UI smoke", async ({ page }) => {
  await ensureLoggedOut(page);
  await signIn(page, undefined, { expectUrl: routes.home });

  const profileButton = page.getByRole("button", { name: "Open profile menu" });
  await profileButton.click();
  await expect(page.getByText("Venue Manager")).toBeVisible();
  await page.getByRole("menuitem", { name: "Manage venues" }).click();

  await expect(page).toHaveURL(routes.manage);
  await expect(
    page.getByRole("heading", { name: "Manage venues" }),
  ).toBeVisible();

  const manageLink = page
    .locator(
      'a[href^="/manage/"]:not([href="/manage"]):not([href="/manage/new"]):not([href$="/bookings"]):not([href$="/edit"])',
    )
    .first();
  await expect(manageLink).toBeVisible();
  await manageLink.click();

  const venueTitle = page.getByRole("heading", { level: 1 });
  await expect(venueTitle).toBeVisible();

  // Delete dialog opens and can be dismissed
  await page.getByRole("button", { name: "Delete" }).click();
  const deleteDialog = page.getByRole("dialog", { name: "Delete venue" });
  await expect(deleteDialog).toBeVisible();
  await deleteDialog.getByRole("button", { name: "Cancel" }).click();
  await expect(deleteDialog).not.toBeVisible();

  // Edit button navigates
  await page.getByRole("link", { name: "Edit" }).click();
  await expect(page.getByRole("heading", { name: "Edit venue" })).toBeVisible();
  await page.getByRole("link", { name: "Cancel" }).click();
  await expect(page).toHaveURL(routes.manage);

  // Bookings link works
  const bookingsLink = page.locator('a[href$="/bookings"]').first();
  await expect(bookingsLink).toBeVisible();
  await bookingsLink.click();
  await expect(page.getByRole("heading", { name: "Bookings" })).toBeVisible();
  await page.locator('a[href="/manage"]').first().click();

  // Create venue button opens form and validation blocks empty submission
  const createVenueButton = page.getByRole("link", { name: "Create venue" });
  await createVenueButton.click();
  await expect(
    page.getByRole("heading", { name: "Create venue" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Create venue" }).click();
  await expect(page.getByText("Please enter a name")).toBeVisible();
  await page.getByRole("link", { name: "Cancel" }).click();
  await expect(page).toHaveURL(routes.manage);

  await ensureLoggedOut(page);
});
