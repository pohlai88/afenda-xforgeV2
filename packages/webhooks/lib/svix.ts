import "server-only";
import { requireOrg } from "@repo/auth/server";
import { Svix } from "svix";
import { keys } from "../keys";

const svixToken = keys().SVIX_TOKEN;

export const send = async (eventType: string, payload: object) => {
  if (!svixToken) {
    throw new Error("SVIX_TOKEN is not set");
  }

  try {
    const { orgId } = await requireOrg();
    const svix = new Svix(svixToken);

    return svix.message.create(orgId, {
      eventType,
      payload: {
        eventType,
        ...payload,
      },
      application: {
        name: orgId,
        uid: orgId,
      },
    });
  } catch {
    return;
  }
};

export const getAppPortal = async () => {
  if (!svixToken) {
    throw new Error("SVIX_TOKEN is not set");
  }

  try {
    const { orgId } = await requireOrg();
    const svix = new Svix(svixToken);

    return svix.authentication.appPortalAccess(orgId, {
      application: {
        name: orgId,
        uid: orgId,
      },
    });
  } catch {
    return;
  }
};
