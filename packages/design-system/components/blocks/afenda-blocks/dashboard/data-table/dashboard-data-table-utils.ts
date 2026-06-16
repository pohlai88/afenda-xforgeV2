import { toast } from "sonner";

export function saveDashboardDataTableField(header: string): void {
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
