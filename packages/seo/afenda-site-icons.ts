import type { Metadata } from "next";

/** Paths under each app `public/` — aligned with afenda-Xforge-legacy workspace + SEO presets. */
export const AFENDA_SITE_ICONS = {
  appleTouchIcon: "/icons/afenda-icon-180-transparent.png",
  brandLockup: "/afenda-brand/afenda-combined-lockup-full-color-transparent.svg",
  favicon: "/favicon.ico",
  icon192: "/icons/afenda-icon-192-transparent.png",
  icon512: "/icons/afenda-icon-512-transparent.png",
  icon512Maskable: "/icons/afenda-icon-512-maskable.png",
  lynxOperator: "/icons/lynx-operator/lynx-operator.svg",
  manifest: "/site.webmanifest",
  workspaceBrandIcon: "/icons/afenda-icon-512-transparent.png",
} as const;

export const afendaSiteIconsMetadata = (): NonNullable<Metadata["icons"]> => ({
  apple: [
    {
      url: AFENDA_SITE_ICONS.appleTouchIcon,
      sizes: "180x180",
      type: "image/png",
    },
  ],
  icon: [
    { url: AFENDA_SITE_ICONS.favicon, sizes: "any" },
    {
      url: AFENDA_SITE_ICONS.icon192,
      sizes: "192x192",
      type: "image/png",
    },
    {
      url: AFENDA_SITE_ICONS.icon512,
      sizes: "512x512",
      type: "image/png",
    },
  ],
  shortcut: AFENDA_SITE_ICONS.favicon,
});
