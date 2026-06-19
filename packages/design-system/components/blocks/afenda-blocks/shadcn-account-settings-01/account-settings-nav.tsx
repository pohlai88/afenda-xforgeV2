"use client";

import { cn } from "../../../../lib/utils";
import { blockRecipe } from "../../block-recipes";
import {
  accountSettingsNavGroupLabelClass,
  accountSettingsNavInnerClass,
  accountSettingsNavItemActiveClass,
  accountSettingsNavItemClass,
  accountSettingsNavItemIconClass,
  accountSettingsNavShellClass,
} from "./account-settings-recipes";

type RenderLinkFn = (props: {
  href: string;
  className: string;
  children: React.ReactNode;
  "aria-current"?: "page";
}) => React.ReactNode;

export interface AccountSettingsNavItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly icon?: React.ElementType;
}

export interface AccountSettingsNavGroup {
  readonly label: string;
  readonly items: readonly AccountSettingsNavItem[];
}

export interface AccountSettingsNavProps {
  readonly groups: readonly AccountSettingsNavGroup[];
  readonly currentHref: string;
  readonly renderLink?: RenderLinkFn;
}

const defaultRenderLink: RenderLinkFn = ({
  "aria-current": ariaCurrent,
  children,
  className,
  href,
}) => (
  <a aria-current={ariaCurrent} className={className} href={href}>
    {children}
  </a>
);

export function AccountSettingsNav({
  currentHref,
  groups,
  renderLink,
}: AccountSettingsNavProps) {
  const resolvedRenderLink: RenderLinkFn = renderLink ?? defaultRenderLink;
  return (
    <nav
      aria-label="Account settings navigation"
      className={cn(blockRecipe("blockShell"), accountSettingsNavShellClass)}
      data-slot="account-settings-nav"
    >
      <div className={cn(accountSettingsNavInnerClass)}>
        {groups.map((group) => (
          <div className="contents md:block md:mb-4 md:last:mb-0" key={group.label}>
            <p className={cn(accountSettingsNavGroupLabelClass)}>
              {group.label}
            </p>
            {group.items.map((item) => {
              const isActive = currentHref === item.href;
              const Icon = item.icon;

              return resolvedRenderLink({
                "aria-current": isActive ? "page" : undefined,
                children: (
                  <>
                    {Icon && (
                      <Icon className={cn(accountSettingsNavItemIconClass)} />
                    )}
                    <span>{item.label}</span>
                  </>
                ),
                className: cn(
                  isActive
                    ? accountSettingsNavItemActiveClass
                    : accountSettingsNavItemClass
                ),
                href: item.href,
              });
            })}
          </div>
        ))}
      </div>
    </nav>
  );
}
