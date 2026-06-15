import "server-only";

import { unstable_cache } from "next/cache";
import {
  CMS_CACHE_TAG_ALL,
  CMS_SETTINGS_TAG,
} from "./loader/cached-reads";
import { readSettingsRaw } from "./settings-io";
import {
  siteSettingsSchema,
  type SiteSettings,
} from "./schemas/settings.schema";

export type { SiteSettings };

const loadSiteSettings = async (): Promise<SiteSettings> => {
  const raw = await readSettingsRaw();
  return siteSettingsSchema.parse(JSON.parse(raw));
};

export const getSiteSettings = unstable_cache(
  loadSiteSettings,
  ["cms", "site-settings"],
  { tags: [CMS_CACHE_TAG_ALL, CMS_SETTINGS_TAG] }
);
