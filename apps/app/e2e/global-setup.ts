import { e2eEmail, e2ePassword } from "./helpers/credentials";
import { loadE2eEnv, requireE2eGlobalSetupEnv } from "./helpers/load-env";

interface AdminUserRecord {
  email?: string;
  id: string;
  user_metadata?: {
    activeOrganizationId?: string;
    name?: string;
  };
}

interface AdminUserList {
  users?: AdminUserRecord[];
}

interface OrganizationMemberRow {
  organizationId?: string;
}

interface E2eAdminContext {
  headers: Record<string, string>;
  url: string;
}

const createAdminContext = (): E2eAdminContext => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "";

  return {
    url,
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": "application/json",
    },
  };
};

const findExistingUser = async ({
  headers,
  url,
}: E2eAdminContext): Promise<AdminUserRecord | undefined> => {
  const listResponse = await fetch(`${url}/auth/v1/admin/users`, {
    headers,
  });

  const listBody = (await listResponse.json()) as AdminUserList;
  return listBody.users?.find((user) => user.email === e2eEmail);
};

const syncExistingUserPassword = async (
  { headers, url }: E2eAdminContext,
  existing: AdminUserRecord
): Promise<string> => {
  const updateResponse = await fetch(
    `${url}/auth/v1/admin/users/${existing.id}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({
        password: e2ePassword,
        email_confirm: true,
        user_metadata: {
          name: "E2E Playwright",
          activeOrganizationId:
            existing.user_metadata?.activeOrganizationId ?? undefined,
        },
      }),
    }
  );

  if (!updateResponse.ok) {
    console.warn(
      "E2E user password sync skipped:",
      updateResponse.status,
      await updateResponse.text()
    );
  }

  return existing.id;
};

const createE2eUser = async ({
  headers,
  url,
}: E2eAdminContext): Promise<string> => {
  const createResponse = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email: e2eEmail,
      password: e2ePassword,
      email_confirm: true,
      user_metadata: { name: "E2E Playwright" },
    }),
  });

  const createBody = (await createResponse.json()) as {
    id?: string;
    user?: { id?: string };
  };

  if (!createResponse.ok) {
    throw new Error(
      `Could not create E2E user: ${createResponse.status} ${JSON.stringify(createBody)}`
    );
  }

  const userId = createBody.id ?? createBody.user?.id;
  if (!userId) {
    throw new Error("Could not resolve E2E user id");
  }

  return userId;
};

const ensureE2eUser = async (context: E2eAdminContext): Promise<string> => {
  const existing = await findExistingUser(context);

  if (existing) {
    return syncExistingUserPassword(context, existing);
  }

  return createE2eUser(context);
};

const getAdminUser = async (
  { headers, url }: E2eAdminContext,
  userId: string
): Promise<AdminUserRecord> => {
  const userResponse = await fetch(`${url}/auth/v1/admin/users/${userId}`, {
    headers,
  });

  return (await userResponse.json()) as AdminUserRecord;
};

const findOrganizationMembership = async (
  { headers, url }: E2eAdminContext,
  userId: string
): Promise<string | undefined> => {
  const membershipResponse = await fetch(
    `${url}/rest/v1/organization_members?select=organizationId&userId=eq.${userId}&limit=1`,
    {
      headers: {
        ...headers,
        Accept: "application/json",
        "Accept-Profile": "next_forge",
      },
    }
  );

  if (!membershipResponse.ok) {
    console.warn(
      "Could not query organization_members:",
      membershipResponse.status,
      await membershipResponse.text()
    );
    return undefined;
  }

  const memberships =
    (await membershipResponse.json()) as OrganizationMemberRow[];
  return memberships[0]?.organizationId;
};

const syncActiveOrganizationMetadata = async (
  context: E2eAdminContext,
  userId: string,
  userBody: AdminUserRecord,
  organizationId: string
): Promise<void> => {
  const metadataResponse = await fetch(
    `${context.url}/auth/v1/admin/users/${userId}`,
    {
      method: "PUT",
      headers: context.headers,
      body: JSON.stringify({
        user_metadata: {
          ...(userBody.user_metadata ?? {}),
          name: "E2E Playwright",
          activeOrganizationId: organizationId,
        },
      }),
    }
  );

  if (!metadataResponse.ok) {
    console.warn(
      "Could not sync E2E active organization metadata:",
      metadataResponse.status,
      await metadataResponse.text()
    );
  }
};

const ensureActiveOrganizationMetadata = async (
  context: E2eAdminContext,
  userId: string
): Promise<void> => {
  const userBody = await getAdminUser(context, userId);
  const activeOrganizationId = userBody.user_metadata?.activeOrganizationId;

  if (activeOrganizationId) {
    return;
  }

  const organizationId = await findOrganizationMembership(context, userId);
  if (!organizationId) {
    console.warn(
      "E2E user has no organization membership to sync metadata from"
    );
    return;
  }

  await syncActiveOrganizationMetadata(
    context,
    userId,
    userBody,
    organizationId
  );
};

const globalSetup = async (): Promise<void> => {
  loadE2eEnv();
  requireE2eGlobalSetupEnv();

  const context = createAdminContext();
  const userId = await ensureE2eUser(context);

  await ensureActiveOrganizationMetadata(context, userId);

  console.log("E2E auth user ready:", e2eEmail);
};

export default globalSetup;
