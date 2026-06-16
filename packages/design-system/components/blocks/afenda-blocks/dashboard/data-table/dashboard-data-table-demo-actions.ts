/** @internal Storybook / dashboard-01 demo only — not production persistence. */

import { toast } from "sonner";

export function demoSaveDashboardDataTableField(header: string): void {
  toast.promise(
    new Promise<void>((resolve) => {
      setTimeout(resolve, 1000);
    }),
    {
      loading: `Saving ${header}`,
      success: "Done",
      error: "Error",
    }
  );
}
