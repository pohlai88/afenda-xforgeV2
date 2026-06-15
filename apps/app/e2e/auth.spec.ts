import { expect, test } from "@playwright/test";

const e2eEmail = process.env.E2E_AUTH_EMAIL ?? "e2e-playwright@xforge.local";
const e2ePassword = process.env.E2E_ORG_ADMIN_PASSWORD ?? "123qweasdzxc!@#";

test.describe("Supabase auth flows", () => {
  test("redirects unauthenticated users from / to sign-in", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/sign-in$/);
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill("not-a-real-user@xforge.local");
    await page.getByLabel("Password").fill("wrong-password-123");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Invalid login credentials")).toBeVisible();
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("signs in with valid credentials and loads workspace", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill(e2eEmail);
    await page.getByLabel("Password").fill(e2ePassword);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { name: "Governed tenant dashboard" })).toBeVisible();
  });

  test("signs out and blocks authenticated routes", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill(e2eEmail);
    await page.getByLabel("Password").fill(e2ePassword);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/$/);

    await page.getByRole("button", { name: "Toggle Sidebar" }).click();
    await page
      .getByRole("button", { name: "Sign out" })
      .evaluate((button) => (button as HTMLButtonElement).click());

    await expect(page).toHaveURL(/\/sign-in$/);

    await page.goto("/");
    await expect(page).toHaveURL(/\/sign-in$/);
  });

  test("renders forgot-password and update-password pages", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page.getByRole("heading", { name: "Forgot password" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Send reset link" })).toBeVisible();

    await page.goto("/update-password");
    await expect(page.getByRole("heading", { name: "Update password" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Update password" })).toBeVisible();
  });

  test("validates password mismatch on update-password", async ({ page }) => {
    await page.goto("/update-password");
    await page.getByLabel("New password").fill("abcdef");
    await page.getByLabel("Confirm password").fill("ghijkl");
    await page.getByRole("button", { name: "Update password" }).click();

    await expect(page.getByText("Passwords do not match.")).toBeVisible();
  });

  test("redirects invalid auth confirm links to sign-in with error", async ({ page }) => {
    await page.goto("/auth/confirm?token_hash=invalid&type=recovery&next=/update-password");

    await expect(page).toHaveURL(/\/sign-in\?error=/);
    await expect(page.getByText(/invalid or has expired/i)).toBeVisible();
  });

  test("renders sign-up-success page", async ({ page }) => {
    await page.goto("/sign-up-success");
    await expect(page.getByRole("heading", { name: "Check your email" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to sign in" })).toBeVisible();
  });

  test("surfaces sign-up errors for blocked or rate-limited requests", async ({ page }) => {
    await page.goto("/sign-up");
    await page.getByLabel("Name").fill("Test User");
    await page.getByLabel("Email").fill("user@example.com");
    await page.getByLabel("Password").fill("validpass123");
    await page.getByRole("button", { name: "Sign up" }).click();

    await expect(page).toHaveURL(/\/sign-up/);
    await expect(
      page.getByText(/email rate limit exceeded|invalid|not allowed|valid email/i)
    ).toBeVisible();
  });

  test("loads authenticated search results from the database", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill(e2eEmail);
    await page.getByLabel("Password").fill(e2ePassword);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/$/);

    await page.goto("/search?q=Building");
    await expect(page.getByText("Building Your Application").first()).toBeVisible();
  });
});
