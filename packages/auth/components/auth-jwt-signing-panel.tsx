"use client";

import { cn, recipe } from "@repo/design-system/design-system";
import { useId } from "react";
import {
  describeClientKeyMode,
  describeJwtAlgorithm,
  describeServerKeyMode,
  type JwtSigningReport,
} from "../auth-jwt-signing.shared";
import { formatJwtLifetime } from "../auth-ui-settings";
import {
  AuthConfigList,
  AuthConfigRow,
  AuthSection,
  AuthSectionHeader,
} from "./auth-section";

export const AuthJwtSigningPanel = ({
  report,
  jwtExpSeconds,
}: {
  report: JwtSigningReport;
  jwtExpSeconds: number;
}) => {
  const titleId = useId();
  let signingLabel = "Unknown — check JWKS endpoint";
  if (report.signingSystem === "legacy_hs256_only") {
    signingLabel = "Legacy JWT secret (HS256)";
  }
  if (report.signingSystem === "asymmetric") {
    signingLabel = "Asymmetric signing keys (JWKS)";
  }

  let legacyAnonKeyLabel = "Disabled";
  if (report.legacyAnonKeyEnabled === null) {
    legacyAnonKeyLabel = "Unknown (needs SUPABASE_ACCESS_TOKEN)";
  } else if (report.legacyAnonKeyEnabled) {
    legacyAnonKeyLabel = "Still enabled in Supabase";
  }

  const activeKeySummary =
    report.activeKeys.length > 0
      ? report.activeKeys
          .map(
            (key) =>
              `${describeJwtAlgorithm(key.algorithm)} · kid ${key.kid.slice(0, 8)}…`
          )
          .join("; ")
      : "No keys returned from JWKS";

  return (
    <AuthSection aria-labelledby={titleId}>
      <AuthSectionHeader
        description={
          <>
            Session tokens are verified via{" "}
            <code className="text-xs">supabase.auth.getClaims()</code> and the
            public JWKS endpoint — not the legacy JWT secret.
          </>
        }
        title="JWT signing keys"
        titleId={titleId}
      />
      <AuthConfigList>
        <AuthConfigRow label="Signing system" value={signingLabel} />
        <AuthConfigRow label="Trusted keys (JWKS)" value={activeKeySummary} />
        <AuthConfigRow
          label="Access token lifetime"
          value={formatJwtLifetime(jwtExpSeconds)}
        />
        <AuthConfigRow
          label="Client API key"
          value={describeClientKeyMode(report.apiKeys.client)}
        />
        <AuthConfigRow
          label="Server admin key"
          value={describeServerKeyMode(report.apiKeys.server)}
        />
        <AuthConfigRow
          label="Legacy anon API key"
          value={legacyAnonKeyLabel}
        />
        <AuthConfigRow
          label="JWKS discovery"
          value={report.jwksUrl || "Not configured"}
        />
      </AuthConfigList>
      {report.recommendations.length > 0 ? (
        <ul
          className={cn(
            "list-disc space-y-1 pl-5 text-text-secondary",
            recipe("captionText")
          )}
        >
          {report.recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </AuthSection>
  );
};
