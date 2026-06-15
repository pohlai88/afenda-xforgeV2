import "server-only";

import { keys } from "./keys";
import { normalizeLocale } from "./locale";
import type { CmsRevalidateInput } from "./revalidate";

type NotifyWebContentChangedInput = CmsRevalidateInput & {
  webUrl: string;
};

export const notifyWebContentChanged = async ({
  collection,
  locale,
  slug,
  webUrl,
}: NotifyWebContentChangedInput): Promise<void> => {
  const secret = keys().CMS_REVALIDATE_SECRET;

  if (!secret) {
    console.warn(
      "[cms] CMS_REVALIDATE_SECRET is not set; skipping web revalidation"
    );
    return;
  }

  if (!webUrl) {
    console.warn("[cms] webUrl is not set; skipping web revalidation");
    return;
  }

  const endpoint = new URL("/api/revalidate", webUrl);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collection,
        locale: locale ? normalizeLocale(locale) : undefined,
        slug,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(
        `[cms] Web revalidation failed: ${response.status} ${body}`
      );
    }
  } catch (error) {
    console.error("[cms] Web revalidation request failed:", error);
  }
};
