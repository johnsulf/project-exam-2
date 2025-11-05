import { test as setup } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  await page.goto("http://localhost:5173/auth/login");
  await page.getByLabel("Email").fill("holidaze_customer@stud.noroff.no");
  await page.getByLabel("Password").fill("XPCmpvt3TYZj6HW");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("http://localhost:5173");

  await page.context().storageState({ path: authFile });
});
