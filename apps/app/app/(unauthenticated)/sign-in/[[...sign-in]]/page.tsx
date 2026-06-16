import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthFormFallback } from "../../components/auth-form-fallback";
import { SignInForm } from "../../components/auth-forms";
import { AuthPageHeader } from "../../components/auth-page-header";
import { readAuthQueryError } from "../../lib/read-auth-query-error";

const title = "Welcome back";
const description = "Sign in to your governed workspace.";

export const metadata: Metadata = createMetadata({ title, description });

interface SignInPageProperties {
  readonly searchParams: Promise<{
    error?: string | string[];
  }>;
}

const SignInPage = async ({ searchParams }: SignInPageProperties) => {
  const { error } = await searchParams;
  const initialError = readAuthQueryError(error);

  return (
    <>
      <AuthPageHeader description={description} title={title} />
      <Suspense fallback={<AuthFormFallback label="Loading sign-in form" />}>
        <SignInForm initialError={initialError} />
      </Suspense>
    </>
  );
};

export default SignInPage;
