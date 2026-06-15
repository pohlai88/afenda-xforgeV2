"use client";

import type { CmsLocale } from "@repo/cms/locale";
import type { CmsCollectionName } from "@repo/cms/writer";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  createPreviewLink,
  deleteDocument,
  saveDocument,
} from "@/app/actions/cms/documents";
import { FrontmatterForm } from "./frontmatter-form";
import { MdxEditor } from "./mdx-editor";
import { SaveToolbar } from "./save-toolbar";

type DocumentEditorProperties = {
  collection: CmsCollectionName;
  locale: CmsLocale;
  initialSlug?: string;
  initialFrontmatter: Record<string, unknown>;
  initialBody: string;
};

export const DocumentEditor = ({
  collection,
  locale,
  initialSlug,
  initialFrontmatter,
  initialBody,
}: DocumentEditorProperties) => {
  const router = useRouter();
  const [slug, setSlug] = useState(initialSlug);
  const [frontmatter, setFrontmatter] = useState(initialFrontmatter);
  const [body, setBody] = useState(initialBody);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewFeedback, setPreviewFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const persist = (nextStatus?: "draft" | "published") => {
    startTransition(async () => {
      setError(null);
      const result = await saveDocument({
        collection,
        locale,
        slug,
        frontmatter: {
          ...frontmatter,
          ...(nextStatus ? { status: nextStatus } : {}),
        },
        body,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (!result.data.ok) {
        setError(result.data.message);
        return;
      }

      setIsDirty(false);
      setSlug(result.data.slug);

      if (nextStatus) {
        setFrontmatter((current) => ({ ...current, status: nextStatus }));
      }

      if (!initialSlug || initialSlug !== result.data.slug) {
        router.replace(`/cms/${collection}/${locale}/${result.data.slug}`);
      } else {
        router.refresh();
      }
    });
  };

  const handlePublish = () => {
    persist("published");
  };

  const handleSharePreview = () => {
    if (!slug) {
      return;
    }

    startTransition(async () => {
      setPreviewFeedback(null);
      const result = await createPreviewLink(collection, locale, slug);

      if (!(result.ok && result.data.url)) {
        setError(result.ok ? "Preview token unavailable" : result.error);
        return;
      }

      await navigator.clipboard.writeText(result.data.url);
      setPreviewFeedback("Public preview link copied.");
    });
  };

  const handleOpenPublicPreview = () => {
    if (!slug) {
      return;
    }

    startTransition(async () => {
      setPreviewFeedback(null);
      const result = await createPreviewLink(collection, locale, slug);

      if (!(result.ok && result.data.url)) {
        setError(result.ok ? "Preview token unavailable" : result.error);
        return;
      }

      window.open(result.data.url, "_blank", "noopener,noreferrer");
    });
  };

  const handleDelete = () => {
    if (!slug) {
      return;
    }

    if (!window.confirm(`Delete "${slug}"? This cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteDocument(collection, locale, slug);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (!result.data.ok) {
        setError(result.data.message);
        return;
      }

      router.push(`/cms/${collection}/${locale}`);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <SaveToolbar
        collection={collection}
        isDirty={isDirty}
        isSaving={isPending}
        locale={locale}
        onDelete={slug ? handleDelete : undefined}
        onOpenPublicPreview={slug ? handleOpenPublicPreview : undefined}
        onPublish={handlePublish}
        onSaveDraft={() => persist("draft")}
        onSharePreview={slug ? handleSharePreview : undefined}
        slug={slug}
      />
      {previewFeedback ? (
        <p className="text-muted-foreground text-sm">{previewFeedback}</p>
      ) : null}
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <FrontmatterForm
        collection={collection}
        onChange={(values) => {
          setFrontmatter(values);
          setIsDirty(true);
        }}
        values={frontmatter}
      />
      <MdxEditor
        onChange={(value) => {
          setBody(value);
          setIsDirty(true);
        }}
        value={body}
      />
    </div>
  );
};
