import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  cn,
  recipe,
} from "@repo/design-system";
import type { ReactNode } from "react";

interface AuthErrorAlertProperties {
  readonly id?: string;
  readonly message: string;
  readonly onRetry?: () => void;
  readonly retryLabel?: string;
}

export const AuthErrorAlert = ({
  id,
  message,
  onRetry,
  retryLabel = "Try again",
}: AuthErrorAlertProperties) => (
  <>
    <Alert id={id} tone="critical">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
    {onRetry ? (
      <Button
        className="w-fit"
        onClick={onRetry}
        type="button"
        variant="secondary"
      >
        {retryLabel}
      </Button>
    ) : null}
  </>
);

interface AuthSuccessAlertProperties {
  readonly message: string;
  readonly title?: string;
}

export const AuthSuccessAlert = ({
  message,
  title,
}: AuthSuccessAlertProperties) => (
  <Alert role="status" tone="success">
    {title ? <AlertTitle>{title}</AlertTitle> : null}
    <AlertDescription className={title ? recipe("captionText") : undefined}>
      {message}
    </AlertDescription>
  </Alert>
);

interface AuthConfigNoticeProperties {
  readonly children: ReactNode;
}

/** Non-error configuration or environment guidance (warning tone). */
export const AuthConfigNotice = ({ children }: AuthConfigNoticeProperties) => (
  <Alert role="status" tone="warning">
    <AlertDescription>{children}</AlertDescription>
  </Alert>
);

interface PasskeyOriginNoticeProperties {
  readonly rpOrigins: readonly string[];
}

export const PasskeyOriginNotice = ({
  rpOrigins,
}: PasskeyOriginNoticeProperties) => (
  <span className={cn("text-text-secondary", recipe("captionText"))}>
    Passkeys are not available on this origin. On localhost against a hosted
    Supabase project, use email or Google sign-in, or test passkeys on a
    preview/production URL ({rpOrigins.join(", ") || "none configured"}).
  </span>
);
