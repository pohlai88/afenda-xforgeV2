import { z } from "zod";

export const ORBIT_PUSH_CAPABILITIES = [
  "meeting",
  "task",
  "approval",
  "budget",
  "purchase",
  "investigation",
  "complaint",
  "lead",
  "risk",
  "project",
  "capa",
  "contract-review",
] as const;

export type OrbitPushCapability = (typeof ORBIT_PUSH_CAPABILITIES)[number];

export const orbitPushCapabilitySchema = z.enum(ORBIT_PUSH_CAPABILITIES);

export const pushDestinationSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  templateId: z.string().min(1),
  requiredCapabilities: z.array(orbitPushCapabilitySchema).min(1),
  visibleToRoles: z.array(z.enum(["owner", "editor", "member"])).min(1),
});

export type PushDestinationDefinition = z.infer<typeof pushDestinationSchema>;

export const executePushSchema = z.object({
  caseId: z.string().min(1),
  destinationId: z.string().min(1),
  idempotencyKey: z.string().min(1).max(128),
  fieldValues: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null()])
    )
    .default({}),
});

export type ExecutePushInput = z.infer<typeof executePushSchema>;

export const pushResultSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    pushEventId: z.string().min(1),
    targetType: z.string().min(1),
    targetId: z.string().min(1),
    linkId: z.string().min(1),
    cached: z.boolean(),
  }),
  z.object({
    ok: z.literal(false),
    code: z.enum(["destination_not_registered", "missing_fields", "forbidden"]),
    missingFields: z.array(z.string()).optional(),
  }),
]);

export type PushResultDto = z.infer<typeof pushResultSchema>;

export const parseStoredPushResult = (value: unknown): PushResultDto | null => {
  const parsed = pushResultSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
};
