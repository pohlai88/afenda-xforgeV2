import { z } from "zod";
import { orbitCaseStatusSchema } from "./orbit-case.schema";

export const ORBIT_EVENT_CASE_CREATED = "orbit.case.created" as const;
export const ORBIT_EVENT_CASE_PUSHED = "orbit.case.pushed" as const;

export const orbitCaseCreatedEventSchema = z.object({
  caseId: z.string().min(1),
  title: z.string().min(1),
  status: orbitCaseStatusSchema,
  createdAt: z.string().datetime(),
  createdBy: z.string().min(1),
});

export type OrbitCaseCreatedEvent = z.infer<typeof orbitCaseCreatedEventSchema>;

export const orbitCasePushedEventSchema = z.object({
  caseId: z.string().min(1),
  destinationId: z.string().min(1),
  pushEventId: z.string().min(1),
  targetType: z.string().min(1),
  targetId: z.string().min(1),
});

export type OrbitCasePushedEvent = z.infer<typeof orbitCasePushedEventSchema>;

export const buildOrbitCaseCreatedEvent = (input: {
  caseId: string;
  title: string;
  status: OrbitCaseCreatedEvent["status"];
  createdAt: string;
  createdBy: string;
}): OrbitCaseCreatedEvent => orbitCaseCreatedEventSchema.parse(input);

export const buildOrbitCasePushedEvent = (input: {
  caseId: string;
  destinationId: string;
  pushEventId: string;
  targetType: string;
  targetId: string;
}): OrbitCasePushedEvent => orbitCasePushedEventSchema.parse(input);
