import "server-only";

import {
  defaultAuthUiSettings,
  fetchPublicAuthSettings,
  mergeAuthUiSettings,
  type SupabaseManagementAuthConfig,
} from "./auth-ui-settings";
import { getSupabasePublishableKey, getSupabaseUrl, keys } from "./keys";

const getManagementAccessToken = () => keys().SUPABASE_ACCESS_TOKEN ?? "";

const getProjectRef = () => keys().SUPABASE_PROJECT_ID ?? "";

export const fetchManagementAuthConfig = async (
  projectRef: string,
  accessToken: string
): Promise<SupabaseManagementAuthConfig> => {
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Management auth config failed (${response.status})`);
  }

  return response.json() as Promise<SupabaseManagementAuthConfig>;
};

export const getAuthUiSettings = async () => {
  const supabaseUrl = getSupabaseUrl();
  const publishableKey = getSupabasePublishableKey();
  const projectRef = getProjectRef();
  const accessToken = getManagementAccessToken();

  if (!supabaseUrl || !publishableKey) {
    return defaultAuthUiSettings();
  }

  try {
    const publicSettings = await fetchPublicAuthSettings(
      supabaseUrl,
      publishableKey
    );

    if (!accessToken || !projectRef) {
      return mergeAuthUiSettings(publicSettings, null);
    }

    const management = await fetchManagementAuthConfig(projectRef, accessToken);
    return mergeAuthUiSettings(publicSettings, management);
  } catch {
    return defaultAuthUiSettings();
  }
};
