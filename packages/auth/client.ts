"use client";

import { createBrowserClient } from "@supabase/ssr";

const getSupabaseUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

const getSupabaseAnonKey = () =>
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.SUPABASE_ANON_PUBLIC ??
  "";

export const createClient = () =>
  createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
