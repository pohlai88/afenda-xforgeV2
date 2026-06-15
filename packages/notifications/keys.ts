import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
    server: {
      NOVU_SECRET_KEY: z.string().optional(),
    },
    client: {
      NEXT_PUBLIC_NOVU_APP_ID: z.string().optional(),
    },
    runtimeEnv: {
      NOVU_SECRET_KEY: process.env.NOVU_SECRET_KEY,
      NEXT_PUBLIC_NOVU_APP_ID: process.env.NEXT_PUBLIC_NOVU_APP_ID,
    },
  });
