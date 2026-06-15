import { getJwtSigningReport } from "../auth-jwt-signing.server";
import { getAuthUiSettings } from "../auth-ui-settings.server";
import { AuthJwtSigningPanel } from "./auth-jwt-signing-panel";

export const AuthJwtSigningSection = async () => {
  const [report, settings] = await Promise.all([
    getJwtSigningReport(),
    getAuthUiSettings(),
  ]);

  return (
    <AuthJwtSigningPanel
      jwtExpSeconds={settings.sessions.jwtExpSeconds}
      report={report}
    />
  );
};
