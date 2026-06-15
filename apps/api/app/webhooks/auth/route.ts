import { apiError, methodNotAllowed } from "@repo/api";

export const POST = async (): Promise<Response> =>
  apiError(
    "not_implemented",
    "Supabase auth webhook is not configured. Organization bootstrap runs on first authenticated app load.",
    501
  );

export const GET = (): Response => methodNotAllowed(["POST"]);
