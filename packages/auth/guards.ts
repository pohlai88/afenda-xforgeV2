import "server-only";

import { authSuccess, mapAuthError } from "./auth-result";
import { auth, requireAuth, requireOrg } from "./server";
import type { AuthActionResult, AuthenticatedContext } from "./types";

export const withAuth = async <TData>(
  handler: (context: AuthenticatedContext) => Promise<TData>
): Promise<AuthActionResult<TData>> => {
  try {
    return authSuccess(await handler(await requireAuth()));
  } catch (error) {
    return mapAuthError(error);
  }
};

export const withOrg = async <TData>(
  handler: (
    context: AuthenticatedContext & { orgId: string }
  ) => Promise<TData>
): Promise<AuthActionResult<TData>> => {
  try {
    return authSuccess(await handler(await requireOrg()));
  } catch (error) {
    return mapAuthError(error);
  }
};

export const getOptionalAuth = async (): Promise<
  AuthActionResult<AuthenticatedContext | null>
> => {
  try {
    const context = await auth();

    if (context.userId === null) {
      return authSuccess(null);
    }

    return authSuccess(context);
  } catch (error) {
    return mapAuthError(error);
  }
};
