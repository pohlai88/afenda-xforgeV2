"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fromSupabaseError, isAuthFailure, parseAuthForm } from "../auth-result";
import { createClient } from "../client";
import { signUpSchema } from "../schemas";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const validated = parseAuthForm(signUpSchema, { email, password, name });

    if (isAuthFailure(validated)) {
      setError(validated.error);
      setLoading(false);
      return;
    }

    const emailRedirectTo = `${window.location.origin}/auth/confirm?next=/`;

    const { error: signUpError } = await supabase.auth.signUp({
      email: validated.data.email,
      password: validated.data.password,
      options: {
        data: { name: validated.data.name },
        emailRedirectTo,
      },
    });

    const failure = fromSupabaseError(signUpError);

    if (failure) {
      setError(failure.error);
      setLoading(false);
      return;
    }

    router.push("/sign-up-success");
  };

  return (
    <form className="space-y-4" onSubmit={handleSignUp}>
      {error ? (
        <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
          {error}
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          required
          type="text"
          value={name}
        />
      </div>
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
        <Label htmlFor="password">Password</Label>
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
        {loading ? "Creating account..." : "Sign up"}
      </Button>
      <p className="text-center text-muted-foreground text-sm">
        Already have an account?{" "}
        <Link className="underline underline-offset-4" href="/sign-in">
          Sign in
        </Link>
      </p>
    </form>
  );
};
