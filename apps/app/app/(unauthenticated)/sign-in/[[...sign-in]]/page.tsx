import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { AuthPageHeader } from "../../components/auth-page-header";

const title = "Welcome back";
const description = "Sign in to your governed workspace.";
const SignIn = dynamic(() =>
  import("@repo/auth/components/sign-in").then((mod) => mod.SignIn)
);

export const metadata: Metadata = createMetadata({ title, description });

const SignInPage = () => (
  <>
    <AuthPageHeader description={description} title={title} />
    <Suspense fallback={null}>
      <SignIn />
    </Suspense>
  </>
);

export default SignInPage;
