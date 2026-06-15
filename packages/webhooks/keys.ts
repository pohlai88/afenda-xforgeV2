import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { DEFAULT_WEBHOOK_SIGNATURE_TOLERANCE_SEC } from "./lib/constants";

export const keys = () =>
  createEnv({
    skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
    server: {
      WEBHOOK_DELIVERY_TIMEOUT_MS: z.coerce
        .number()
        .int()
        .positive()
        .default(10_000),
      WEBHOOK_SIGNATURE_TOLERANCE_SEC: z.coerce
        .number()
        .int()
        .positive()
        .default(DEFAULT_WEBHOOK_SIGNATURE_TOLERANCE_SEC),
      WEBHOOK_DELIVERY_RETENTION_DAYS: z.coerce
        .number()
        .int()
        .positive()
        .default(90),
      STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_").optional(),
      WEBHOOK_FIRST_PARTY_WEB_URL: z.string().url().optional(),
      WEBHOOK_FIRST_PARTY_WEB_SECRET: z
        .string()
        .min(1)
        .refine(
          (value) => value.startsWith("whsec_") || value.length >= 16,
          "Use whsec_… (Standard Webhooks) or a base64 signing secret"
        )
        .optional(),
    },
    runtimeEnv: {
      WEBHOOK_DELIVERY_TIMEOUT_MS: process.env.WEBHOOK_DELIVERY_TIMEOUT_MS,
      WEBHOOK_SIGNATURE_TOLERANCE_SEC:
        process.env.WEBHOOK_SIGNATURE_TOLERANCE_SEC,
      WEBHOOK_DELIVERY_RETENTION_DAYS:
        process.env.WEBHOOK_DELIVERY_RETENTION_DAYS,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      WEBHOOK_FIRST_PARTY_WEB_URL: process.env.WEBHOOK_FIRST_PARTY_WEB_URL,
      WEBHOOK_FIRST_PARTY_WEB_SECRET:
        process.env.WEBHOOK_FIRST_PARTY_WEB_SECRET,
    },
  });
