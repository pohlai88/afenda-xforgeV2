"use client";

import { cn, FieldHint, recipe } from "@repo/design-system/design-system";
import type { PasswordPolicy } from "../auth-ui-settings";

const charsetHintLabel = (label: string): string | null => {
  const normalized = label.toLowerCase();

  if (normalized.includes("lowercase")) {
    return "lowercase";
  }

  if (normalized.includes("uppercase")) {
    return "uppercase";
  }

  if (normalized.includes("digit") || normalized.includes("number")) {
    return "digits";
  }

  if (normalized.includes("symbol")) {
    return "symbol";
  }

  return null;
};

export const passwordRequirementsSummary = (policy: PasswordPolicy): string => {
  const parts = [`At least ${policy.minLength} characters`];

  for (const rule of policy.rules) {
    if (rule.id !== "length") {
      parts.push(rule.label.toLowerCase());
    }
  }

  if (policy.blockLeakedPasswords) {
    parts.push("not a known leaked password");
  }

  return parts.join(", ");
};

/** Static hint shown below password fields before focus. */
export const passwordRequirementsHint = (policy: PasswordPolicy): string => {
  const charsetLabels = policy.rules
    .filter((rule) => rule.id !== "length")
    .map((rule) => charsetHintLabel(rule.label) ?? rule.label.toLowerCase());

  const lengthHint = `At least ${policy.minLength} characters`;

  if (charsetLabels.length === 0) {
    return lengthHint;
  }

  const last = charsetLabels.at(-1);
  const leading = charsetLabels.slice(0, -1);
  const charsetHint =
    leading.length > 0 ? `${leading.join(", ")}, and ${last}` : last;

  return `${lengthHint}. Include ${charsetHint}.`;
};

type PasswordRequirementsProperties = {
  describedById: string;
  password: string;
  policy: PasswordPolicy;
  showChecklist: boolean;
};

export const PasswordRequirements = ({
  policy,
  password,
  describedById,
  showChecklist,
}: PasswordRequirementsProperties) => {
  const checklistId = `${describedById}-checklist`;

  const items = [
    ...policy.rules.map((rule) => ({
      id: rule.id,
      label: rule.label,
      met: password.length > 0 && rule.test(password),
    })),
    ...(policy.blockLeakedPasswords
      ? [
          {
            id: "leaked",
            label: "Not a known leaked password",
            met: false,
          },
        ]
      : []),
  ];

  return (
    <div className={cn("flex flex-col gap-1.5", recipe("captionText"))}>
      <FieldHint id={describedById}>{passwordRequirementsHint(policy)}</FieldHint>
      {showChecklist ? (
        <ul
          aria-label="Password requirements"
          aria-live="polite"
          className="flex flex-col gap-1.5"
          id={checklistId}
        >
          {items.map((item) => (
            <li
              className={cn(
                "flex items-start gap-2",
                item.met ? "text-text-primary" : "text-text-secondary"
              )}
              key={item.id}
            >
              <span
                aria-hidden
                className={cn(
                  "mt-1.5 inline-block size-1.5 shrink-0 rounded-full",
                  item.met ? "bg-text-primary" : "bg-text-tertiary"
                )}
              />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
