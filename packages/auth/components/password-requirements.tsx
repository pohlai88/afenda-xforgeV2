"use client";

import { cn, recipe } from "@repo/design-system/design-system";
import type { PasswordPolicy } from "../auth-ui-settings";

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
  if (!showChecklist) {
    return (
      <p
        className={cn("text-text-secondary", recipe("captionText"))}
        id={describedById}
      >
        {passwordRequirementsSummary(policy)}.
      </p>
    );
  }

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
    <ul
      aria-label="Password requirements"
      aria-live="polite"
      className={cn("flex flex-col gap-1.5", recipe("captionText"))}
      id={describedById}
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
  );
};
