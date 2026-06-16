import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { ResendConfirmationForm } from "../components/auth-forms";
import { AuthPageHeader } from "../components/auth-page-header";

const title = "Check your email";
const description = "We sent you a confirmation link to finish signing up.";

export const metadata: Metadata = createMetadata({ title, description });

interface SignUpSuccessPageProperties {
  readonly searchParams: Promise<{
    email?: string | string[];
  }>;
}

const readInitialEmail = (email: string | string[] | undefined) => {
  if (typeof email === "string") {
    return email;
  }

  return email?.[0] ?? "";
};

const SignUpSuccessPage = async ({
  searchParams,
}: SignUpSuccessPageProperties) => {
  const { email } = await searchParams;
  const initialEmail = readInitialEmail(email);

  return (
    <>
      <AuthPageHeader description={description} title={title} />
      <ResendConfirmationForm initialEmail={initialEmail} />
    </>
  );
};

export default SignUpSuccessPage;
