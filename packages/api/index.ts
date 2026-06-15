import { parseError } from "@repo/observability/error";
import { log } from "@repo/observability/log";
import { keys } from "./keys";

export const API_ERROR_STATUS = {
  bad_request: 400,
  forbidden: 403,
  internal_error: 500,
  invalid_json: 400,
  invalid_request: 400,
  invalid_signature: 400,
  method_not_allowed: 405,
  missing_signature: 400,
  not_configured: 503,
  not_found: 404,
  not_implemented: 501,
  unauthorized: 401,
  unsupported_media_type: 415,
} as const;

export type ApiErrorCode = keyof typeof API_ERROR_STATUS;
export type ApiErrorStatus<Code extends ApiErrorCode> =
  (typeof API_ERROR_STATUS)[Code];

interface SafeParseSchema<T> {
  safeParse(payload: unknown):
    | {
        success: true;
        data: T;
      }
    | {
        success: false;
        error: {
          issues: unknown;
        };
      };
}

export interface ApiErrorBody {
  code: ApiErrorCode;
  details?: unknown;
  message: string;
}

export interface ApiSuccess<T> {
  data: T;
  ok: true;
}

export interface ApiFailure {
  error: ApiErrorBody;
  ok: false;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export class ApiError<Code extends ApiErrorCode = ApiErrorCode> extends Error {
  readonly code: Code;
  readonly details: unknown;
  readonly status: ApiErrorStatus<Code>;

  constructor(
    code: Code,
    message: string,
    status: ApiErrorStatus<Code> = API_ERROR_STATUS[code],
    details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

const withJsonHeaders = (init?: ResponseInit): ResponseInit => {
  const headers = new Headers(init?.headers);

  if (!headers.has("Cache-Control")) {
    headers.set("Cache-Control", "no-store");
  }

  if (!headers.has("X-Content-Type-Options")) {
    headers.set("X-Content-Type-Options", "nosniff");
  }

  return {
    ...init,
    headers,
  };
};

export const apiOk = <T>(data: T, init?: ResponseInit): Response =>
  Response.json(
    {
      ok: true,
      data,
    } satisfies ApiSuccess<T>,
    withJsonHeaders(init)
  );

export const apiError = <Code extends ApiErrorCode>(
  code: Code,
  message: string,
  status: ApiErrorStatus<Code> = API_ERROR_STATUS[code],
  details?: unknown,
  init?: ResponseInit
): Response => {
  const body: ApiFailure = {
    ok: false,
    error:
      details === undefined ? { code, message } : { code, message, details },
  };

  return Response.json(body, withJsonHeaders({ ...init, status }));
};

export const methodNotAllowed = (allowedMethods: readonly string[]): Response =>
  apiError(
    "method_not_allowed",
    "Method not allowed",
    405,
    {
      allowedMethods,
    },
    {
      headers: {
        Allow: allowedMethods.join(", "),
      },
    }
  );

export const withApiRoute =
  (handler: (request: Request) => Response | Promise<Response>) =>
  async (request: Request): Promise<Response> => {
    try {
      return await handler(request);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status >= 500) {
          log.error(error.message);
        }

        return apiError(error.code, error.message, error.status, error.details);
      }

      parseError(error);

      return apiError("internal_error", "Internal server error", 500);
    }
  };

export const requireCronSecret = (request: Request): void => {
  const cronSecret = keys().CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!(cronSecret && authHeader === `Bearer ${cronSecret}`)) {
    throw new ApiError("unauthorized", "Unauthorized", 401);
  }
};

export const resolveSafeRedirect = (next: string | null): string =>
  next?.startsWith("/") && !next.startsWith("//") ? next : "/";

export const parseJsonBody = async <T>(
  schema: SafeParseSchema<T>,
  request: Request
): Promise<T> => {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    throw new ApiError("invalid_json", "Request body must be valid JSON", 400);
  }

  const result = schema.safeParse(payload);

  if (!result.success) {
    throw new ApiError("invalid_request", "Request body is invalid", 400, {
      issues: result.error.issues,
    });
  }

  return result.data;
};
