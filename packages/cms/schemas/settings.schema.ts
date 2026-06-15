import { z } from "zod";

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1),
  tagline: z.string().min(1),
  socialLinks: z
    .array(
      z.object({
        label: z.string().min(1),
        href: z.string().url(),
      })
    )
    .default([]),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;
