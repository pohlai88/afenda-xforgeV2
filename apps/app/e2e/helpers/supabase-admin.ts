export type AuthLinkType = "signup" | "magiclink" | "recovery" | "invite";

export type GeneratedAuthLink = {
  actionLink: string;
  hashedToken: string;
  verificationType: string;
  emailOtp: string;
};

type AdminUserRecord = {
  id: string;
  email?: string;
  email_confirmed_at?: string | null;
  confirmed_at?: string | null;
};

type AdminUserList = {
  users?: AdminUserRecord[];
};

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
  baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
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

export const fetchAdminUserByEmail = async (email: string) => {
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

export const getPlaywrightBaseUrl = () =>
  process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
