import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

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
    <div className="flex flex-col space-y-2 text-center">
      <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
    <UpdatePasswordForm />
  </>
);

export default UpdatePasswordPage;
