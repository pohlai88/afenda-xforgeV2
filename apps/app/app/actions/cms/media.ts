"use server";

import { randomUUID } from "node:crypto";
import { withEditor } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import { isCmsCollection } from "@repo/cms/writer";
import { put } from "@repo/storage";
import { z } from "zod";

const uploadSchema = z.object({
  collection: z.enum(["blog", "legal"]),
  filename: z.string().min(1),
  contentType: z.string().min(1),
  size: z.number().max(5 * 1024 * 1024),
});

export type CmsUploadedImage = {
  url: string;
  width: number;
  height: number;
  alt: string | null;
};

export const uploadCmsAsset = async (
  formData: FormData
): Promise<AuthActionResult<CmsUploadedImage>> =>
  withEditor(async () => {
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new Error("Missing file");
    }

    const parsed = uploadSchema.parse({
      collection: formData.get("collection"),
      filename: file.name,
      contentType: file.type,
      size: file.size,
    });

    if (!isCmsCollection(parsed.collection)) {
      throw new Error("Unknown collection");
    }

    if (!file.type.startsWith("image/")) {
      throw new Error("Only image uploads are supported");
    }

    const extension = parsed.filename.split(".").pop() ?? "jpg";
    const pathname = `cms/${parsed.collection}/${randomUUID()}.${extension}`;
    const blob = await put(pathname, file, {
      access: "public",
      contentType: parsed.contentType,
    });

    return {
      url: blob.url,
      width: 1200,
      height: 630,
      alt: null,
    };
  });
