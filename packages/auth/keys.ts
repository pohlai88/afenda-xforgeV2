import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
    server: {
      /** Preferred — `sb_secret_…` from Supabase dashboard (Settings → API Keys). */
      SUPABASE_SECRET_KEY: z.string().min(1).optional(),
      /** Legacy fallback — JWT service_role key; deprecated by end of 2026. */
      SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
      SUPABASE_ACCESS_TOKEN: z.string().min(1).optional(),
      SUPABASE_PROJECT_ID: z.string().min(1).optional(),
    },
    client: {
      NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
      NEXT_PUBLIC_CAPTCHA_SITE_KEY: z.string().min(1).optional(),
      NEXT_PUBLIC_SSO_HINT_DOMAINS: z.string().optional(),
    },
    runtimeEnv: {
      SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      SUPABASE_ACCESS_TOKEN: process.env.SUPABASE_ACCESS_TOKEN,
      SUPABASE_PROJECT_ID: process.env.SUPABASE_PROJECT_ID,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
        process.env.SUPABASE_ANON_PUBLIC,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_CAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY,
      NEXT_PUBLIC_SSO_HINT_DOMAINS: process.env.NEXT_PUBLIC_SSO_HINT_DOMAINS,
    },
  });

/** Client-side Supabase key — prefers publishable (`sb_publishable_…`), falls back to legacy anon JWT. */
export const getSupabasePublishableKey = () => {
  const env = keys();

  return (
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_PUBLIC ??
    ""
  );
};

export const getSupabaseUrl = () =>
  keys().NEXT_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export const getCaptchaSiteKey = () =>
  keys().NEXT_PUBLIC_CAPTCHA_SITE_KEY ??
  process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY ??
  "";

export const getSsoHintDomains = () => {
  const raw =
    keys().NEXT_PUBLIC_SSO_HINT_DOMAINS ??
    process.env.NEXT_PUBLIC_SSO_HINT_DOMAINS ??
    "";

  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
};

/** Server-only admin key — prefers `SUPABASE_SECRET_KEY`, falls back to legacy service role. */
export const getSupabaseSecretKey = () => {
  const env = keys();

  return (
    env.SUPABASE_SECRET_KEY ??
    env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    ""
  );
};
