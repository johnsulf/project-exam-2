import test, { expect } from "@playwright/test";
import { ensureLoggedOut, routes, signIn } from "./support/auth";

test("Regression smoke", async ({ page }) => {
  await ensureLoggedOut(page);
  await page.goto(routes.home);

  await expect(
    page.getByRole("heading", { name: /Escape the ordinary/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Featured Venues" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "See all Venues" }).first().click();
  await expect(page).toHaveURL(/\/venues/);

  const resultsSummary = page.locator("text=/results/");
  await expect(resultsSummary.first()).toBeVisible();

  const firstCard = page.locator('a[href^="/venues/"]').first();
  await expect(firstCard).toBeVisible();
  const firstHref = await firstCard.getAttribute("href");
  const relativeVenuePath = firstHref ?? "";
  const absoluteVenueUrl = firstHref
    ? new URL(firstHref, routes.home).toString()
    : null;

  let searchCity = "Norway";
  const locationChip = firstCard.locator("span", { hasText: "," }).first();
  if (await locationChip.count()) {
    const locationText = (await locationChip.textContent())?.trim() ?? "";
    const [cityPart] = locationText.split(",");
    if (cityPart?.trim()) searchCity = cityPart.trim();
  }

  const searchInput = page.getByLabel("Search venues");
  await searchInput.fill(searchCity);
  await page.getByRole("button", { name: /^Search$/ }).click();
  await expect(resultsSummary.first()).toContainText("filtered results");

  await searchInput.fill("");
  await page.getByRole("button", { name: /^Search$/ }).click();

  const detailLink = relativeVenuePath
    ? page.locator(`a[href="${relativeVenuePath}"]`).first()
    : page.locator('a[href^="/venues/"]').first();
  await expect(detailLink).toBeVisible();
  await detailLink.click();

  await expect(
    page.getByRole("heading", { name: "Book this venue" }),
  ).toBeVisible();
  await expect(page.getByText("Guests").first()).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Decrease guests" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Sign in or register" }).click();
  const expectedPostLoginUrl = absoluteVenueUrl ?? routes.home;
  await signIn(page, undefined, { expectUrl: expectedPostLoginUrl });

  const profileButton = page.getByRole("button", { name: "Open profile menu" });
  await profileButton.click();
  await page.getByRole("menuitem", { name: "Profile" }).click();
  await expect(page).toHaveURL(routes.profile);

  await expect(
    page.getByRole("heading", { name: "Your bookings" }),
  ).toBeVisible();
  const upcomingTab = page.getByRole("tab", { name: /Upcoming/ });
  const earlierTab = page.getByRole("tab", { name: /Earlier/ });
  await expect(upcomingTab).toBeVisible();
  await earlierTab.click();
  await expect(earlierTab).toHaveAttribute("aria-selected", "true");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(routes.home);
  const mobileSearchButton = page
    .getByRole("button", { name: "Search venues" })
    .first();
  await mobileSearchButton.click();
  await expect(
    page.getByRole("heading", { name: "Search venues" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close search panel" }).click();

  if (absoluteVenueUrl) {
    await page.goto(absoluteVenueUrl);
    await expect(
      page.getByRole("button", { name: /Book now|Sign in to book/i }),
    ).toBeVisible();
  }

  await ensureLoggedOut(page);
});
