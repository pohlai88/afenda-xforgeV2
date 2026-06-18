"use client";

import { blockRecipe } from "../../../block-recipes";
import { cn } from "../../../../../lib/utils";
import type { AfendaAppFooterProps } from "../app-shell-types";
import { APP_FOOTER_COPYRIGHT_HOLDER, APP_FOOTER_NAV_ITEMS } from "./footer-nav-catalog";
import {
  appFooterCopyrightBrandClass,
  appFooterCopyrightClass,
  appFooterLinkClass,
  appFooterLinksClass,
  appFooterShellClass,
} from "./footer-recipes";

export function AfendaAppFooter({
  children,
  className,
  copyrightHolder = APP_FOOTER_COPYRIGHT_HOLDER,
  links = APP_FOOTER_NAV_ITEMS,
  ...properties
}: AfendaAppFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(blockRecipe("blockShell"), appFooterShellClass, className)}
      data-slot="app-footer"
      {...properties}
    >
      {children ?? (
        <>
          <p className={cn(appFooterCopyrightClass)}>
            <span>{`${year}© `}</span>
            <span className={cn(appFooterCopyrightBrandClass)}>
              {copyrightHolder}
            </span>
          </p>
          <nav
            aria-label="Footer"
            className={cn(appFooterLinksClass)}
            data-slot="app-footer-links"
          >
            {links.map((item) => (
              <a
                className={cn(appFooterLinkClass)}
                data-slot="app-footer-link"
                href={item.href}
                key={item.id}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </>
      )}
    </footer>
  );
}
