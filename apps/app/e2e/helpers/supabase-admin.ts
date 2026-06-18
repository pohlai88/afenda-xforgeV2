import { getPlaywrightBaseUrl } from "./load-env";

type AuthLinkType = "signup" | "magiclink" | "recovery" | "invite";

interface GeneratedAuthLink {
  actionLink: string;
  emailOtp: string;
  hashedToken: string;
  verificationType: string;
}

interface AdminUserRecord {
  confirmed_at?: string | null;
  email?: string;
  email_confirmed_at?: string | null;
  id: string;
}

interface AdminUserList {
  users?: AdminUserRecord[];
}

type GenerateLinkResponse = GeneratedAuthLink & {
  verification_type?: string;
  hashed_token?: string;
  email_otp?: string;
  action_link?: string;
};

const getSupabaseAdminEnv = () => ({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  serviceRoleKey:
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "",
  baseURL: getPlaywrightBaseUrl(),
});

export const hasSupabaseAdminEnv = () => {
  const { url, serviceRoleKey } = getSupabaseAdminEnv();
  return Boolean(url && serviceRoleKey);
};

const adminRequest = async <T>(
  path: string,
  init?: RequestInit
): Promise<T> => {
  const { url, serviceRoleKey } = getSupabaseAdminEnv();
  const response = await fetch(`${url}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const text = await response.text();
  let body: unknown = text;

  try {
    body = JSON.parse(text);
  } catch {
    // keep raw text for error messages
  }

  if (!response.ok) {
    throw new Error(
      `Supabase admin ${path} failed (${response.status}): ${text}`
    );
  }

  return body as T;
};

export const deleteUserByEmail = async (email: string) => {
  const list = await adminRequest<AdminUserList>("/auth/v1/admin/users");
  const user = list.users?.find((entry) => entry.email === email);

  if (!user) {
    return;
  }

  await adminRequest(`/auth/v1/admin/users/${user.id}`, { method: "DELETE" });
};

const fetchAdminUserByEmail = async (email: string) => {
  const list = await adminRequest<AdminUserList>("/auth/v1/admin/users");
  const user = list.users?.find((entry) => entry.email === email);

  if (!user) {
    return null;
  }

  return adminRequest<AdminUserRecord>(`/auth/v1/admin/users/${user.id}`);
};

export const isEmailConfirmed = async (email: string) => {
  const user = await fetchAdminUserByEmail(email);
  return Boolean(user?.email_confirmed_at ?? user?.confirmed_at);
};

export const createUnconfirmedUser = async (
  email: string,
  password: string,
  name = "E2E Email Auth"
) => {
  await deleteUserByEmail(email);

  return adminRequest("/auth/v1/admin/users", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      email_confirm: false,
      user_metadata: { name },
    }),
  });
};

export const generateAuthLink = async (
  type: AuthLinkType,
  email: string,
  options: { password?: string; redirectTo?: string } = {}
): Promise<GeneratedAuthLink> => {
  const { baseURL } = getSupabaseAdminEnv();
  const body: Record<string, unknown> = {
    type,
    email,
    options: {
      redirectTo:
        options.redirectTo ??
        `${baseURL}/auth/confirm?next=${encodeURIComponent("/")}`,
    },
  };

  if (options.password) {
    body.password = options.password;
  }

  const result = await adminRequest<GenerateLinkResponse>(
    "/auth/v1/admin/generate_link",
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );

  return {
    actionLink: result.action_link ?? result.actionLink,
    hashedToken: result.hashed_token ?? result.hashedToken,
    verificationType: result.verification_type ?? result.verificationType,
    emailOtp: result.email_otp ?? result.emailOtp,
  };
};

export const buildConfirmUrl = (
  baseURL: string,
  link: GeneratedAuthLink,
  next = "/"
) => {
  const params = new URLSearchParams({
    token_hash: link.hashedToken,
    type: link.verificationType,
    next,
  });

  return `${baseURL}/auth/confirm?${params.toString()}`;
};

export const createE2ePassword = () => `E2e-${Date.now()}!Zx9`;

export const createE2eEmail = (prefix: string) =>
  `${prefix}-${Date.now()}@xforge.local`;

interface E2eAdminUserRecord {
  email?: string;
  email_confirmed_at?: string | null;
  id: string;
  user_metadata?: {
    activeOrganizationId?: string;
    name?: string;
  };
}

interface OrganizationMemberRow {
  organizationId?: string;
}

export interface E2eUserHealth {
  activeOrganizationId?: string;
  email: string;
  emailConfirmed: boolean;
  exists: boolean;
  organizationId?: string;
  userId?: string;
}

export const getE2eUserHealth = async (
  email: string
): Promise<E2eUserHealth> => {
  const list = await adminRequest<{ users?: E2eAdminUserRecord[] }>(
    "/auth/v1/admin/users"
  );
  const user = list.users?.find((entry) => entry.email === email);

  if (!user) {
    return { email, exists: false, emailConfirmed: false };
  }

  const detail = await adminRequest<E2eAdminUserRecord>(
    `/auth/v1/admin/users/${user.id}`
  );

  let organizationId: string | undefined;
  try {
    organizationId = await findOrganizationMembershipForUser(user.id);
  } catch {
    // membership probe is best-effort for env reporting
  }

  return {
    email,
    exists: true,
    userId: user.id,
    emailConfirmed: Boolean(
      detail.email_confirmed_at ?? user.email_confirmed_at
    ),
    activeOrganizationId: detail.user_metadata?.activeOrganizationId,
    organizationId,
  };
};

export const isE2eUserReadyForAuthenticatedTests = (
  health: E2eUserHealth
): boolean =>
  health.exists && health.emailConfirmed && Boolean(health.organizationId);

interface EnsureE2eAuthUserInput {
  displayName?: string;
  email: string;
  password: string;
}

const fetchE2eAdminUserById = async (
  userId: string
): Promise<E2eAdminUserRecord> =>
  adminRequest<E2eAdminUserRecord>(`/auth/v1/admin/users/${userId}`);

const findOrganizationMembershipForUser = async (
  userId: string
): Promise<string | undefined> => {
  try {
    const memberships = await adminRequest<OrganizationMemberRow[]>(
      `/rest/v1/organization_members?select=organizationId&userId=eq.${userId}&limit=1`,
      {
        headers: {
          Accept: "application/json",
          "Accept-Profile": "next_forge",
        },
      }
    );

    return memberships[0]?.organizationId;
  } catch (error) {
    console.warn(
      "Could not query organization_members:",
      error instanceof Error ? error.message : String(error)
    );
    return undefined;
  }
};

const syncE2eUserActiveOrganization = async (userId: string): Promise<void> => {
  const userBody = await fetchE2eAdminUserById(userId);

  if (userBody.user_metadata?.activeOrganizationId) {
    return;
  }

  const organizationId = await findOrganizationMembershipForUser(userId);

  if (!organizationId) {
    console.warn(
      "E2E user has no organization membership to sync metadata from"
    );
    return;
  }

  const metadataResponse = await adminRequest<unknown>(
    `/auth/v1/admin/users/${userId}`,
    {
      method: "PUT",
      body: JSON.stringify({
        user_metadata: {
          ...(userBody.user_metadata ?? {}),
          name: userBody.user_metadata?.name ?? "E2E Playwright",
          activeOrganizationId: organizationId,
        },
      }),
    }
  ).catch(async (error) => {
    console.warn(
      "Could not sync E2E active organization metadata:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  });

  if (metadataResponse === null) {
    return;
  }
};

const createE2eAuthUser = async ({
  displayName,
  email,
  password,
}: EnsureE2eAuthUserInput): Promise<string> => {
  const createBody = await adminRequest<{ id?: string; user?: { id?: string } }>(
    "/auth/v1/admin/users",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: { name: displayName ?? "E2E Playwright" },
      }),
    }
  );

  const userId = createBody.id ?? createBody.user?.id;

  if (!userId) {
    throw new Error("Could not resolve E2E user id");
  }

  return userId;
};

const syncExistingE2eAuthUser = async (
  existing: E2eAdminUserRecord,
  input: EnsureE2eAuthUserInput
): Promise<string> => {
  const { url, serviceRoleKey } = getSupabaseAdminEnv();
  const updateResponse = await fetch(`${url}/auth/v1/admin/users/${existing.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: input.password,
      email_confirm: true,
      user_metadata: {
        name: input.displayName ?? "E2E Playwright",
        activeOrganizationId:
          existing.user_metadata?.activeOrganizationId ?? undefined,
      },
    }),
  });

  if (!updateResponse.ok) {
    console.warn(
      "E2E user password sync skipped:",
      updateResponse.status,
      await updateResponse.text()
    );
  }

  return existing.id;
};

export const ensureE2eAuthUser = async (
  input: EnsureE2eAuthUserInput
): Promise<string> => {
  const list = await adminRequest<{ users?: E2eAdminUserRecord[] }>(
    "/auth/v1/admin/users"
  );
  const existing = list.users?.find((user) => user.email === input.email);
  const userId = existing
    ? await syncExistingE2eAuthUser(existing, input)
    : await createE2eAuthUser(input);

  await syncE2eUserActiveOrganization(userId);
  return userId;
};
