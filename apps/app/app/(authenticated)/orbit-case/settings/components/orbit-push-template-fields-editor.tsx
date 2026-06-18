"use client";

import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@repo/design-system";
import type { PushTemplateDefinition } from "@repo/orbit-case";

type TemplateField = PushTemplateDefinition["fields"][number];

const FIELD_TYPES: TemplateField["type"][] = [
  "text",
  "textarea",
  "number",
  "date",
  "select",
];

const createEmptyField = (): TemplateField => ({
  key: "",
  label: "",
  required: false,
  type: "text",
});

interface OrbitPushTemplateFieldsEditorProps {
  fields: TemplateField[];
  onChange: (fields: TemplateField[]) => void;
}

export function OrbitPushTemplateFieldsEditor({
  fields,
  onChange,
}: OrbitPushTemplateFieldsEditorProps) {
  const updateField = (index: number, patch: Partial<TemplateField>) => {
    onChange(
      fields.map((field, fieldIndex) =>
        fieldIndex === index ? { ...field, ...patch } : field
      )
    );
  };

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-2">
        <Label>Template fields</Label>
        <Button
          onClick={() => onChange([...fields, createEmptyField()])}
          size="sm"
          type="button"
          variant="secondary"
        >
          Add field
        </Button>
      </div>
      {fields.length === 0 ? (
        <p className="text-muted-foreground text-sm">No fields yet.</p>
      ) : (
        fields.map((field, index) => (
          <article
            className="grid gap-3 rounded-md border p-3 md:grid-cols-2"
            key={`${field.key}-${index}`}
          >
            <div className="grid gap-2">
              <Label htmlFor={`field-key-${index}`}>Key</Label>
              <Input
                id={`field-key-${index}`}
                onChange={(event) =>
                  updateField(index, { key: event.target.value })
                }
                placeholder="title"
                value={field.key}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`field-label-${index}`}>Label</Label>
              <Input
                id={`field-label-${index}`}
                onChange={(event) =>
                  updateField(index, { label: event.target.value })
                }
                placeholder="Title"
                value={field.label}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`field-type-${index}`}>Type</Label>
              <Select
                onValueChange={(value) =>
                  updateField(index, { type: value as TemplateField["type"] })
                }
                value={field.type}
              >
                <SelectTrigger id={`field-type-${index}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor={`field-required-${index}`}>Required</Label>
              <Switch
                checked={field.required ?? false}
                id={`field-required-${index}`}
                onCheckedChange={(required) => updateField(index, { required })}
              />
            </div>
            {field.type === "select" ? (
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor={`field-options-${index}`}>
                  Options (comma-separated)
                </Label>
                <Input
                  id={`field-options-${index}`}
                  onChange={(event) =>
                    updateField(index, {
                      options: event.target.value
                        .split(",")
                        .map((option) => option.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="low, medium, high"
                  value={(field.options ?? []).join(", ")}
                />
              </div>
            ) : null}
            <div className="md:col-span-2">
              <Button
                onClick={() =>
                  onChange(fields.filter((_, fieldIndex) => fieldIndex !== index))
                }
                size="sm"
                type="button"
                variant="quiet"
              >
                Remove field
              </Button>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
