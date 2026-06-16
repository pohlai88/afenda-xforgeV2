import { cn, recipe } from "@repo/design-system/design-system";

interface AuthDividerProperties {
  label?: string;
}

export const AuthDivider = ({
  label = "or with email",
}: AuthDividerProperties) => (
  <div className="relative flex items-center">
    <div aria-hidden className="h-px flex-1 bg-border-default" />
    <span className={cn("px-3", recipe("captionText"))}>{label}</span>
    <div aria-hidden className="h-px flex-1 bg-border-default" />
  </div>
);
