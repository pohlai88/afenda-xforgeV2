"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fromSupabaseError, isAuthFailure, parseAuthForm } from "../auth-result";
import { createClient } from "../client";
import { signInSchema } from "../schemas";

type SignInProperties = {
  initialError?: string | null;
};

export const SignIn = ({ initialError = null }: SignInProperties) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const queryError = searchParams.get("error");
    if (queryError) {
      setError(queryError);
    }
  }, [searchParams]);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const validated = parseAuthForm(signInSchema, { email, password });

    if (isAuthFailure(validated)) {
      setError(validated.error);
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword(
      validated.data
    );

    const failure = fromSupabaseError(signInError);

    if (failure) {
      setError(failure.error);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <form className="space-y-4" onSubmit={handleSignIn}>
      {error ? (
        <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
          {error}
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            className="text-muted-foreground text-sm underline underline-offset-4"
            href="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          minLength={6}
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </div>
      <Button className="w-full" disabled={loading} type="submit">
        {loading ? "Signing in..." : "Sign in"}
      </Button>
      <p className="text-center text-muted-foreground text-sm">
        No account?{" "}
        <Link className="underline underline-offset-4" href="/sign-up">
          Sign up
        </Link>
      </p>
    </form>
  );
};
