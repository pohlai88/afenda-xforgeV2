import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { ForgotPasswordForm } from "../components/auth-forms";
import { AuthPageHeader } from "../components/auth-page-header";

const title = "Forgot password";
const description = "Reset your password via email.";

export const metadata: Metadata = createMetadata({ title, description });

const ForgotPasswordPage = () => (
  <>
    <AuthPageHeader description={description} title={title} />
    <ForgotPasswordForm />
  </>
);

export default ForgotPasswordPage;
