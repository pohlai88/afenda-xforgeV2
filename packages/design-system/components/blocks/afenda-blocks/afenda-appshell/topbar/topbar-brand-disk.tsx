"use client";

import { blockRecipe } from "../../../block-recipes";
import { cn } from "../../../../../lib/utils";
import { APP_TOPBAR_BRAND_ICON } from "./topbar-constants";
import {
  topbarBrandDiskImageClass,
  topbarBrandDiskShellClass,
} from "./topbar-recipes";
import type { TopbarBrandDiskProps } from "./topbar-types";

const BRAND_DISK_SIZE_PX = 30;

export function TopbarBrandDisk({
  className,
  darkIconSrc = APP_TOPBAR_BRAND_ICON.dark,
  homeHref = "/dashboard",
  lightIconSrc = APP_TOPBAR_BRAND_ICON.light,
}: TopbarBrandDiskProps) {
  const shellClass = cn(
    blockRecipe("blockShell"),
    topbarBrandDiskShellClass,
    className
  );

  const images = (
    <>
      <img
        alt=""
        className={cn(topbarBrandDiskImageClass, "dark:hidden")}
        decoding="sync"
        height={BRAND_DISK_SIZE_PX}
        src={lightIconSrc}
        width={BRAND_DISK_SIZE_PX}
      />
      <img
        alt=""
        className={cn(topbarBrandDiskImageClass, "hidden dark:block")}
        decoding="sync"
        height={BRAND_DISK_SIZE_PX}
        src={darkIconSrc}
        width={BRAND_DISK_SIZE_PX}
      />
    </>
  );

  if (homeHref) {
    return (
      <a
        aria-label="Afenda home"
        className={cn(shellClass, "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring")}
        data-slot="app-topbar-brand-disk"
        href={homeHref}
      >
        {images}
      </a>
    );
  }

  return (
    <span className={cn(shellClass)} data-slot="app-topbar-brand-disk">
      {images}
    </span>
  );
}
