"use client";

import { Button, cn, recipe } from "@repo/design-system/design-system";

export const DEVELOPER_SIGN_IN_CREDENTIALS = {
  email: "developer@afenda.com",
  password: "afenda-developer",
} as const;

export type DeveloperSignInCredentials = typeof DEVELOPER_SIGN_IN_CREDENTIALS;

const isDevelopment = process.env.NODE_ENV === "development";

interface DeveloperSignInPanelProperties {
  onApply: (credentials: DeveloperSignInCredentials) => void;
}

export const DeveloperSignInPanel = ({
  onApply,
}: DeveloperSignInPanelProperties) => {
  if (!isDevelopment) {
    return null;
  }

  return (
    <details
      className={cn(
        "rounded-md border border-border-default border-dashed bg-surface-muted/30 px-3 py-2",
        recipe("captionText")
      )}
    >
      <summary className="cursor-pointer select-none text-text-secondary">
        Developer sign-in
      </summary>
      <div className={cn("mt-3 flex flex-col", recipe("sectionGap"))}>
        <p className="text-text-secondary">
          Local dev only. Credentials auto-fill on load.
        </p>
        <dl
          aria-label="Development credentials"
          className={cn("px-3 py-2", recipe("flatControlSurface"))}
        >
          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
            <dt className={recipe("captionText")}>Email</dt>
            <dd className={cn("truncate font-mono", recipe("controlText"))}>
              {DEVELOPER_SIGN_IN_CREDENTIALS.email}
            </dd>
            <dt className={recipe("captionText")}>Password</dt>
            <dd className={cn("truncate font-mono", recipe("controlText"))}>
              {DEVELOPER_SIGN_IN_CREDENTIALS.password}
            </dd>
          </div>
        </dl>
        <Button
          onClick={() => onApply(DEVELOPER_SIGN_IN_CREDENTIALS)}
          size="sm"
          type="button"
          variant="quiet"
        >
          Re-apply credentials
        </Button>
      </div>
    </details>
  );
};
