"use client";

import type { ContentStatus } from "@repo/cms/schemas";
import type { CmsCollectionName } from "@repo/cms/writer";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { Button } from "@repo/design-system/components/ui/button";
import { uploadCmsAsset } from "@/app/actions/cms/media";
import { useRef, useTransition } from "react";

type FrontmatterFormProperties = {
  collection: CmsCollectionName;
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
};

const setField = (
  values: Record<string, unknown>,
  key: string,
  value: unknown
): Record<string, unknown> => ({ ...values, [key]: value });

export const FrontmatterForm = ({
  collection,
  values,
  onChange,
}: FrontmatterFormProperties) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, startUploadTransition] = useTransition();

  const handleImageUpload = (file: File) => {
    startUploadTransition(async () => {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("collection", collection);
      const result = await uploadCmsAsset(formData);

      if (result.ok) {
        onChange(setField(values, "image", result.data));
      }
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="cms-title">Title</Label>
        <Input
          id="cms-title"
          onChange={(event) =>
            onChange(setField(values, "title", event.target.value))
          }
          value={String(values.title ?? "")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cms-status">Status</Label>
        <Select
          onValueChange={(value: ContentStatus) =>
            onChange(setField(values, "status", value))
          }
          value={String(values.status ?? "draft")}
        >
          <SelectTrigger id="cms-status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="cms-description">Description</Label>
        <Textarea
          id="cms-description"
          onChange={(event) =>
            onChange(setField(values, "description", event.target.value))
          }
          rows={3}
          value={String(values.description ?? "")}
        />
      </div>
      {collection === "blog" ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="cms-date">Date</Label>
            <Input
              id="cms-date"
              onChange={(event) =>
                onChange(setField(values, "date", event.target.value))
              }
              type="date"
              value={String(values.date ?? "").slice(0, 10)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cms-image-url">Image URL</Label>
            <Input
              id="cms-image-url"
              onChange={(event) =>
                onChange(
                  setField(values, "image", {
                    ...(typeof values.image === "object" && values.image !== null
                      ? (values.image as Record<string, unknown>)
                      : {}),
                    url: event.target.value,
                    width: 1200,
                    height: 630,
                    alt: null,
                  })
                )
              }
              value={
                typeof values.image === "object" &&
                values.image !== null &&
                "url" in values.image
                  ? String((values.image as { url: string }).url)
                  : ""
              }
            />
            <input
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  handleImageUpload(file);
                }
              }}
              ref={fileInputRef}
              type="file"
            />
            <Button
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              size="sm"
              type="button"
              variant="outline"
            >
              {isUploading ? "Uploading…" : "Upload image"}
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
};
