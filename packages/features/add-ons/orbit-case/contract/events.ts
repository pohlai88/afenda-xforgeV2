import { z } from "zod";
import { orbitCaseStatusSchema } from "./orbit-case.schema";
import { orbitMorphTargetSummarySchema } from "./morph-target-summary";

export const ORBIT_EVENT_CASE_CREATED = "orbit.case.created" as const;
export const ORBIT_EVENT_CASE_PUSHED = "orbit.case.pushed" as const;
export const ORBIT_EVENT_CASE_ASSIGNED = "orbit.case.assigned" as const;
export const ORBIT_EVENT_MORPH_UPDATED = "orbit.morph.updated" as const;

export const orbitCaseCreatedEventSchema = z.object({
  caseId: z.string().min(1),
  createdAt: z.string().datetime(),
  createdBy: z.string().min(1),
  status: orbitCaseStatusSchema,
  title: z.string().min(1),
});

export type OrbitCaseCreatedEvent = z.infer<typeof orbitCaseCreatedEventSchema>;

export const orbitCasePushedEventSchema = z.object({
  caseId: z.string().min(1),
  destinationId: z.string().min(1),
  morphTarget: orbitMorphTargetSummarySchema.optional(),
  pushEventId: z.string().min(1),
  targetId: z.string().min(1),
  targetType: z.string().min(1),
});

export type OrbitCasePushedEvent = z.infer<typeof orbitCasePushedEventSchema>;

export const orbitCaseAssignedEventSchema = z.object({
  assigneeId: z.string().min(1),
  caseId: z.string().min(1),
  title: z.string().min(1),
});

export type OrbitCaseAssignedEvent = z.infer<
  typeof orbitCaseAssignedEventSchema
>;

export const orbitMorphUpdatedEventSchema = z.object({
  assigneeId: z.string().min(1).nullable(),
  caseId: z.string().min(1),
  morphTarget: orbitMorphTargetSummarySchema,
});

export type OrbitMorphUpdatedEvent = z.infer<
  typeof orbitMorphUpdatedEventSchema
>;

export const buildOrbitCaseCreatedEvent = (
  input: OrbitCaseCreatedEvent
): OrbitCaseCreatedEvent => orbitCaseCreatedEventSchema.parse(input);

export const buildOrbitCasePushedEvent = (
  input: OrbitCasePushedEvent
): OrbitCasePushedEvent => orbitCasePushedEventSchema.parse(input);

export const buildOrbitCaseAssignedEvent = (
  input: OrbitCaseAssignedEvent
): OrbitCaseAssignedEvent => orbitCaseAssignedEventSchema.parse(input);

export const buildOrbitMorphUpdatedEvent = (
  input: OrbitMorphUpdatedEvent
): OrbitMorphUpdatedEvent => orbitMorphUpdatedEventSchema.parse(input);
