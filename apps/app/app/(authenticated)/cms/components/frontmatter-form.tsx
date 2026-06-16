"use client";

import { getCollectionFrontmatterFields } from "@repo/cms/collections";
import type { ContentStatus } from "@repo/cms/schemas";
import type { CmsCollectionName } from "@repo/cms/writer";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@repo/design-system/design-system";
import { useRef, useTransition } from "react";
import { uploadCmsAsset } from "@/app/actions/cms/media";

interface FrontmatterFormProperties {
  collection: CmsCollectionName;
  onChange: (values: Record<string, unknown>) => void;
  values: Record<string, unknown>;
}

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
  const fields = getCollectionFrontmatterFields(collection);

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
      {fields.map((field) => {
        const fieldId = `cms-${field.key}`;

        if (field.type === "status") {
          return (
            <div className="space-y-2" key={field.key}>
              <Label htmlFor={fieldId}>{field.label}</Label>
              <Select
                onValueChange={(value: ContentStatus) =>
                  onChange(setField(values, field.key, value))
                }
                value={String(values[field.key] ?? "draft")}
              >
                <SelectTrigger id={fieldId}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          );
        }

        if (field.type === "textarea") {
          return (
            <div className="space-y-2 md:col-span-2" key={field.key}>
              <Label htmlFor={fieldId}>{field.label}</Label>
              <Textarea
                id={fieldId}
                onChange={(event) =>
                  onChange(setField(values, field.key, event.target.value))
                }
                rows={3}
                value={String(values[field.key] ?? "")}
              />
            </div>
          );
        }

        if (field.type === "date") {
          return (
            <div className="space-y-2" key={field.key}>
              <Label htmlFor={fieldId}>{field.label}</Label>
              <Input
                id={fieldId}
                onChange={(event) =>
                  onChange(setField(values, field.key, event.target.value))
                }
                type="date"
                value={String(values[field.key] ?? "").slice(0, 10)}
              />
            </div>
          );
        }

        if (field.type === "image") {
          return (
            <div className="space-y-2" key={field.key}>
              <Label htmlFor={fieldId}>{field.label} URL</Label>
              <Input
                id={fieldId}
                onChange={(event) =>
                  onChange(
                    setField(values, field.key, {
                      ...(typeof values[field.key] === "object" &&
                      values[field.key] !== null
                        ? (values[field.key] as Record<string, unknown>)
                        : {}),
                      url: event.target.value,
                      width: 1200,
                      height: 630,
                      alt: null,
                    })
                  )
                }
                value={
                  typeof values[field.key] === "object" &&
                  values[field.key] !== null &&
                  "url" in (values[field.key] as object)
                    ? String((values[field.key] as { url: string }).url)
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
                variant="secondary"
              >
                {isUploading ? "Uploading…" : "Upload image"}
              </Button>
            </div>
          );
        }

        return (
          <div className="space-y-2" key={field.key}>
            <Label htmlFor={fieldId}>{field.label}</Label>
            <Input
              id={fieldId}
              onChange={(event) =>
                onChange(setField(values, field.key, event.target.value))
              }
              value={String(values[field.key] ?? "")}
            />
          </div>
        );
      })}
    </div>
  );
};
