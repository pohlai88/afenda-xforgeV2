"use server";

import { withEditor } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import {
  buildCmsSettingsUpdatedEvent,
  CMS_EVENT_SETTINGS_UPDATED,
} from "@repo/cms/events";
import {
  CMS_CACHE_TAG_ALL,
  CMS_SETTINGS_TAG,
} from "@repo/cms/revalidate";
import {
  readSiteSettings,
  saveSiteSettings,
  type SettingsSaveResult,
} from "@repo/cms/writer";
import type { SiteSettings } from "@repo/cms/settings";
import { siteSettingsSchema } from "@repo/cms/schemas";
import { revalidatePath, revalidateTag } from "next/cache";
import { emitOrgEvent } from "@/lib/emit-org-event";

export type { SiteSettings };

export const getSettings = async (): Promise<AuthActionResult<SiteSettings>> =>
  withEditor(async () => readSiteSettings());

export const updateSettings = async (
  input: SiteSettings
): Promise<AuthActionResult<SettingsSaveResult>> =>
  withEditor(async ({ orgId }) => {
    const parsed = siteSettingsSchema.safeParse(input);

    if (!parsed.success) {
      throw new Error(
        parsed.error.issues
          .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
          .join("; ")
      );
    }

    const result = await saveSiteSettings(parsed.data);

    if (result.ok) {
      revalidatePath("/cms/settings");
      revalidateTag(CMS_CACHE_TAG_ALL, "max");
      revalidateTag(CMS_SETTINGS_TAG, "max");

      await emitOrgEvent(
        orgId,
        CMS_EVENT_SETTINGS_UPDATED,
        buildCmsSettingsUpdatedEvent()
      );
    }

    return result;
  });
