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
  disabled?: boolean;
  fieldValues: Record<string, PushFieldValue>;
  onFieldChange: (key: string, value: PushFieldValue) => void;
  onSubmit: () => void;
  template: PushTemplateDefinition | null;
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
      <p className="text-muted-foreground text-sm">
        Select a destination to load push fields.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {template.fields.map((field) => {
        const fieldId = `push-field-${field.key}`;
        const value = fieldValues[field.key];

        if (field.type === "textarea") {
          return (
            <div className="grid gap-2" key={field.key}>
              <Label htmlFor={fieldId}>
                {field.label}
                {field.required ? " *" : ""}
              </Label>
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
              <Label htmlFor={fieldId}>
                {field.label}
                {field.required ? " *" : ""}
              </Label>
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
              <Label htmlFor={fieldId}>
                {field.label}
                {field.required ? " *" : ""}
              </Label>
              <Popover
                onOpenChange={(next) => setDateFieldOpen(next ? field.key : null)}
                open={dateFieldOpen === field.key}
              >
                <PopoverTrigger asChild>
                  <Button id={fieldId} type="button" variant="secondary">
                    {typeof value === "string" && value ? value : `Set ${field.label.toLowerCase()}`}
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
                      setDateFieldOpen(null);
                    }}
                    selected={selectedDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          );
        }

        const inputType = field.type === "number" ? "number" : "text";

        return (
          <div className="grid gap-2" key={field.key}>
            <Label htmlFor={fieldId}>
              {field.label}
              {field.required ? " *" : ""}
            </Label>
            <Input
              id={fieldId}
              onChange={(event) => {
                const nextValue =
                  field.type === "number"
                    ? event.target.value === ""
                      ? null
                      : Number(event.target.value)
                    : event.target.value;
                onFieldChange(field.key, nextValue);
              }}
              type={inputType}
              value={
                typeof value === "number"
                  ? String(value)
                  : typeof value === "string"
                    ? value
                    : ""
              }
            />
          </div>
        );
      })}
      <Button disabled={disabled} onClick={onSubmit} type="button">
        Push
      </Button>
    </div>
  );
}
