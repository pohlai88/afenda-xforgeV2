import { DEFAULT_LOCALE } from "@repo/cms/locale";
import { collectionLabels, type CmsCollectionName } from "@repo/cms/writer";
import Link from "next/link";
import { cn } from "@repo/design-system/lib/utils";

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
