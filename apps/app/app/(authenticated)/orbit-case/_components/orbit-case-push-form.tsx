"use client";

import {
  Button,
  Calendar,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@repo/design-system";
import type { PushTemplateDefinition } from "@repo/orbit-case";
import { useState } from "react";

type PushFieldValue = string | number | boolean | null;

interface OrbitCasePushFormProps {
  readonly disabled?: boolean;
  readonly fieldValues: Record<string, PushFieldValue>;
  readonly onFieldChange: (key: string, value: PushFieldValue) => void;
  readonly onSubmit: () => void;
  readonly template: PushTemplateDefinition | null;
}

type PushFieldDef = PushTemplateDefinition["fields"][number];

interface PushFieldItemProps {
  readonly dateFieldOpen: string | null;
  readonly field: PushFieldDef;
  readonly onDateFieldOpenChange: (key: string | null) => void;
  readonly onFieldChange: (key: string, value: PushFieldValue) => void;
  readonly value: PushFieldValue;
}

function getInputValue(value: PushFieldValue): string {
  if (typeof value === "number") {
    return String(value);
  }
  if (typeof value === "string") {
    return value;
  }
  return "";
}

function getNumberInputValue(raw: string): number | null {
  if (raw === "") {
    return null;
  }
  return Number(raw);
}

function PushFieldItem({
  dateFieldOpen,
  field,
  onDateFieldOpenChange,
  onFieldChange,
  value,
}: PushFieldItemProps) {
  const fieldId = `push-field-${field.key}`;
  const labelText = `${field.label}${field.required ? " *" : ""}`;

  if (field.type === "textarea") {
    return (
      <div className="grid gap-2" key={field.key}>
        <Label htmlFor={fieldId}>{labelText}</Label>
        <Textarea
          id={fieldId}
          onChange={(event) => onFieldChange(field.key, event.target.value)}
          rows={3}
          value={typeof value === "string" ? value : ""}
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="grid gap-2" key={field.key}>
        <Label htmlFor={fieldId}>{labelText}</Label>
        <Select
          onValueChange={(next) => onFieldChange(field.key, next)}
          value={typeof value === "string" ? value : ""}
        >
          <SelectTrigger id={fieldId}>
            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (field.type === "date") {
    const selectedDate =
      typeof value === "string" && value
        ? new Date(`${value}T00:00:00`)
        : undefined;

    return (
      <div className="grid gap-2" key={field.key}>
        <Label htmlFor={fieldId}>{labelText}</Label>
        <Popover
          onOpenChange={(next) =>
            onDateFieldOpenChange(next ? field.key : null)
          }
          open={dateFieldOpen === field.key}
        >
          <PopoverTrigger asChild>
            <Button id={fieldId} type="button" variant="secondary">
              {typeof value === "string" && value
                ? value
                : `Set ${field.label.toLowerCase()}`}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              onSelect={(date) => {
                onFieldChange(
                  field.key,
                  date ? date.toISOString().slice(0, 10) : null
                );
                onDateFieldOpenChange(null);
              }}
              selected={selectedDate}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className="grid gap-2" key={field.key}>
      <Label htmlFor={fieldId}>{labelText}</Label>
      <Input
        id={fieldId}
        onChange={(event) => {
          const nextValue =
            field.type === "number"
              ? getNumberInputValue(event.target.value)
              : event.target.value;
          onFieldChange(field.key, nextValue);
        }}
        type={field.type === "number" ? "number" : "text"}
        value={getInputValue(value)}
      />
    </div>
  );
}

export function OrbitCasePushForm({
  disabled = false,
  fieldValues,
  onFieldChange,
  onSubmit,
  template,
}: OrbitCasePushFormProps) {
  const [dateFieldOpen, setDateFieldOpen] = useState<string | null>(null);

  if (!template) {
    return (
      <p className="text-sm text-text-secondary">
        Select a destination to load push fields.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {template.fields.map((field) => (
        <PushFieldItem
          dateFieldOpen={dateFieldOpen}
          field={field}
          key={field.key}
          onDateFieldOpenChange={setDateFieldOpen}
          onFieldChange={onFieldChange}
          value={fieldValues[field.key] ?? null}
        />
      ))}
      <Button disabled={disabled} onClick={onSubmit} type="button">
        Push
      </Button>
    </div>
  );
}
