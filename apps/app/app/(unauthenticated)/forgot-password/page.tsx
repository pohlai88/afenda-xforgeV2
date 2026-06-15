import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

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
    <div className="flex flex-col space-y-2 text-center">
      <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
    <ForgotPasswordForm />
  </>
);

export default ForgotPasswordPage;
