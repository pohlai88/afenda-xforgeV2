import { Button } from "@repo/design-system/components/ui/button";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";

const title = "Check your email";
const description = "We sent you a confirmation link to finish signing up.";

export const metadata: Metadata = createMetadata({ title, description });

const SignUpSuccessPage = () => (
  <div className="space-y-6 text-center">
    <div className="flex flex-col space-y-2">
      <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
    <Button asChild className="w-full" variant="outline">
      <Link href="/sign-in">Back to sign in</Link>
    </Button>
  </div>
);

export default SignUpSuccessPage;
