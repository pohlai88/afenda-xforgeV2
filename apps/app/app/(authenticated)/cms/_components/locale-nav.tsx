import { cmsLocales } from "@repo/cms/locale";
import { cn } from "@repo/design-system/lib/utils";
import Link from "next/link";

interface LocaleNavProperties {
  collection: string;
  currentLocale: string;
}

export const LocaleNav = ({
  collection,
  currentLocale,
}: LocaleNavProperties) => (
  <nav aria-label="Content locales" className="flex flex-wrap gap-2">
    {cmsLocales.map((locale) => (
      <Link
        className={cn(
          "rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted",
          locale === currentLocale && "bg-muted font-medium"
        )}
        href={`/cms/${collection}/${locale}`}
        key={locale}
      >
        {locale.toUpperCase()}
      </Link>
    ))}
  </nav>
);
