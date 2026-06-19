"use client";

import { cn } from "../../../../../lib/utils";
import { blockRecipe } from "../../../block-recipes";
import type { AfendaAppFooterProps } from "../app-shell-types";
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
  copyrightHolder,
  links = [],
  ...properties
}: AfendaAppFooterProps) {
  const year = new Date().getFullYear();
  const showCopyright = Boolean(copyrightHolder);
  const showLinks = links.length > 0;

  if (children) {
    return (
      <footer
        className={cn(
          blockRecipe("blockShell"),
          appFooterShellClass,
          className
        )}
        data-slot="app-footer"
        {...properties}
      >
        {children}
      </footer>
    );
  }

  if (!(showCopyright || showLinks)) {
    return (
      <footer
        className={cn(
          blockRecipe("blockShell"),
          appFooterShellClass,
          className
        )}
        data-slot="app-footer"
        {...properties}
      />
    );
  }

  return (
    <footer
      className={cn(blockRecipe("blockShell"), appFooterShellClass, className)}
      data-slot="app-footer"
      {...properties}
    >
      {showCopyright ? (
        <p className={cn(appFooterCopyrightClass)}>
          <span>{`${year}© `}</span>
          <span className={cn(appFooterCopyrightBrandClass)}>
            {copyrightHolder}
          </span>
        </p>
      ) : null}
      {showLinks ? (
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
      ) : null}
    </footer>
  );
}
