import type { TocItem } from "../types";

type TableOfContentsProperties = {
  items: TocItem[];
};

export const TableOfContents = ({ items }: TableOfContentsProperties) => (
  <ol className="flex list-none flex-col gap-2 text-sm">
    {items.map((item) => (
      <li
        className={item.level === 3 ? "pl-3" : undefined}
        key={item.id}
      >
        <a
          className="line-clamp-3 flex rounded-sm text-foreground text-sm underline decoration-foreground/0 transition-colors hover:decoration-foreground/50"
          href={`#${item.id}`}
        >
          {item.title}
        </a>
      </li>
    ))}
  </ol>
);
