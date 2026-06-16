import { expect, type Page } from "@playwright/test";

const e2eEmail =
  process.env.E2E_AUTH_EMAIL ??
  process.env.E2E_ORG_ADMIN_EMAIL ??
  "e2e-playwright@xforge.local";
const e2ePassword =
  process.env.E2E_AUTH_PASSWORD ??
  process.env.E2E_ORG_ADMIN_PASSWORD ??
  "123qweasdzxc!@#";

const SIGN_IN_URL_PATTERN = /\/sign-in$/;

/** Sign in via email/password, overwriting dev auto-fill credentials. */
export const signInWithPassword = async (page: Page) => {
  await page.goto("/sign-in");

  const passwordField = page.locator("#sign-in-password");

  try {
    await passwordField.waitFor({ state: "visible", timeout: 3000 });
  } catch {
    await page.getByRole("button", { name: "Use password instead" }).click();
    await passwordField.waitFor({ state: "visible" });
  }

  // Local dev auto-fills developer credentials on mount — fill after that settles.
  await expect(page.getByLabel("Email")).not.toHaveValue("");
  await page.getByLabel("Email").fill(e2eEmail);
  await passwordField.fill(e2ePassword);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).not.toHaveURL(SIGN_IN_URL_PATTERN, { timeout: 15_000 });
};

export { e2eEmail, e2ePassword };
