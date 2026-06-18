"use client";

import { Button, Spinner } from "@repo/design-system";
import type { ComponentProps, ReactNode } from "react";

type AuthPendingButtonProperties = {
  readonly children: ReactNode;
  readonly leading?: ReactNode;
  readonly pending?: boolean;
  readonly pendingLabel: string;
} & Omit<ComponentProps<typeof Button>, "children">;

/** Primary/async auth actions with a consistent spinner + label while pending. */
export const AuthPendingButton = ({
  children,
  leading,
  pending = false,
  pendingLabel,
  disabled,
  ...properties
}: AuthPendingButtonProperties) => (
  <Button
    aria-busy={pending || undefined}
    disabled={disabled || pending}
    {...properties}
  >
    {pending ? (
      <>
        <Spinner aria-hidden className="shrink-0" size="sm" />
        <span>{pendingLabel}</span>
      </>
    ) : (
      <>
        {leading}
        {children}
      </>
    )}
  </Button>
);
