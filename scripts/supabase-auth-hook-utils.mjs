import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const configPath = path.join(root, "supabase", "config.toml");
const envPath = path.join(root, ".env");
const secretPath = path.join(root, ".env.secret");

/** Maps config.toml [auth.hook.<name>] sections to Management API fields. */
export const AUTH_HOOK_API_FIELDS = {
  before_user_created: {
    enabled: "hook_before_user_created_enabled",
    uri: "hook_before_user_created_uri",
  },
  custom_access_token: {
    enabled: "hook_custom_access_token_enabled",
    uri: "hook_custom_access_token_uri",
  },
  send_sms: {
    enabled: "hook_send_sms_enabled",
    uri: "hook_send_sms_uri",
    secrets: "hook_send_sms_secrets",
  },
  send_email: {
    enabled: "hook_send_email_enabled",
    uri: "hook_send_email_uri",
    secrets: "hook_send_email_secrets",
  },
  mfa_verification_attempt: {
    enabled: "hook_mfa_verification_attempt_enabled",
    uri: "hook_mfa_verification_attempt_uri",
  },
  password_verification_attempt: {
    enabled: "hook_password_verification_attempt_enabled",
    uri: "hook_password_verification_attempt_uri",
  },
};

export const ENTERPRISE_AUTH_HOOKS = new Set([
  "mfa_verification_attempt",
  "password_verification_attempt",
]);

export function parseToken(filePath, key) {
  if (!fs.existsSync(filePath)) {
    return "";
  }

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(
      new RegExp(`^\\s*(?:export\\s+)?${key}\\s*=(.*)$`)
    );
    if (match) {
      return match[1].trim().replace(/^["']|["']$/g, "");
    }
  }

  return "";
}

export function readSupabaseCredentials() {
  const projectRef = parseToken(envPath, "SUPABASE_PROJECT_ID");
  const accessToken = parseToken(secretPath, "SUPABASE_ACCESS_TOKEN");

  return { projectRef, accessToken };
}

function extractHookSection(configText, hookName) {
  const sectionName = `auth.hook.${hookName}`;
  const pattern = new RegExp(
    `^\\[${sectionName.replace(/\./g, "\\.")}\\]\\s*\\n([\\s\\S]*?)(?=\\n\\[)`,
    "m"
  );
  const match = pattern.exec(configText.replace(/\r\n/g, "\n"));
  if (match) {
    return match[1];
  }

  const tailPattern = new RegExp(
    `^\\[${sectionName.replace(/\./g, "\\.")}\\]\\s*\\n([\\s\\S]*)$`,
    "m"
  );
  return tailPattern.exec(configText.replace(/\r\n/g, "\n"))?.[1] ?? "";
}

export function parseAuthHooksFromConfig(
  configText = fs.readFileSync(configPath, "utf8")
) {
  const payload = {};

  for (const [hookName, fields] of Object.entries(AUTH_HOOK_API_FIELDS)) {
    const section = extractHookSection(configText, hookName);
    if (!section.trim()) {
      continue;
    }

    const enabled = /^\s*enabled\s*=\s*true/m.test(section);
    payload[fields.enabled] = enabled;

    const uriMatch = section.match(/^\s*uri\s*=\s*"([^"]+)"/m);
    if (uriMatch?.[1]) {
      payload[fields.uri] = uriMatch[1];
    }

    if (fields.secrets) {
      const secretsMatch = section.match(/^\s*secrets\s*=\s*"([^"]+)"/m);
      if (secretsMatch?.[1]) {
        payload[fields.secrets] = secretsMatch[1];
      }
    }
  }

  return payload;
}

export function summarizeAppliedHooks(config) {
  return Object.entries(AUTH_HOOK_API_FIELDS).map(([hookName, fields]) => ({
    hook: hookName,
    enabled: config[fields.enabled] ?? false,
    uri: config[fields.uri] ?? null,
  }));
}

export async function patchAuthConfig(projectRef, accessToken, payload) {
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  return response;
}
