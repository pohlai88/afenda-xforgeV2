import { describe, expect, it } from "vitest";
import { formatOrbitCaseActivitySummary } from "../contract/activity-format";
import { parseOrbitCaseBlobAccess } from "../contract/blob-access";
import {
  createOrbitCaseAttachmentSchema,
  deleteOrbitCaseAttachmentSchema,
} from "../contract/orbit-case.schema";
import { toOrbitCaseAttachmentDto } from "../contract/serialize";
import {
  classifyOrbitCaseTimelineBucket,
  groupOrbitCasesForTimeline,
} from "../engines/board/board-timeline-utils";
import type { OrbitCaseRecord } from "../contract/orbit-case.types";

const baseCase = (
  overrides: Partial<OrbitCaseRecord> = {}
): OrbitCaseRecord => ({
  assigneeId: null,
  createdAt: new Date("2026-06-01T12:00:00.000Z"),
  createdBy: "user_1",
  description: null,
  dueAt: null,
  id: "case_1",
  organizationId: "org_1",
  ownerId: null,
  priority: "none",
  softDeletedAt: null,
  status: "backlog",
  tags: [],
  title: "Sample",
  updatedAt: new Date("2026-06-01T12:00:00.000Z"),
  ...overrides,
});

describe("createOrbitCaseAttachmentSchema", () => {
  it("accepts attachment metadata", () => {
    const parsed = createOrbitCaseAttachmentSchema.parse({
      caseId: "case_1",
      fileName: "quote.pdf",
      contentType: "application/pdf",
      sizeBytes: 1024,
      blobUrl: "https://example.com/quote.pdf",
      blobPathname: "orbit-case/org/case/quote.pdf",
    });

    expect(parsed.fileName).toBe("quote.pdf");
    expect(parsed.blobAccess).toBe("public");
  });

  it("accepts private blob access", () => {
    const parsed = createOrbitCaseAttachmentSchema.parse({
      caseId: "case_1",
      fileName: "secret.pdf",
      contentType: "application/pdf",
      sizeBytes: 1024,
      blobUrl: "https://example.com/secret.pdf",
      blobPathname: "orbit-case/org/case/secret.pdf",
      blobAccess: "private",
    });

    expect(parsed.blobAccess).toBe("private");
  });
});

describe("parseOrbitCaseBlobAccess", () => {
  it("defaults invalid values to public", () => {
    expect(parseOrbitCaseBlobAccess(undefined)).toBe("public");
    expect(parseOrbitCaseBlobAccess("invalid")).toBe("public");
  });

  it("preserves private", () => {
    expect(parseOrbitCaseBlobAccess("private")).toBe("private");
  });
});

describe("OrbitCaseAttachmentDto contract", () => {
  it("serializes blobAccess for client boundaries", () => {
    const dto = toOrbitCaseAttachmentDto({
      id: "att_1",
      caseId: "case_1",
      organizationId: "org_1",
      uploadedBy: "user_1",
      fileName: "notes.txt",
      contentType: "text/plain",
      sizeBytes: 12,
      blobUrl: "https://example.com/notes.txt",
      blobPathname: "orbit-case/org/case/notes.txt",
      blobAccess: "private",
      createdAt: new Date("2026-06-17T00:00:00.000Z"),
    });

    expect(JSON.parse(JSON.stringify(dto))).toEqual({
      id: "att_1",
      caseId: "case_1",
      organizationId: "org_1",
      uploadedBy: "user_1",
      fileName: "notes.txt",
      contentType: "text/plain",
      sizeBytes: 12,
      blobUrl: "https://example.com/notes.txt",
      blobPathname: "orbit-case/org/case/notes.txt",
      blobAccess: "private",
      createdAt: "2026-06-17T00:00:00.000Z",
    });
  });
});

describe("deleteOrbitCaseAttachmentSchema", () => {
  it("requires attachmentId", () => {
    expect(() => deleteOrbitCaseAttachmentSchema.parse({})).toThrow();
  });
});

describe("formatOrbitCaseActivitySummary", () => {
  it("formats attachment activity", () => {
    expect(
      formatOrbitCaseActivitySummary("attachment.added", {
        fileName: "quote.pdf",
      })
    ).toBe("Attached quote.pdf");
  });
});

describe("classifyOrbitCaseTimelineBucket", () => {
  const referenceDate = new Date("2026-06-15T15:00:00.000Z");

  it("classifies overdue, today, this week, later, and no due date", () => {
    expect(
      classifyOrbitCaseTimelineBucket(
        new Date("2026-06-14T00:00:00.000Z"),
        referenceDate
      )
    ).toBe("overdue");
    expect(
      classifyOrbitCaseTimelineBucket(
        new Date("2026-06-15T00:00:00.000Z"),
        referenceDate
      )
    ).toBe("today");
    expect(
      classifyOrbitCaseTimelineBucket(
        new Date("2026-06-18T00:00:00.000Z"),
        referenceDate
      )
    ).toBe("this_week");
    expect(
      classifyOrbitCaseTimelineBucket(
        new Date("2026-06-30T00:00:00.000Z"),
        referenceDate
      )
    ).toBe("later");
    expect(classifyOrbitCaseTimelineBucket(null, referenceDate)).toBe(
      "no_due_date"
    );
  });
});

describe("groupOrbitCasesForTimeline", () => {
  it("groups cases into timeline buckets", () => {
    const referenceDate = new Date("2026-06-15T00:00:00.000Z");
    const groups = groupOrbitCasesForTimeline(
      [
        baseCase({ id: "overdue", dueAt: new Date("2026-06-10T00:00:00.000Z") }),
        baseCase({ id: "today", dueAt: new Date("2026-06-15T00:00:00.000Z") }),
        baseCase({ id: "none" }),
      ],
      referenceDate
    );

    expect(groups.find((group) => group.bucket === "overdue")?.cases[0]?.id).toBe(
      "overdue"
    );
    expect(groups.find((group) => group.bucket === "today")?.cases[0]?.id).toBe(
      "today"
    );
    expect(
      groups.find((group) => group.bucket === "no_due_date")?.cases[0]?.id
    ).toBe("none");
  });
});
