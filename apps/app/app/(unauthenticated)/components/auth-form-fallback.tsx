import { cn, recipe, Skeleton } from "@repo/design-system/design-system";

type AuthFormFallbackProps = {
  readonly label?: string;
};

/** Instant fallback while auth client forms code-split or suspend. */
export const AuthFormFallback = ({
  label = "Loading form",
}: AuthFormFallbackProps) => (
  <div
    aria-busy="true"
    aria-live="polite"
    className={cn("flex flex-col", recipe("sectionGap"))}
  >
    <span className="sr-only">{label}</span>
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-full rounded-[var(--xforge-radius-sm)]" />
    </div>
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full rounded-[var(--xforge-radius-sm)]" />
    </div>
    <Skeleton className="h-10 w-full rounded-[var(--button-radius)]" />
  </div>
);
