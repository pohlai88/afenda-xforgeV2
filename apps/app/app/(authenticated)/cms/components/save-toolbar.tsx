"use client";

import type { CmsCollectionName } from "@repo/cms/writer";
import { Button } from "@repo/design-system/design-system";
import Link from "next/link";

interface SaveToolbarProperties {
  collection: CmsCollectionName;
  isDirty: boolean;
  isSaving: boolean;
  locale: string;
  onDelete?: () => void;
  onOpenPublicPreview?: () => void;
  onPublish: () => void;
  onSaveDraft: () => void;
  onSharePreview?: () => void;
  slug?: string;
}

export const SaveToolbar = ({
  collection,
  locale,
  slug,
  isDirty,
  isSaving,
  onSaveDraft,
  onPublish,
  onDelete,
  onSharePreview,
  onOpenPublicPreview,
}: SaveToolbarProperties) => (
  <div className="flex flex-wrap items-center gap-2 border-b pb-4">
    <Button disabled={isSaving || !isDirty} onClick={onSaveDraft} type="button">
      {isSaving ? "Saving…" : "Save draft"}
    </Button>
    <Button
      disabled={isSaving || !slug}
      onClick={onPublish}
      type="button"
      variant="secondary"
    >
      Publish
    </Button>
    {slug ? (
      <Button asChild type="button" variant="secondary">
        <Link href={`/cms/${collection}/${locale}/${slug}/preview`}>
          Preview
        </Link>
      </Button>
    ) : null}
    {slug && onSharePreview ? (
      <Button onClick={onSharePreview} type="button" variant="secondary">
        Copy public preview link
      </Button>
    ) : null}
    {slug && onOpenPublicPreview ? (
      <Button onClick={onOpenPublicPreview} type="button" variant="secondary">
        Open public preview
      </Button>
    ) : null}
    {slug && onDelete ? (
      <Button
        disabled={isSaving}
        onClick={onDelete}
        type="button"
        variant="destructive"
      >
        Delete
      </Button>
    ) : null}
    {isDirty ? (
      <span className="text-muted-foreground text-xs">Unsaved changes</span>
    ) : null}
  </div>
);
