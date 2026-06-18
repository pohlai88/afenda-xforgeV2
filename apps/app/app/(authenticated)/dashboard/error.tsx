"use client";

import { Button, cn, recipe } from "@repo/design-system";
import { captureException } from "@sentry/nextjs";
import { useEffect } from "react";

interface DashboardErrorProperties {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
  readonly unstable_retry?: () => void;
}

const DashboardError = ({
  error,
  reset,
  unstable_retry,
}: DashboardErrorProperties) => {
  useEffect(() => {
    captureException(error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <div
      className={cn(
        "mx-auto flex min-h-[50vh] w-full max-w-lg flex-col justify-center px-6",
        recipe("sectionGap")
      )}
    >
      <div className="flex flex-col gap-1.5">
        <h2 className="font-semibold text-lg text-text-primary tracking-tight">
          Dashboard unavailable
        </h2>
        <p className={recipe("captionText")}>
          We could not load the dashboard. Try again or return to the home
          route.
        </p>
      </div>
      <Button className="w-fit" onClick={() => retry()} type="button">
        Try again
      </Button>
    </div>
  );
};

export default DashboardError;
