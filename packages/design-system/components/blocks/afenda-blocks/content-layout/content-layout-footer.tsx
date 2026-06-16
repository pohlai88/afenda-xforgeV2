"use client";

import { cn } from "@repo/design-system/lib/utils";
import {
  DEFAULT_CONTENT_LAYOUT_FOOTER_COPYRIGHT,
  EMPTY_CONTENT_LAYOUT_FOOTER_LINKS,
} from "./content-layout-constants";
import { contentLayoutFooterClass } from "./content-layout-recipes";
import type { ContentLayoutFooterProps } from "./content-layout-types";

export function ContentLayoutFooter({
  className,
  copyright = DEFAULT_CONTENT_LAYOUT_FOOTER_COPYRIGHT,
  links = EMPTY_CONTENT_LAYOUT_FOOTER_LINKS,
}: ContentLayoutFooterProps) {
  return (
    <footer
      className={cn(contentLayoutFooterClass, className)}
      data-slot="content-layout-footer"
    >
      <span className="min-w-0 truncate tabular-nums">{copyright}</span>
      {links.length > 0 ? (
        <nav aria-label="Footer links" className="flex shrink-0 items-center gap-4">
          {links.map((link) => (
            <a
              className="text-text-secondary transition-colors duration-150 hover:text-text-primary motion-reduce:transition-none"
              href={link.href}
              key={link.id}
            >
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}
    </footer>
  );
}
