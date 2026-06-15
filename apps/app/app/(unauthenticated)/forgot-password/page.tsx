import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { AuthPageHeader } from "../components/auth-page-header";

const title = "Forgot password";
const description = "Reset your password via email.";
const ForgotPasswordForm = dynamic(() =>
  import("@repo/auth/components/forgot-password-form").then(
    (mod) => mod.ForgotPasswordForm
  )
);

export const metadata: Metadata = createMetadata({ title, description });

const ForgotPasswordPage = () => (
  <>
    <AuthPageHeader description={description} title={title} />
    <ForgotPasswordForm />
  </>
);

export default ForgotPasswordPage;
