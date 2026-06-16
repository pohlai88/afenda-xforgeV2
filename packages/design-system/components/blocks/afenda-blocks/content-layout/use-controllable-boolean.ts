"use client";

import { useCallback, useState } from "react";

interface UseControllableBooleanOptions {
  readonly controlled?: boolean;
  readonly defaultValue?: boolean;
  readonly onChange?: (value: boolean) => void;
}

type ControllableBooleanSetter = (
  next: boolean | ((current: boolean) => boolean)
) => void;

export function useControllableBoolean({
  controlled,
  defaultValue = false,
  onChange,
}: UseControllableBooleanOptions): readonly [boolean, ControllableBooleanSetter] {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlled ?? internalValue;

  const setValue = useCallback<ControllableBooleanSetter>(
    (next) => {
      if (controlled === undefined) {
        setInternalValue((current) => {
          const resolved = typeof next === "function" ? next(current) : next;
          onChange?.(resolved);
          return resolved;
        });
        return;
      }

      const resolved = typeof next === "function" ? next(controlled) : next;
      onChange?.(resolved);
    },
    [controlled, onChange]
  );

  return [value, setValue] as const;
}
