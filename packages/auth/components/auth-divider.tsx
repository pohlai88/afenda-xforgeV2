import { cn, recipe } from "@repo/design-system/design-system";

export const AuthDivider = () => (
  <div className="relative flex items-center">
    <div
      aria-hidden
      className="h-px flex-1 bg-border-default"
    />
    <span className={cn("px-3", recipe("captionText"))}>or with email</span>
    <div
      aria-hidden
      className="h-px flex-1 bg-border-default"
    />
  </div>
);
