import { test, expect } from "@playwright/test";

test("Authentication", async ({ page }) => {
  await page.goto("http://localhost:5173");
  const profileButton = page.getByRole("button", { name: "Open profile menu" });
  const signInLink = page.getByRole("link", { name: "Sign in or register" });
  const signOutMenuItem = page.getByRole("menuitem", { name: "Sign out" });
  const signInButton = page.getByRole("button", { name: "Sign in" });

  // check if already signed in and sign out if so
  const isProfileMenuVisible = await profileButton.isVisible();
  if (isProfileMenuVisible) {
    await profileButton.click();
    await signOutMenuItem.click();
  }

  // navigate to sign in page
  await signInLink.click();

  // try to sign in with empty fields and check for validation messages
  await signInButton.click();
  await page.getByText("Enter a valid email").isVisible();
  await page.getByText("Password must be at least 6").isVisible();

  // sign in with valid credentials
  await page
    .getByRole("textbox", { name: "Email" })
    .fill("holidaze_customer@stud.noroff.no");
  await page.getByRole("textbox", { name: "Password" }).fill("XPCmpvt3TYZj6HW");
  await signInButton.click();

  // wait a bit for navigation to complete
  await page.waitForURL("http://localhost:5173/");

  expect(page.url()).toBe("http://localhost:5173/");

  // after sign in, open profile menu and navigate to profile page, then log out
  await profileButton.click();
  await page.getByRole("menuitem", { name: "Profile" }).click();
  expect(page.url()).toBe("http://localhost:5173/profile");
  await profileButton.click();
  await signOutMenuItem.click();

  expect(page.url()).toBe("http://localhost:5173/auth/login");
  expect(await signInLink.isVisible()).toBeTruthy();
});
