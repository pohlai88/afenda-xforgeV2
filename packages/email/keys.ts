import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const normalizeResendFrom = (value: unknown): unknown => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return undefined;
  }

  if (trimmed.includes("<") && trimmed.includes(">")) {
    const match = trimmed.match(/<([^>]+)>/);

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return trimmed;
};

export const keys = () =>
  createEnv({
    skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
    server: {
      RESEND_FROM: z.preprocess(
        normalizeResendFrom,
        z.string().email().optional()
      ),
      RESEND_TOKEN: z.string().startsWith("re_").optional(),
    },
    runtimeEnv: {
      RESEND_FROM: process.env.RESEND_FROM,
      RESEND_TOKEN: process.env.RESEND_TOKEN,
    },
  });
