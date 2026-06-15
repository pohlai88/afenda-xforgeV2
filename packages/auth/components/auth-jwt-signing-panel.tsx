"use client";

import { cn, recipe } from "@repo/design-system/design-system";
import {
  describeClientKeyMode,
  describeJwtAlgorithm,
  describeServerKeyMode,
  type JwtSigningReport,
} from "../auth-jwt-signing.shared";
import { formatJwtLifetime } from "../auth-ui-settings";

const ConfigRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="flex flex-col gap-0.5 border-border-default border-b py-3 last:border-b-0">
    <dt className={recipe("captionText")}>{label}</dt>
    <dd className={recipe("bodyMediumText")}>{value}</dd>
  </div>
);

export const AuthJwtSigningPanel = ({
  report,
  jwtExpSeconds,
}: {
  report: JwtSigningReport;
  jwtExpSeconds: number;
}) => {
  const signingLabel =
    report.signingSystem === "asymmetric"
      ? "Asymmetric signing keys (JWKS)"
      : report.signingSystem === "legacy_hs256_only"
        ? "Legacy JWT secret (HS256)"
        : "Unknown — check JWKS endpoint";

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
    <section className={cn("flex flex-col", recipe("sectionGap"))}>
      <div className="flex flex-col gap-1">
        <h2 className="font-medium text-text-primary">JWT signing keys</h2>
        <p className={recipe("captionText")}>
          Session tokens are verified via{" "}
          <code className="text-xs">supabase.auth.getClaims()</code> and the
          public JWKS endpoint — not the legacy JWT secret.
        </p>
      </div>
      <dl className="rounded-[var(--xforge-radius-md)] border border-border-default px-4">
        <ConfigRow label="Signing system" value={signingLabel} />
        <ConfigRow label="Trusted keys (JWKS)" value={activeKeySummary} />
        <ConfigRow
          label="Access token lifetime"
          value={formatJwtLifetime(jwtExpSeconds)}
        />
        <ConfigRow
          label="Client API key"
          value={describeClientKeyMode(report.apiKeys.client)}
        />
        <ConfigRow
          label="Server admin key"
          value={describeServerKeyMode(report.apiKeys.server)}
        />
        <ConfigRow
          label="Legacy anon API key"
          value={
            report.legacyAnonKeyEnabled === null
              ? "Unknown (needs SUPABASE_ACCESS_TOKEN)"
              : report.legacyAnonKeyEnabled
                ? "Still enabled in Supabase"
                : "Disabled"
          }
        />
        <ConfigRow
          label="JWKS discovery"
          value={report.jwksUrl || "Not configured"}
        />
      </dl>
      {report.recommendations.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-sm text-text-secondary">
          {report.recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
};
