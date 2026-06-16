"use client";

import {
  FieldLabel,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@repo/design-system/design-system";
import { useId, useState } from "react";
import type { PasswordPolicy } from "../auth-ui-settings";
import { EyeIcon, EyeOffIcon } from "./auth-icons";
import { PasswordRequirements } from "./password-requirements";

interface PasswordFieldProperties {
  autoComplete: "new-password" | "current-password";
  describedBy?: string;
  id: string;
  invalid?: boolean;
  label: string;
  minLength?: number;
  name: string;
  onChange: (value: string) => void;
  policy?: PasswordPolicy;
  required?: boolean;
  showRequirements?: boolean;
  value: string;
}

export const PasswordField = ({
  autoComplete,
  describedBy,
  id,
  invalid,
  label,
  minLength,
  name,
  onChange,
  policy,
  required = true,
  showRequirements = false,
  value,
}: PasswordFieldProperties) => {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const requirementsId = useId();
  const resolvedMinLength = minLength ?? policy?.minLength ?? 8;
  const toggleLabel = visible ? "Hide password" : "Show password";
  const showChecklist = focused || value.length > 0;
  const requirementIds =
    showRequirements && policy
      ? [
          requirementsId,
          ...(showChecklist ? [`${requirementsId}-checklist`] : []),
        ]
      : [];
  const mergedDescribedBy = [describedBy, ...requirementIds]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {label ? <FieldLabel htmlFor={id}>{label}</FieldLabel> : null}
      <InputGroup>
        <InputGroupInput
          aria-describedby={mergedDescribedBy || undefined}
          aria-invalid={invalid ? true : undefined}
          autoComplete={autoComplete}
          id={id}
          minLength={resolvedMinLength}
          name={name}
          onBlur={() => setFocused(false)}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setFocused(true)}
          required={required}
          type={visible ? "text" : "password"}
          value={value}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label={toggleLabel}
            aria-pressed={visible}
            onClick={() => setVisible((current) => !current)}
            type="button"
          >
            {visible ? (
              <EyeOffIcon className="size-4" />
            ) : (
              <EyeIcon className="size-4" />
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {showRequirements && policy ? (
        <div className="mt-2">
          <PasswordRequirements
            describedById={requirementsId}
            password={value}
            policy={policy}
            showChecklist={showChecklist}
          />
        </div>
      ) : null}
    </>
  );
};
