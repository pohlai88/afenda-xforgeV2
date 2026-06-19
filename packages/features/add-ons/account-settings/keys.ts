import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    server: {
      /** When set, overrides staged rollout for account settings features. */
      ACCOUNT_SETTINGS_ENABLED: z.enum(["true", "false"]).optional(),
    },
    runtimeEnv: {
      ACCOUNT_SETTINGS_ENABLED: process.env.ACCOUNT_SETTINGS_ENABLED,
    },
    skipValidation:
      process.env.SKIP_ENV_VALIDATION === "true" ||
      process.env.SKIP_ENV_VALIDATION === "1",
  });
