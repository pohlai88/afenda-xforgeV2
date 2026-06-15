import { expect, test } from "@playwright/test";
import {
  buildConfirmUrl,
  createE2eEmail,
  createE2ePassword,
  createUnconfirmedUser,
  deleteUserByEmail,
  generateAuthLink,
  getPlaywrightBaseUrl,
  hasSupabaseAdminEnv,
  isEmailConfirmed,
} from "./helpers/supabase-admin";

const e2eEmail =
  process.env.E2E_AUTH_EMAIL ??
  process.env.E2E_ORG_ADMIN_EMAIL ??
  "e2e-playwright@xforge.local";
const e2ePassword =
  process.env.E2E_AUTH_PASSWORD ??
  process.env.E2E_ORG_ADMIN_PASSWORD ??
  "123qweasdzxc!@#";

const baseURL = getPlaywrightBaseUrl();

const fillSignUpPassword = async (
  page: import("@playwright/test").Page,
  value: string
) => {
  await page.locator("#sign-up-password").fill(value);
};

test.describe("Email authentication UI", () => {
  test("sign-up shows email confirmation copy and password requirements", async ({
    page,
  }) => {
    await page.goto("/sign-up");

    await expect(
      page.getByText(/verification link to confirm your email/i)
    ).toBeVisible();
    await expect(page.getByLabel("Password requirements")).toBeVisible();
    await expect(page.getByText(/At least \d+ characters/i)).toBeVisible();
  });

  test("validates password policy before calling Supabase", async ({ page }) => {
    await page.goto("/sign-up");
    await page.getByLabel("Name").fill("Policy Test");
    await page.getByLabel("Email").fill("policy-test@xforge.local");
    await fillSignUpPassword(page, "short");
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page.locator("#sign-up-error")).toContainText(
      /At least \d+ characters/i
    );
    await expect(page).toHaveURL(/\/sign-up$/);
  });

  test("sign-in exposes magic link mode for email auth", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByRole("button", { name: "Use email link instead" }).click();

    await expect(
      page.getByRole("button", { name: "Send sign-in link" })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Use password instead" })).toBeVisible();
  });

  test("magic link request shows check-your-email confirmation", async ({
    page,
  }) => {
    await page.goto("/sign-in");
    await page.getByRole("button", { name: "Use email link instead" }).click();
    await page.getByLabel("Email").fill(e2eEmail);
    await page.getByRole("button", { name: "Send sign-in link" }).click();

    await expect(
      page.getByText(/Check your email for a sign-in link/i)
    ).toBeVisible();
  });

  test("forgot-password success state renders", async ({ page }) => {
    const email = createE2eEmail("forgot-ui");

    await page.goto("/forgot-password");
    await page.getByLabel("Email").fill(email);
    await page.getByRole("button", { name: "Send reset link" }).click();

    await expect(page.getByRole("status")).toContainText("Check your email");
  });

  test("sign-up-success exposes resend confirmation", async ({ page }) => {
    await page.goto("/sign-up-success");

    await expect(page.getByRole("heading", { name: "Check your email" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Resend confirmation email" })
    ).toBeVisible();
  });
});

test.describe("Email authentication (Supabase integration)", () => {
  test.skip(
    !hasSupabaseAdminEnv(),
    "Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local / .env.secret (run pnpm test:e2e:env)"
  );

  test.describe.configure({ mode: "serial" });

  test("sign-up completes UI flow and reaches check-your-email page", async ({
    page,
  }) => {
    const email = createE2eEmail("e2e-signup-ui");
    const password = createE2ePassword();

    try {
      await page.goto("/sign-up");
      await page.getByLabel("Name").fill("Signup UI E2E");
      await page.getByLabel("Email").fill(email);
      await fillSignUpPassword(page, password);
      await page.getByRole("button", { name: "Create account" }).click();

      await expect(page).toHaveURL(/\/sign-up-success$/);
      await expect(page.getByRole("heading", { name: "Check your email" })).toBeVisible();
      await expect(page.getByLabel("Email")).toHaveValue(email);
    } finally {
      await deleteUserByEmail(email);
    }
  });

  test("blocks password sign-in until email is confirmed", async ({ page }) => {
    const email = createE2eEmail("e2e-unconfirmed");
    const password = createE2ePassword();

    try {
      await createUnconfirmedUser(email, password);

      await page.goto("/sign-in");
      await page.getByLabel("Email").fill(email);
      await page.locator("#sign-in-password").fill(password);
      await page.getByRole("button", { name: "Sign in" }).click();

      await expect(page.getByText(/email not confirmed/i)).toBeVisible();
      await expect(page).toHaveURL(/\/sign-in/);
    } finally {
      await deleteUserByEmail(email);
    }
  });

  test("confirms signup via auth link and establishes a session", async ({
    page,
  }) => {
    const email = createE2eEmail("e2e-confirm");
    const password = createE2ePassword();

    try {
      await createUnconfirmedUser(email, password);
      const link = await generateAuthLink("signup", email, { password });
      const confirmUrl = buildConfirmUrl(baseURL, link, "/");

      await page.goto(confirmUrl, { waitUntil: "networkidle" });

      await expect
        .poll(async () => isEmailConfirmed(email), { timeout: 15_000 })
        .toBe(true);

      await page.goto("/sign-in");
      await page.getByLabel("Email").fill(email);
      await page.locator("#sign-in-password").fill(password);
      await page.getByRole("button", { name: "Sign in" }).click();

      await expect(page).toHaveURL(/\/($|\?)/, { timeout: 30_000 });
    } finally {
      await deleteUserByEmail(email);
    }
  });

  test("magic link sign-in completes through auth confirm route", async ({
    page,
  }) => {
    const link = await generateAuthLink("magiclink", e2eEmail);
    const confirmUrl = buildConfirmUrl(baseURL, link, "/");

    await page.goto(confirmUrl, { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/\/($|\?)/, { timeout: 20_000 });
  });

  test("recovery link opens update-password after confirmation", async ({
    page,
  }) => {
    const link = await generateAuthLink("recovery", e2eEmail, {
      redirectTo: `${baseURL}/auth/confirm?next=${encodeURIComponent("/update-password")}`,
    });
    const confirmUrl = buildConfirmUrl(baseURL, link, "/update-password");

    await page.goto(confirmUrl);

    await expect(page).toHaveURL(/\/update-password$/);
    await expect(page.getByRole("heading", { name: "Update password" })).toBeVisible();
  });

  test("resend confirmation succeeds for an unconfirmed signup", async ({
    page,
  }) => {
    const email = createE2eEmail("e2e-resend");
    const password = createE2ePassword();

    try {
      await createUnconfirmedUser(email, password);

      await page.goto("/sign-up-success");
      await page.getByLabel("Email").fill(email);
      await page.getByRole("button", { name: "Resend confirmation email" }).click();

      await expect(page.getByText("Email sent")).toBeVisible();
      await expect(
        page.getByText(/If an account exists for that address/i)
      ).toBeVisible();
    } finally {
      await deleteUserByEmail(email);
    }
  });
});
