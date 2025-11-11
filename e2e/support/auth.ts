import { expect, type Page } from "@playwright/test";

export const routes = {
  home: "http://localhost:5173/",
  login: "http://localhost:5173/auth/login",
};

export const customerCredentials = {
  email: "holidaze_customer@stud.noroff.no",
  password: "XPCmpvt3TYZj6HW",
};

type SignInOptions = {
  expectUrl?: string;
};

export async function ensureLoggedOut(page: Page, loginUrl = routes.login) {
  await page.goto(loginUrl);

  const profileButton = page.getByRole("button", { name: "Open profile menu" });
  const signOutMenuItem = page.getByRole("menuitem", { name: "Sign out" });

  if (await profileButton.isVisible()) {
    await profileButton.click();
    await signOutMenuItem.click();
    await expect(page).toHaveURL(loginUrl);
  }
}

export async function signIn(
  page: Page,
  credentials = customerCredentials,
  options: SignInOptions = {},
) {
  await page.getByLabel("Email").fill(credentials.email);
  await page.getByLabel("Password").fill(credentials.password);
  await page.getByRole("button", { name: "Sign in" }).click();

  if (options.expectUrl) {
    await expect(page).toHaveURL(options.expectUrl);
  }
}
