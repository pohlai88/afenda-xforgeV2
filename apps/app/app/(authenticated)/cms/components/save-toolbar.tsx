"use client";

import type { CmsCollectionName } from "@repo/cms/writer";
import { Button } from "@repo/design-system/components/ui/button";
import Link from "next/link";

type SaveToolbarProperties = {
  collection: CmsCollectionName;
  locale: string;
  slug?: string;
  isDirty: boolean;
  isSaving: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  onDelete?: () => void;
  onSharePreview?: () => void;
  onOpenPublicPreview?: () => void;
};

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
      <Button asChild type="button" variant="outline">
        <Link href={`/cms/${collection}/${locale}/${slug}/preview`}>Preview</Link>
      </Button>
    ) : null}
    {slug && onSharePreview ? (
      <Button onClick={onSharePreview} type="button" variant="outline">
        Copy public preview link
      </Button>
    ) : null}
    {slug && onOpenPublicPreview ? (
      <Button onClick={onOpenPublicPreview} type="button" variant="outline">
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
