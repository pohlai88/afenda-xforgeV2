import { cn, recipe } from "@repo/design-system/design-system";
import Link from "next/link";

export const AuthBrand = () => (
  <Link
    className="group inline-flex items-center gap-2 self-start"
    href="/"
  >
    <span
      aria-hidden
      className="size-2 rounded-full bg-brand-primary transition-transform group-hover:scale-110"
    />
    <span className="font-semibold text-lg text-text-primary tracking-tight">
      Afenda
    </span>
  </Link>
);

type AuthTrustFooterProps = {
  className?: string;
};

export const AuthTrustFooter = ({ className }: AuthTrustFooterProps) => (
  <p
    className={cn(
      "text-center text-text-tertiary",
      recipe("captionText"),
      className
    )}
  >
    Encrypted sign-in for governed tenant workspaces.
  </p>
);
