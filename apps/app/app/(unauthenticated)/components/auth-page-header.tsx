import { cn, recipe } from "@repo/design-system/design-system";

type AuthPageHeaderProps = {
  readonly title: string;
  readonly description: string;
};

export const AuthPageHeader = ({ title, description }: AuthPageHeaderProps) => (
  <div className={cn("flex flex-col gap-1.5", recipe("sectionGap"))}>
    <h1 className="font-semibold text-2xl text-text-primary tracking-tight">
      {title}
    </h1>
    <p className={cn("text-text-secondary", recipe("captionText"))}>
      {description}
    </p>
  </div>
);
