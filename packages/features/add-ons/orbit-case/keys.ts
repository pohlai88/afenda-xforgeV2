import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    server: {
      ORBIT_CASE_STORAGE_PREFIX: z.string().min(1).default("orbit-case"),
    },
    runtimeEnv: {
      ORBIT_CASE_STORAGE_PREFIX: process.env.ORBIT_CASE_STORAGE_PREFIX,
    },
    skipValidation:
      process.env.SKIP_ENV_VALIDATION === "true" ||
      process.env.SKIP_ENV_VALIDATION === "1",
  });
