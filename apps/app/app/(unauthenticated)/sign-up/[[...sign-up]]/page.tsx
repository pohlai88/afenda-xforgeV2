import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { AuthPageHeader } from "../../components/auth-page-header";

const title = "Create an account";
const description = "Create a workspace account with email verification.";
const SignUp = dynamic(() =>
  import("@repo/auth/components/sign-up").then((mod) => mod.SignUp)
);

export const metadata: Metadata = createMetadata({ title, description });

const SignUpPage = () => (
  <>
    <AuthPageHeader description={description} title={title} />
    <SignUp />
  </>
);

export default SignUpPage;
