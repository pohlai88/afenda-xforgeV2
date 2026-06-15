import { fileURLToPath } from "node:url";
import path from "node:path";
import { loadE2eEnv } from "../e2e/helpers/load-env.mjs";

const appDir = path.dirname(fileURLToPath(import.meta.url));

loadE2eEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SECRET_KEY ??
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  "";
const email = "e2e-playwright@xforge.local";
const password =
  process.env.E2E_AUTH_PASSWORD ??
  process.env.E2E_ORG_ADMIN_PASSWORD ??
  "123qweasdzxc!@#";

if (!url || !key) {
  console.error("Missing Supabase env");
  process.exit(1);
}

const adminHeaders = {
  Authorization: `Bearer ${key}`,
  apikey: key,
  "Content-Type": "application/json",
};

const listResponse = await fetch(`${url}/auth/v1/admin/users`, {
  headers: adminHeaders,
});

const listBody = await listResponse.json();
const existing = listBody.users?.find((user) => user.email === email);

let userId = existing?.id;

if (existing) {
  const updateResponse = await fetch(`${url}/auth/v1/admin/users/${existing.id}`, {
    method: "PUT",
    headers: adminHeaders,
    body: JSON.stringify({
      password,
      email_confirm: true,
      user_metadata: {
        name: "E2E Playwright",
        activeOrganizationId:
          existing.user_metadata?.activeOrganizationId ?? undefined,
      },
    }),
  });

  console.log("update", updateResponse.status, await updateResponse.text());
} else {
  const createResponse = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers: adminHeaders,
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: "E2E Playwright" },
    }),
  });

  const createBody = await createResponse.json();
  console.log("create", createResponse.status, JSON.stringify(createBody));
  userId = createBody.id ?? createBody.user?.id;
}

if (!userId) {
  console.error("Could not resolve E2E user id");
  process.exit(1);
}

const userResponse = await fetch(`${url}/auth/v1/admin/users/${userId}`, {
  headers: adminHeaders,
});
const userBody = await userResponse.json();
const activeOrganizationId = userBody.user_metadata?.activeOrganizationId;

if (!activeOrganizationId) {
  const membershipResponse = await fetch(
    `${url}/rest/v1/organization_members?select=organizationId&userId=eq.${userId}&limit=1`,
    {
      headers: {
        ...adminHeaders,
        Accept: "application/json",
        "Accept-Profile": "next_forge",
      },
    }
  );

  if (membershipResponse.ok) {
    const memberships = await membershipResponse.json();
    const organizationId = memberships[0]?.organizationId;

    if (organizationId) {
      const metadataResponse = await fetch(`${url}/auth/v1/admin/users/${userId}`, {
        method: "PUT",
        headers: adminHeaders,
        body: JSON.stringify({
          user_metadata: {
            ...(userBody.user_metadata ?? {}),
            name: "E2E Playwright",
            activeOrganizationId: organizationId,
          },
        }),
      });

      console.log(
        "metadata",
        metadataResponse.status,
        await metadataResponse.text()
      );
    } else {
      console.warn("E2E user has no organization membership to sync metadata from");
    }
  } else {
    console.warn(
      "Could not query organization_members:",
      membershipResponse.status,
      await membershipResponse.text()
    );
  }
}

console.log("E2E auth user ready:", email);
