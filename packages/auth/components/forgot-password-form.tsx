"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { fromSupabaseError, isAuthFailure, parseAuthForm } from "../auth-result";
import { createClient } from "../client";
import { forgotPasswordSchema } from "../schemas";

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const validated = parseAuthForm(forgotPasswordSchema, { email });

    if (isAuthFailure(validated)) {
      setError(validated.error);
      setLoading(false);
      return;
    }

    const redirectTo = `${window.location.origin}/auth/confirm?next=/update-password`;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      validated.data.email,
      { redirectTo }
    );

    const failure = fromSupabaseError(resetError);

    if (failure) {
      setError(failure.error);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Check your email for a password reset link.
        </p>
        <Button asChild className="w-full" variant="outline">
          <Link href="/sign-in">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
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
      <Button className="w-full" disabled={loading} type="submit">
        {loading ? "Sending..." : "Send reset link"}
      </Button>
      <p className="text-center text-muted-foreground text-sm">
        <Link className="underline underline-offset-4" href="/sign-in">
          Back to sign in
        </Link>
      </p>
    </form>
  );
};
