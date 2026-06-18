import { expect, type Page } from "@playwright/test";
import { e2eEmail, e2ePassword } from "./credentials";

const SIGN_IN_URL_PATTERN = /\/sign-in$/;
const SIGN_IN_PREFERENCE_KEY = "afenda.auth.preferredSignInMethod";

export const preferPasswordSignIn = async (page: Page) => {
  await page.addInitScript((storageKey) => {
    window.localStorage.setItem(storageKey, "password");
  }, SIGN_IN_PREFERENCE_KEY);
};

export const gotoPasswordSignIn = async (page: Page) => {
  await preferPasswordSignIn(page);
  await page.goto("/sign-in", { waitUntil: "domcontentloaded" });
  return showPasswordSignIn(page);
};

export const showPasswordSignIn = async (page: Page) => {
  const passwordField = page.locator("#sign-in-password");

  try {
    await passwordField.waitFor({ state: "visible", timeout: 3000 });
    return passwordField;
  } catch {
    // Email-link mode is the default for some auth configurations.
  }

  const switchButton = page.getByRole("button", {
    name: "Use password instead",
  });

  await expect(switchButton).toBeVisible({ timeout: 15_000 });
  await switchButton.click();
  await expect(passwordField).toBeVisible({ timeout: 15_000 });

  return passwordField;
};

/** Sign in via email/password, overwriting any local dev auto-fill credentials. */
export const signInWithPassword = async (page: Page) => {
  const passwordField = await gotoPasswordSignIn(page);

  await page.getByLabel("Email").fill(e2eEmail);
  await passwordField.fill(e2ePassword);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).not.toHaveURL(SIGN_IN_URL_PATTERN, { timeout: 60_000 });
};
