import type { OrganizationRole } from "@repo/auth/organization-roles";
import type { OrbitCaseRecord } from "../../contract/orbit-case.types";
import type { ExecutePushInput, OrbitPushCapability } from "../../contract/push.schema";
import type { PushDestinationDefinition } from "../../contract/push.schema";
import type { PushTemplateDefinition } from "../../contract/template.schema";

export interface ExecutePushContext {
  actorId: string;
  organizationId: string;
  role: OrganizationRole;
  userCapabilities: readonly OrbitPushCapability[];
}

export interface PushHandlerMeta {
  destination: PushDestinationDefinition;
  orbitCase: OrbitCaseRecord;
  pushEventId: string;
  template: PushTemplateDefinition;
}

export type PushDestinationHandler = (
  context: ExecutePushContext,
  input: ExecutePushInput,
  meta: PushHandlerMeta
) => Promise<{ targetId: string; targetType: string }>;
