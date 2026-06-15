import { DEFAULT_LOCALE } from "@repo/cms/locale";
import { type CmsCollectionName, collectionLabels } from "@repo/cms/writer";
import { cn } from "@repo/design-system/lib/utils";
import Link from "next/link";

const collections = Object.keys(collectionLabels) as CmsCollectionName[];

export const CollectionNav = () => (
  <nav aria-label="CMS collections" className="flex flex-wrap gap-2">
    <Link
      className={cn(
        "rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
      )}
      href="/cms"
    >
      Overview
    </Link>
    <Link
      className={cn(
        "rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
      )}
      href="/cms/settings"
    >
      Settings
    </Link>
    {collections.map((collection) => (
      <Link
        className={cn(
          "rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
        )}
        href={`/cms/${collection}/${DEFAULT_LOCALE}`}
        key={collection}
      >
        {collectionLabels[collection]}
      </Link>
    ))}
  </nav>
);
