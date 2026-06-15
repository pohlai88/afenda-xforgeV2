import "server-only";

import { authSuccess, mapAuthError } from "./auth-result";
import { requireEditor, requireOwner } from "./cms";
import { requireAuth, requireOrg } from "./server";
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
  handler: (context: AuthenticatedContext & { orgId: string }) => Promise<TData>
): Promise<AuthActionResult<TData>> => {
  try {
    return authSuccess(await handler(await requireOrg()));
  } catch (error) {
    return mapAuthError(error);
  }
};

export const withEditor = async <TData>(
  handler: (
    context: AuthenticatedContext & {
      orgId: string;
      role: "owner" | "editor";
    }
  ) => Promise<TData>
): Promise<AuthActionResult<TData>> => {
  try {
    return authSuccess(await handler(await requireEditor()));
  } catch (error) {
    return mapAuthError(error);
  }
};

export const withOwner = async <TData>(
  handler: (
    context: AuthenticatedContext & { orgId: string; role: "owner" }
  ) => Promise<TData>
): Promise<AuthActionResult<TData>> => {
  try {
    return authSuccess(await handler(await requireOwner()));
  } catch (error) {
    return mapAuthError(error);
  }
};
