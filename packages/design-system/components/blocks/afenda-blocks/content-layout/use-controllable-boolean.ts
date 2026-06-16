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
}: UseControllableBooleanOptions): readonly [
  boolean,
  ControllableBooleanSetter,
] {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlled ?? internalValue;

  const setValue = useCallback<ControllableBooleanSetter>(
    (next) => {
      const resolved =
        typeof next === "function" ? next(controlled ?? internalValue) : next;

      if (controlled === undefined) {
        setInternalValue(resolved);
      }

      onChange?.(resolved);
    },
    [controlled, internalValue, onChange]
  );

  return [value, setValue] as const;
}
