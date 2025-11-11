import { test, expect } from "@playwright/test";
import { ensureLoggedOut, signIn, routes } from "./support/auth";

test("Authentication", async ({ page }) => {
  await ensureLoggedOut(page);
  await page.goto(routes.home);
  const profileButton = page.getByRole("button", { name: "Open profile menu" });
  const signInLink = page.getByRole("link", { name: "Sign in or register" });
  const signOutMenuItem = page.getByRole("menuitem", { name: "Sign out" });
  const signInButton = page.getByRole("button", { name: "Sign in" });

  // navigate to sign in page
  await signInLink.click();

  // try to sign in with empty fields and check for validation messages
  await signInButton.click();
  await page.getByText("Enter a valid email").isVisible();
  await page.getByText("Password must be at least 6").isVisible();

  // sign in with valid credentials
  await signIn(page, undefined, { expectUrl: routes.home });
  expect(page.url()).toBe(routes.home);

  // after sign in, open profile menu and navigate to profile page, then log out
  await profileButton.click();
  await page.getByRole("menuitem", { name: "Profile" }).click();
  expect(page.url()).toBe("http://localhost:5173/profile");
  await profileButton.click();
  await signOutMenuItem.click();

  expect(page.url()).toBe(routes.login);
  expect(await signInLink.isVisible()).toBeTruthy();
});
