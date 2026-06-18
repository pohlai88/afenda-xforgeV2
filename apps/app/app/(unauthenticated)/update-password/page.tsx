import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { UpdatePasswordForm } from "../_components/auth-forms";
import { AuthPageHeader } from "../_components/auth-page-header";

const title = "Update password";
const description = "Choose a new password for your account.";

export const metadata: Metadata = createMetadata({ title, description });

const UpdatePasswordPage = () => (
  <>
    <AuthPageHeader description={description} title={title} />
    <UpdatePasswordForm />
  </>
);

export default UpdatePasswordPage;
