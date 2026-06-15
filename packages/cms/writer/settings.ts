import "server-only";

import {
  type SiteSettings,
  siteSettingsSchema,
} from "../schemas/settings.schema";
import { readSettingsRaw, writeSettingsRaw } from "../settings-io";

export type SettingsSaveResult =
  | { ok: true; path: string }
  | {
      ok: false;
      code: "validation" | "io" | "github";
      message: string;
    };

export const readSiteSettings = async (): Promise<SiteSettings> => {
  const raw = await readSettingsRaw();
  return siteSettingsSchema.parse(JSON.parse(raw));
};

export const saveSiteSettings = async (
  input: SiteSettings
): Promise<SettingsSaveResult> => {
  const parsed = siteSettingsSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "validation",
      message: parsed.error.issues
        .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
        .join("; "),
    };
  }

  try {
    const content = `${JSON.stringify(parsed.data, null, 2)}\n`;
    const { path } = await writeSettingsRaw(content);

    return { ok: true, path };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save settings";

    return {
      ok: false,
      code: message.includes("GitHub") ? "github" : "io",
      message,
    };
  }
};
