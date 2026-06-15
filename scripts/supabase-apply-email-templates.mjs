#!/usr/bin/env node

/**
 * Applies auth + security notification email templates via Management API.
 * MCP has no template write tool — use after editing supabase/templates/*.html.
 *
 * Usage: pnpm supabase:apply-email-templates
 */

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const envPath = path.join(root, ".env");
const secretPath = path.join(root, ".env.secret");
const configPath = path.join(root, "supabase", "config.toml");
const templatesDir = path.join(root, "supabase", "templates");

const AUTH_TEMPLATES = {
  confirmation: {
    subjectKey: "mailer_subjects_confirmation",
    contentKey: "mailer_templates_confirmation_content",
    configSection: "auth.email.template.confirmation",
    file: "confirmation.html",
  },
  recovery: {
    subjectKey: "mailer_subjects_recovery",
    contentKey: "mailer_templates_recovery_content",
    configSection: "auth.email.template.recovery",
    file: "recovery.html",
  },
  magic_link: {
    subjectKey: "mailer_subjects_magic_link",
    contentKey: "mailer_templates_magic_link_content",
    configSection: "auth.email.template.magic_link",
    file: "magic_link.html",
  },
  invite: {
    subjectKey: "mailer_subjects_invite",
    contentKey: "mailer_templates_invite_content",
    configSection: "auth.email.template.invite",
    file: "invite.html",
  },
  reauthentication: {
    subjectKey: "mailer_subjects_reauthentication",
    contentKey: "mailer_templates_reauthentication_content",
    configSection: "auth.email.template.reauthentication",
    file: "reauthentication.html",
  },
  email_change: {
    subjectKey: "mailer_subjects_email_change",
    contentKey: "mailer_templates_email_change_content",
    configSection: "auth.email.template.email_change",
    file: "email_change.html",
  },
};

const NOTIFICATION_TEMPLATES = {
  password_changed: {
    enabledKey: "mailer_notifications_password_changed_enabled",
    subjectKey: "mailer_subjects_password_changed_notification",
    contentKey: "mailer_templates_password_changed_notification_content",
    configSection: "auth.email.notification.password_changed",
    file: "password_changed_notification.html",
  },
  email_changed: {
    enabledKey: "mailer_notifications_email_changed_enabled",
    subjectKey: "mailer_subjects_email_changed_notification",
    contentKey: "mailer_templates_email_changed_notification_content",
    configSection: "auth.email.notification.email_changed",
    file: "email_changed_notification.html",
  },
  phone_changed: {
    enabledKey: "mailer_notifications_phone_changed_enabled",
    subjectKey: "mailer_subjects_phone_changed_notification",
    contentKey: "mailer_templates_phone_changed_notification_content",
    configSection: "auth.email.notification.phone_changed",
    file: "phone_changed_notification.html",
  },
  identity_linked: {
    enabledKey: "mailer_notifications_identity_linked_enabled",
    subjectKey: "mailer_subjects_identity_linked_notification",
    contentKey: "mailer_templates_identity_linked_notification_content",
    configSection: "auth.email.notification.identity_linked",
    file: "identity_linked_notification.html",
  },
  identity_unlinked: {
    enabledKey: "mailer_notifications_identity_unlinked_enabled",
    subjectKey: "mailer_subjects_identity_unlinked_notification",
    contentKey: "mailer_templates_identity_unlinked_notification_content",
    configSection: "auth.email.notification.identity_unlinked",
    file: "identity_unlinked_notification.html",
  },
  mfa_factor_enrolled: {
    enabledKey: "mailer_notifications_mfa_factor_enrolled_enabled",
    subjectKey: "mailer_subjects_mfa_factor_enrolled_notification",
    contentKey: "mailer_templates_mfa_factor_enrolled_notification_content",
    configSection: "auth.email.notification.mfa_factor_enrolled",
    file: "mfa_factor_enrolled_notification.html",
  },
  mfa_factor_unenrolled: {
    enabledKey: "mailer_notifications_mfa_factor_unenrolled_enabled",
    subjectKey: "mailer_subjects_mfa_factor_unenrolled_notification",
    contentKey: "mailer_templates_mfa_factor_unenrolled_notification_content",
    configSection: "auth.email.notification.mfa_factor_unenrolled",
    file: "mfa_factor_unenrolled_notification.html",
  },
};

