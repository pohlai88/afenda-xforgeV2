"use client";

import { fromSupabaseError } from "@repo/auth/auth-result";
import { createClient } from "@repo/auth/client";
import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import { toast } from "sonner";

export function useAuthenticatedSignOut() {
  const router = useRouter();
  const [isSigningOut, startTransition] = useTransition();

  const signOut = useCallback(() => {
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      const failure = fromSupabaseError(error);

      if (failure) {
        toast.error(failure.error);
        return;
      }

      router.push("/sign-in");
      router.refresh();
    });
  }, [router]);

  return { isSigningOut, signOut };
}
