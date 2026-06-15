import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { SignUpForm } from "../../components/auth-forms";
import { AuthPageHeader } from "../../components/auth-page-header";

const title = "Create an account";
const description = "Create a workspace account with email verification.";

export const metadata: Metadata = createMetadata({ title, description });

const SignUpPage = () => (
  <>
    <AuthPageHeader description={description} title={title} />
    <SignUpForm />
  </>
);

export default SignUpPage;
