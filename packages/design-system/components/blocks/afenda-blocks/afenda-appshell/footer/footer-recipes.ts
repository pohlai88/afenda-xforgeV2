import { appShellChromeSurfaceClass } from "../app-shell-recipes";

const appFooterShellClass = `flex h-(--app-shell-footer-height) max-h-(--app-shell-footer-height) shrink-0 items-center justify-between gap-4 px-2 py-0 ${appShellChromeSurfaceClass}`;

const appFooterCopyrightClass =
  "text-[length:var(--xforge-font-caption-size)] text-text-secondary";

const appFooterCopyrightBrandClass =
  "text-[length:var(--xforge-font-caption-size)] text-text-primary";

const appFooterLinksClass =
  "flex min-w-0 flex-wrap items-center justify-end gap-4";

const appFooterLinkClass =
  "text-[length:var(--xforge-font-caption-size)] text-text-primary transition-colors duration-80 hover:text-brand-primary";

export {
  appFooterCopyrightBrandClass,
  appFooterCopyrightClass,
  appFooterLinkClass,
  appFooterLinksClass,
  appFooterShellClass,
};
