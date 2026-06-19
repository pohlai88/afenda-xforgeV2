import { expect, type Page } from "@playwright/test";
import { e2eEmail, e2ePassword } from "./credentials";

const SIGN_IN_URL_PATTERN = /\/sign-in$/;
const SIGN_IN_PREFERENCE_KEY = "afenda.auth.preferredSignInMethod";
const DEV_SIGN_IN_EMAIL = "developer@afenda.com";

export const preferPasswordSignIn = async (page: Page) => {
  await page.addInitScript((storageKey) => {
    window.localStorage.setItem(storageKey, "password");
  }, SIGN_IN_PREFERENCE_KEY);
};

export const gotoPasswordSignIn = async (page: Page) => {
  await preferPasswordSignIn(page);
  await page.goto("/sign-in", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Compiling")).toBeHidden({ timeout: 120_000 });
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

const ensurePasswordSignInHydrated = async (page: Page) => {
  const switchToEmailButton = page.getByRole("button", {
    name: "Use email link or code instead",
  });

  await expect(switchToEmailButton).toBeVisible({ timeout: 15_000 });

  const switchToPasswordButton = page.getByRole("button", {
    name: "Use password instead",
  });

  for (let attempt = 0; attempt < 60; attempt += 1) {
    await switchToEmailButton.click();

    try {
      await expect(switchToPasswordButton).toBeVisible({ timeout: 1000 });
      break;
    } catch {
      if (attempt === 59) {
        throw new Error("Sign-in form did not hydrate before password submit.");
      }
    }
  }

  await expect(switchToPasswordButton).toBeVisible({ timeout: 15_000 });
  await switchToPasswordButton.click();
  await expect(page.locator("#sign-in-password")).toBeVisible({
    timeout: 15_000,
  });
};

/** Sign in via email/password, overwriting any local dev auto-fill credentials. */
export const signInWithPassword = async (page: Page) => {
  const passwordField = await gotoPasswordSignIn(page);
  const emailField = page.getByLabel("Email");

  await expect(emailField).toBeVisible({ timeout: 15_000 });
  if (!process.env.CI) {
    await expect(emailField)
      .toHaveValue(DEV_SIGN_IN_EMAIL, { timeout: 60_000 })
      .catch(() => {
        // Production-like auth screens do not apply development credentials.
      });
  }
  await ensurePasswordSignInHydrated(page);
  await emailField.fill(e2eEmail);
  await expect(emailField).toHaveValue(e2eEmail);
  await passwordField.fill(e2ePassword);
  await expect(passwordField).toHaveValue(e2ePassword);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).not.toHaveURL(SIGN_IN_URL_PATTERN, { timeout: 60_000 });
};
