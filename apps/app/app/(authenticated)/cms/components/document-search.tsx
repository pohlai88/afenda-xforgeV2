"use client";

import type { CmsLocale } from "@repo/cms/locale";
import type { CmsCollectionName } from "@repo/cms/writer";
import { Badge, Input } from "@repo/design-system/design-system";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { searchDocuments } from "@/app/actions/cms/documents";

interface DocumentSearchProperties {
  collection: CmsCollectionName;
  locale: CmsLocale;
}

interface SearchResult {
  description: string | null;
  rank: number;
  slug: string;
  status: string;
  title: string;
}

const SEARCH_DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 2;

export const DocumentSearch = ({
  collection,
  locale,
}: DocumentSearchProperties) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setError(null);
      return;
    }

    startTransition(async () => {
      setError(null);
      const response = await searchDocuments(
        collection,
        locale,
        debouncedQuery
      );

      if (!response.ok) {
        setResults([]);
        setError(response.error);
        return;
      }

      setResults(response.data);
    });
  }, [collection, debouncedQuery, locale]);

  const showResults =
    debouncedQuery.length >= MIN_QUERY_LENGTH &&
    (results.length > 0 || isPending);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative max-w-md">
        <Input
          aria-label="Search documents"
          autoComplete="off"
          disabled={isPending}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search published content in Postgres mirror…"
          type="search"
          value={query}
        />
      </div>

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}

      {debouncedQuery.length > 0 && debouncedQuery.length < MIN_QUERY_LENGTH ? (
        <p className="text-muted-foreground text-sm">
          Type at least {MIN_QUERY_LENGTH} characters to search.
        </p>
      ) : null}

      {showResults ? (
        <ul
          aria-busy={isPending}
          aria-label="Search results"
          className="divide-y rounded-lg border"
        >
          {isPending && results.length === 0 ? (
            <li className="p-4 text-muted-foreground text-sm">Searching…</li>
          ) : null}

          {results.map((result) => (
            <li key={result.slug}>
              <Link
                className="flex items-start justify-between gap-3 p-4 hover:bg-muted/50"
                href={`/cms/${collection}/${locale}/${result.slug}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{result.title}</p>
                  {result.description ? (
                    <p className="truncate text-muted-foreground text-sm">
                      {result.description}
                    </p>
                  ) : null}
                </div>
                <Badge
                  tone={result.status === "published" ? "positive" : "neutral"}
                  variant="soft"
                >
                  {result.status}
                </Badge>
              </Link>
            </li>
          ))}

          {!isPending && results.length === 0 ? (
            <li className="p-4 text-muted-foreground text-sm">
              No matches for &ldquo;{debouncedQuery}&rdquo;.
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
};
