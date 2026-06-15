"use client";

import {
  cn,
  Field,
  FieldError,
  FieldHint,
  FieldLabel,
  Input,
  recipe,
} from "@repo/design-system/design-system";
import { useId, useMemo, useState } from "react";
import { fromSupabaseError } from "../auth-result";
import { createClient } from "../client";
import { useAuthUiConfig } from "../context/auth-ui-config";
import { getSsoHintDomains } from "../keys";
import { buildAuthCallbackRedirect } from "../redirects";
import { AuthDivider } from "./auth-divider";
import { AuthErrorAlert } from "./auth-feedback";
import { AuthPendingButton } from "./auth-pending-button";

type SsoSignInPanelProperties = {
  onError?: (message: string | null) => void;
};

export const SsoSignInPanel = ({ onError }: SsoSignInPanelProperties) => {
  const { settings } = useAuthUiConfig();
  const supabase = createClient();
  const domainFieldId = useId();
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const hintDomains = useMemo(() => getSsoHintDomains(), []);
  const placeholder =
    hintDomains[0] ?? "company.com";

  if (!settings.saml) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setFormError(null);
    onError?.(null);

    const trimmed = domain.trim().toLowerCase();

    if (!trimmed) {
      setFormError("Enter your work email domain.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithSSO({
      domain: trimmed,
      options: {
        redirectTo: buildAuthCallbackRedirect("/"),
      },
    });

    const failure = fromSupabaseError(error);

    if (failure) {
      setFormError(failure.error);
      onError?.(failure.error);
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col", recipe("sectionGap"))}>
      <AuthDivider label="Or continue with SSO" />
      {formError ? <AuthErrorAlert message={formError} /> : null}
      <form
        className={cn("flex flex-col", recipe("sectionGap"))}
        noValidate
        onSubmit={handleSubmit}
      >
        <Field>
          <FieldLabel htmlFor={domainFieldId}>Work email domain</FieldLabel>
          <Input
            autoComplete="organization"
            id={domainFieldId}
            onChange={(event) => setDomain(event.target.value)}
            placeholder={placeholder}
            required
            type="text"
            value={domain}
          />
          <FieldHint>
            SAML SSO must be configured for your domain in Supabase.
          </FieldHint>
          {formError ? <FieldError>{formError}</FieldError> : null}
        </Field>
        <AuthPendingButton
          className="w-full"
          pending={loading}
          pendingLabel="Redirecting…"
          type="submit"
          variant="secondary"
        >
          Continue with SSO
        </AuthPendingButton>
      </form>
    </div>
  );
};