function parseToken(filePath, key) {
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

function extractSection(configText, sectionName) {
  const header = `[${sectionName}]`;
  const start = configText.indexOf(header);
  if (start === -1) {
    return "";
  }

  const rest = configText.slice(start + header.length);
  const next = rest.search(/^\[[^\]]+\]/m);
  return next === -1 ? rest : rest.slice(0, next);
}

function readTemplateSubject(configText, sectionName) {
  const section = extractSection(configText, sectionName);
  const match = section.match(/^subject\s*=\s*"((?:[^"\\]|\\.)*)"/m);
  return match?.[1]?.replaceAll('\\"', '"') ?? null;
}

function readTemplateEnabled(configText, sectionName) {
  const section = extractSection(configText, sectionName);
  const match = section.match(/^enabled\s*=\s*(true|false)/m);
  return match ? match[1] === "true" : false;
}

function readTemplateFile(fileName) {
  const contentPath = path.join(templatesDir, fileName);

  if (!fs.existsSync(contentPath)) {
    throw new Error(`Missing template file: ${contentPath}`);
  }

  return fs.readFileSync(contentPath, "utf8");
}

function buildPayload() {
  const configText = fs.readFileSync(configPath, "utf8");
  const payload = {};

  console.log("Authentication templates:");
  for (const [name, meta] of Object.entries(AUTH_TEMPLATES)) {
    const subject = readTemplateSubject(configText, meta.configSection);

    if (!subject) {
      throw new Error(
        `Missing subject in config.toml for ${meta.configSection}`
      );
    }

    payload[meta.subjectKey] = subject;
    payload[meta.contentKey] = readTemplateFile(meta.file);
    console.log(`  • ${name}: ${meta.file}`);
  }

  console.log("Security notification templates:");
  for (const [name, meta] of Object.entries(NOTIFICATION_TEMPLATES)) {
    const subject = readTemplateSubject(configText, meta.configSection);
    const enabled = readTemplateEnabled(configText, meta.configSection);

    if (!subject) {
      throw new Error(
        `Missing subject in config.toml for ${meta.configSection}`
      );
    }

    payload[meta.enabledKey] = enabled;
    payload[meta.subjectKey] = subject;
    payload[meta.contentKey] = readTemplateFile(meta.file);
    console.log(
      `  • ${name}: ${meta.file} (${enabled ? "enabled" : "disabled"})`
    );
  }

  return payload;
}

async function main() {
  const projectRef = parseToken(envPath, "SUPABASE_PROJECT_ID");
  const accessToken = parseToken(secretPath, "SUPABASE_ACCESS_TOKEN");

  if (!projectRef) {
    console.error("SUPABASE_PROJECT_ID missing in .env");
    process.exit(1);
  }

  if (!accessToken) {
    console.error(
      "SUPABASE_ACCESS_TOKEN missing in .env.secret — create one at https://supabase.com/dashboard/account/tokens"
    );
    process.exit(1);
  }

  console.log("Applying email templates to project", projectRef);
  const payload = buildPayload();

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

  if (!response.ok) {
    console.error(
      `Management API PATCH failed (${response.status}): ${await response.text()}`
    );
    process.exit(1);
  }

  const updated = await response.json();

  console.log("Email templates applied.");
  console.log(
    JSON.stringify(
      {
        auth: Object.keys(AUTH_TEMPLATES),
        notifications_enabled: Object.fromEntries(
          Object.entries(NOTIFICATION_TEMPLATES).map(([name, meta]) => [
            name,
            updated[meta.enabledKey] ?? null,
          ])
        ),
      },
      null,
      2
    )
  );
  console.log(
    "Verify in Dashboard → Authentication → Email Templates, or trigger signup / reset / reauth."
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
