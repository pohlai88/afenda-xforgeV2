"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "../client";

/**
 * Register `onAuthStateChange` early in the app tree so refresh tokens stay in sync.
 * @see https://supabase.com/docs/guides/auth/server-side/advanced-guide
 */
export const SupabaseAuthListener = () => {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return null;
};
