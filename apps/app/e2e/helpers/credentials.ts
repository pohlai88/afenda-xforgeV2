export const e2eEmail =
  process.env.E2E_AUTH_EMAIL ??
  process.env.E2E_ORG_ADMIN_EMAIL ??
  "e2e-playwright@xforge.local";

export const e2ePassword =
  process.env.E2E_AUTH_PASSWORD ??
  process.env.E2E_ORG_ADMIN_PASSWORD ??
  "123qweasdzxc!@#";
