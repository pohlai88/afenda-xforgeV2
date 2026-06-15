import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
    server: {
      CMS_WRITE_MODE: z.enum(["local", "github"]).default("local"),
      CMS_READ_MODE: z.enum(["local", "github"]).optional(),
      CMS_GITHUB_TOKEN: z.string().optional(),
      CMS_GITHUB_REPO: z.string().optional(),
      CMS_GITHUB_BRANCH: z.string().default("main"),
      CMS_PREVIEW_SECRET: z.string().optional(),
    },
    runtimeEnv: {
      CMS_WRITE_MODE: process.env.CMS_WRITE_MODE,
      CMS_READ_MODE: process.env.CMS_READ_MODE,
      CMS_GITHUB_TOKEN: process.env.CMS_GITHUB_TOKEN,
      CMS_GITHUB_REPO: process.env.CMS_GITHUB_REPO,
      CMS_GITHUB_BRANCH: process.env.CMS_GITHUB_BRANCH,
      CMS_PREVIEW_SECRET: process.env.CMS_PREVIEW_SECRET,
    },
  });
