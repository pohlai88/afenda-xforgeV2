import { cn, recipe } from "@repo/design-system/design-system";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { AuthPageHeader } from "../components/auth-page-header";

const title = "Check your email";
const description = "We sent you a confirmation link to finish signing up.";

const ResendConfirmationForm = dynamic(() =>
  import("@repo/auth/components/resend-confirmation-form").then(
    (mod) => mod.ResendConfirmationForm
  )
);

export const metadata: Metadata = createMetadata({ title, description });

const SignUpSuccessPage = () => (
  <div className={cn("flex flex-col", recipe("sectionGap"))}>
    <AuthPageHeader description={description} title={title} />
    <ResendConfirmationForm />
  </div>
);

export default SignUpSuccessPage;
