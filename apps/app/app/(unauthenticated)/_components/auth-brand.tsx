import { cn, recipe } from "@repo/design-system";
import { AFENDA_SITE_ICONS } from "@repo/seo/afenda-site-icons";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const AuthBrand = () => (
  <Link
    className={cn(
      "group inline-flex min-h-11 items-center gap-2.5 self-center rounded-[var(--xforge-radius-sm)] px-1.5 py-1",
      "text-text-primary outline-none transition-[color,background-color] duration-150 hover:bg-surface-hover/60",
      "focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
    )}
    href="/"
  >
    <Image
      alt=""
      aria-hidden
      className="size-7 shrink-0 rounded-[var(--xforge-radius-sm)]"
      height={28}
      priority
      src={AFENDA_SITE_ICONS.workspaceBrandIcon}
      width={28}
    />
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
