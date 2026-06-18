"use client";

import {
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design-system";
import { cn } from "@repo/design-system/lib/utils";
import { useEffect, useState, useTransition } from "react";
import {
  getOrgMemberOption,
  searchOrgMemberOptions,
  type OrgMemberOption,
} from "@/app/actions/users/search";

interface OrgMemberComboboxProps {
  "aria-label": string;
  className?: string;
  id?: string;
  onValueChange: (userId: string | null) => void;
  placeholder?: string;
  value: string | null;
}

export function OrgMemberCombobox({
  "aria-label": ariaLabel,
  className,
  id,
  onValueChange,
  placeholder = "Search members…",
  value,
}: OrgMemberComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<OrgMemberOption[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!value) {
      setSelectedLabel(null);
      return;
    }

    startTransition(async () => {
      const result = await getOrgMemberOption(value);

      if (result.ok && result.data) {
        setSelectedLabel(result.data.name);
      }
    });
  }, [value]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timeout = window.setTimeout(() => {
      startTransition(async () => {
        const result = await searchOrgMemberOptions(query);

        if (result.ok) {
          setOptions(result.data);
        }
      });
    }, 200);

    return () => window.clearTimeout(timeout);
  }, [open, query]);

  const handleSelect = (member: OrgMemberOption) => {
    onValueChange(member.id);
    setSelectedLabel(member.name);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            aria-label={ariaLabel}
            className="justify-between font-normal"
            id={id}
            type="button"
            variant="secondary"
          >
            <span className="truncate">
              {selectedLabel ?? placeholder}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="grid w-72 gap-2 p-3">
          <Label className="sr-only" htmlFor={`${id ?? ariaLabel}-search`}>
            {ariaLabel}
          </Label>
          <Input
            id={`${id ?? ariaLabel}-search`}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            value={query}
          />
          <div className="grid max-h-48 gap-1 overflow-y-auto">
            {isPending && options.length === 0 ? (
              <p className="text-muted-foreground px-2 py-1 text-sm">Searching…</p>
            ) : null}
            {!isPending && options.length === 0 ? (
              <p className="text-muted-foreground px-2 py-1 text-sm">No members found.</p>
            ) : null}
            {options.map((member) => (
              <Button
                className="justify-start"
                key={member.id}
                onClick={() => handleSelect(member)}
                size="sm"
                type="button"
                variant="quiet"
              >
                {member.name}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {value ? (
        <Button
          onClick={() => {
            onValueChange(null);
            setSelectedLabel(null);
          }}
          size="sm"
          type="button"
          variant="quiet"
        >
          Clear
        </Button>
      ) : null}
    </div>
  );
}
