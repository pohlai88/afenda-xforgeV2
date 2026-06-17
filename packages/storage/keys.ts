import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const strip = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  if (trimmed === "") {
    return undefined;
  }

  return trimmed.replace(/^["']|["']$/g, "");
};

export const keys = () =>
  createEnv({
    skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
    server: {
      BLOB_READ_WRITE_TOKEN: z.string().optional(),
      BLOB_STORE_ID: z.string().optional(),
      XFORGE_PUB_BLOB_READ_WRITE_TOKEN: z.string().optional(),
      XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN: z.string().optional(),
      XFORGE_PUB_STORE_ID: z.string().min(1).optional(),
      XFORGE_STORE_ID: z.string().min(1).optional(),
      XFROGE_READ_WRITE_TOKEN: z.string().optional(),
      XFROGE_STORE_ID: z.string().min(1).optional(),
    },
    runtimeEnv: {
      BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
      BLOB_STORE_ID: process.env.BLOB_STORE_ID,
      XFORGE_PUB_BLOB_READ_WRITE_TOKEN:
        process.env.XFORGE_PUB_BLOB_READ_WRITE_TOKEN,
      XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN:
        process.env.XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN,
      XFORGE_PUB_STORE_ID: process.env.XFORGE_PUB_STORE_ID,
      XFORGE_STORE_ID: process.env.XFORGE_STORE_ID,
      XFROGE_READ_WRITE_TOKEN: process.env.XFROGE_READ_WRITE_TOKEN,
      XFROGE_STORE_ID: process.env.XFROGE_STORE_ID,
    },
  });

export const resolvePublicBlobToken = (
  env: ReturnType<typeof keys> = keys()
): string | undefined =>
  strip(env.XFORGE_PUB_BLOB_READ_WRITE_TOKEN) ??
  strip(env.BLOB_READ_WRITE_TOKEN);

export const resolvePrivateBlobToken = (
  env: ReturnType<typeof keys> = keys()
): string | undefined =>
  strip(env.XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN) ??
  strip(env.XFROGE_READ_WRITE_TOKEN) ??
  strip(env.BLOB_READ_WRITE_TOKEN);

export const resolvePrivateStoreId = (
  env: ReturnType<typeof keys> = keys()
): string | undefined =>
  strip(env.XFORGE_STORE_ID) ?? strip(env.XFROGE_STORE_ID);

export const resolvePublicStoreId = (
  env: ReturnType<typeof keys> = keys()
): string | undefined => strip(env.XFORGE_PUB_STORE_ID);
