import { expect, type Page } from "@playwright/test";
import { e2eEmail, e2ePassword } from "./credentials";

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
