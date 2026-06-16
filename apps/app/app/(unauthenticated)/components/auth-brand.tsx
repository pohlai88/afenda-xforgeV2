import { cn, recipe } from "@repo/design-system/design-system";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

const AfendaMark = () => (
  <span
    aria-hidden
    className="inline-flex size-7 shrink-0 items-center justify-center rounded-[var(--xforge-radius-sm)] border border-border-default bg-brand-primary/8"
  >
    <svg
      aria-hidden
      className="size-3.5 text-brand-primary"
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Afenda mark</title>
      <path
        d="M8 2.5 3 13h2.1l.9-2.2h3.8l.9 2.2H13L8 2.5Zm-.6 6.8L8 6.2l.6 3.1H7.4Z"
        fill="currentColor"
      />
    </svg>
  </span>
);

export const AuthBrand = () => (
  <Link
    className={cn(
      "group inline-flex min-h-11 items-center gap-2.5 self-center rounded-[var(--xforge-radius-sm)] px-1.5 py-1",
      "text-text-primary outline-none transition-[color,background-color] duration-150 hover:bg-surface-hover/60",
      "focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
    )}
    href="/"
  >
    <AfendaMark />
    <span className="font-semibold text-base tracking-tight">Afenda</span>
  </Link>
);

interface AuthTrustFooterProps {
  readonly className?: string;
}

export const AuthTrustFooter = ({ className }: AuthTrustFooterProps) => (
  <p
    className={cn(
      "flex items-center justify-center gap-1.5 text-text-tertiary",
      recipe("captionText"),
      className
    )}
  >
    <ShieldCheck aria-hidden className="size-3.5 shrink-0 opacity-80" />
    <span>Encrypted sign-in for governed tenant workspaces.</span>
  </p>
);
