import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { AuthPageHeader } from "../components/auth-page-header";

const title = "Update password";
const description = "Choose a new password for your account.";
const UpdatePasswordForm = dynamic(() =>
  import("@repo/auth/components/update-password-form").then(
    (mod) => mod.UpdatePasswordForm
  )
);

export const metadata: Metadata = createMetadata({ title, description });

const UpdatePasswordPage = () => (
  <>
    <AuthPageHeader description={description} title={title} />
    <UpdatePasswordForm />
  </>
);

export default UpdatePasswordPage;
