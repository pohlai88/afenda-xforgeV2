"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublishableKey, getSupabaseUrl } from "./keys";

export const createClient = () =>
  createBrowserClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    auth: {
      flowType: "pkce",
      autoRefreshToken: true,
      detectSessionInUrl: true,
      experimental: { passkey: true },
    },
  });
