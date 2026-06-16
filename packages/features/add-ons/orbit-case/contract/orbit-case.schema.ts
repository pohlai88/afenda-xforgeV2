import { z } from "zod";
import { ORBIT_CASE_PRIORITIES, ORBIT_CASE_STATUSES } from "./status";

export const orbitCaseStatusSchema = z.enum(ORBIT_CASE_STATUSES);

export const orbitCasePrioritySchema = z.enum(ORBIT_CASE_PRIORITIES);

export const createOrbitCaseSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional(),
  status: orbitCaseStatusSchema.default("backlog"),
  priority: orbitCasePrioritySchema.default("none"),
  ownerId: z.string().min(1).optional(),
  assigneeId: z.string().min(1).optional(),
  dueAt: z.coerce.date().optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
});

export type CreateOrbitCaseInput = z.infer<typeof createOrbitCaseSchema>;

export const updateOrbitCaseSchema = z.object({
  caseId: z.string().min(1),
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(5000).nullable().optional(),
  status: orbitCaseStatusSchema.optional(),
  priority: orbitCasePrioritySchema.optional(),
  ownerId: z.string().min(1).nullable().optional(),
  assigneeId: z.string().min(1).nullable().optional(),
  dueAt: z.coerce.date().nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
});

export type UpdateOrbitCaseInput = z.infer<typeof updateOrbitCaseSchema>;

export const listOrbitCasesFilterSchema = z.object({
  status: orbitCaseStatusSchema.optional(),
  assigneeId: z.string().min(1).optional(),
  tag: z.string().trim().min(1).optional(),
  includeCancelled: z.boolean().optional(),
  dueFrom: z.coerce.date().optional(),
  dueTo: z.coerce.date().optional(),
  limit: z.number().int().positive().max(200).optional(),
});

export type ListOrbitCasesFilter = z.infer<typeof listOrbitCasesFilterSchema>;

export const assignOrbitCaseSchema = z.object({
  caseId: z.string().min(1),
  assigneeId: z.string().min(1).nullable(),
});

export const watchOrbitCaseSchema = z.object({
  caseId: z.string().min(1),
  watching: z.boolean(),
});

export const createOrbitCaseCommentSchema = z.object({
  caseId: z.string().min(1),
  body: z.string().trim().min(1).max(5000),
});

export const deleteOrbitCaseSchema = z.object({
  caseId: z.string().min(1),
  hard: z.boolean().optional(),
});

export const getOrbitCaseSchema = z.object({
  caseId: z.string().min(1),
});

export const listOrbitCaseActivitySchema = z.object({
  caseId: z.string().min(1),
});

export const createOrbitCaseAttachmentSchema = z.object({
  caseId: z.string().min(1),
  fileName: z.string().trim().min(1).max(255),
  contentType: z.string().trim().min(1).max(200),
  sizeBytes: z.number().int().positive().max(5 * 1024 * 1024),
  blobUrl: z.string().url(),
  blobPathname: z.string().trim().min(1).max(500),
});

export const deleteOrbitCaseAttachmentSchema = z.object({
  attachmentId: z.string().min(1),
});

export const listOrbitCaseAttachmentsSchema = z.object({
  caseId: z.string().min(1),
});

export const orbitCaseCalendarBoardSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  month: z.number().int().min(1).max(12),
});
