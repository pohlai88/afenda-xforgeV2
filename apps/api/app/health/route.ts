import { apiOk, methodNotAllowed } from "@repo/api";

export const GET = (): Response => apiOk({ status: "ok" });

export const POST = (): Response => methodNotAllowed(["GET"]);
