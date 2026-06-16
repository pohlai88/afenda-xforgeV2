import { cn, recipe } from "@repo/design-system/design-system";
import type { ReactNode } from "react";

/** Shared underline style for in-form auth links. */
export const authLinkClass = "underline underline-offset-4";

interface AuthSectionProperties {
  readonly "aria-busy"?: boolean;
  readonly "aria-labelledby"?: string;
  readonly children: ReactNode;
  readonly className?: string;
}

export const AuthSection = ({
  children,
  className,
  "aria-busy": ariaBusy,
  "aria-labelledby": ariaLabelledBy,
}: AuthSectionProperties) => (
  <section
    aria-busy={ariaBusy}
    aria-labelledby={ariaLabelledBy}
    className={cn("flex flex-col", recipe("sectionGap"), className)}
  >
    {children}
  </section>
);

interface AuthSectionHeaderProperties {
  readonly description: ReactNode;
  readonly title: string;
  readonly titleId?: string;
}

export const AuthSectionHeader = ({
  title,
  description,
  titleId,
}: AuthSectionHeaderProperties) => (
  <div className="flex flex-col gap-1">
    <h2 className="font-medium text-text-primary" id={titleId}>
      {title}
    </h2>
    <p className={recipe("captionText")}>{description}</p>
  </div>
);

interface AuthConfigRowProperties {
  readonly label: string;
  readonly value: ReactNode;
}

export const AuthConfigRow = ({ label, value }: AuthConfigRowProperties) => (
  <div className="flex flex-col gap-0.5 border-border-default border-b py-3 last:border-b-0">
    <dt className={recipe("captionText")}>{label}</dt>
    <dd className={recipe("bodyMediumText")}>{value}</dd>
  </div>
);

interface AuthConfigListProperties {
  readonly children: ReactNode;
}

export const AuthConfigList = ({ children }: AuthConfigListProperties) => (
  <dl className="rounded-[var(--xforge-radius-md)] border border-border-default px-4">
    {children}
  </dl>
);

interface AuthLoadingStateProperties {
  readonly label: string;
}

export const AuthLoadingState = ({ label }: AuthLoadingStateProperties) => (
  <p aria-live="polite" className={recipe("captionText")}>
    {label}
  </p>
);
