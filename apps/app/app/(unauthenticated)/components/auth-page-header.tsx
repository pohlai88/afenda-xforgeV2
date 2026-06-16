import { cn, recipe } from "@repo/design-system/design-system";

interface AuthPageHeaderProps {
  readonly description: string;
  readonly descriptionId?: string;
  readonly title: string;
  readonly titleId?: string;
}

/** Page title + one-line subcopy inside the auth form card. */
export const AuthPageHeader = ({
  title,
  description,
  titleId = "auth-page-title",
  descriptionId = "auth-page-description",
}: AuthPageHeaderProps) => (
  <header className="flex flex-col gap-1.5">
    <h1
      className="text-balance font-semibold text-2xl text-text-primary leading-tight tracking-tight"
      id={titleId}
    >
      {title}
    </h1>
    <p
      className={cn("text-pretty text-text-secondary", recipe("captionText"))}
      id={descriptionId}
    >
      {description}
    </p>
  </header>
);
