"use client";

import type { AccountSettingsNavProps } from "@repo/design-system";
import Link from "next/link";

export const renderAccountSettingsLink: NonNullable<
  AccountSettingsNavProps["renderLink"]
> = ({ "aria-current": ariaCurrent, children, className, href }) => (
  <Link aria-current={ariaCurrent} className={className} href={href}>
    {children}
  </Link>
);
