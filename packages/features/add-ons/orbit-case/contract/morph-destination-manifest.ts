import type { OrbitPushCapability } from "./push.schema";
import type { PushTemplateDefinition } from "./template.schema";

type OrbitMorphVisibleRole = "owner" | "editor" | "member";

export interface OrbitMorphDestinationSlice {
  capability: OrbitPushCapability;
  destinationId: string;
  hasAppRoute: boolean;
  label: string;
  registerSystemDefaults: boolean;
  segment: string;
  targetType: string;
  templateFields: PushTemplateDefinition["fields"];
  visibleToRoles: OrbitMorphVisibleRole[];
}

const titleField = {
  key: "title",
  label: "Title",
  type: "text" as const,
  required: true,
};

const optionalText = (key: string, label: string) => ({
  key,
  label,
  type: "text" as const,
  required: false,
});

export const ORBIT_MORPH_DESTINATION_MANIFEST = [
  {
    capability: "budget",
    destinationId: "budget-request",
    hasAppRoute: true,
    label: "Budget Request",
    registerSystemDefaults: true,
    segment: "budget",
    targetType: "budget-request",
    templateFields: [titleField, optionalText("amount", "Amount")],
    visibleToRoles: ["owner", "editor"],
  },
  {
    capability: "meeting",
    destinationId: "meeting-request",
    hasAppRoute: true,
    label: "Meeting Request",
    registerSystemDefaults: true,
    segment: "meeting",
    targetType: "meeting-request",
    templateFields: [
      titleField,
      optionalText("scheduledAt", "Scheduled at"),
      optionalText("location", "Location"),
    ],
    visibleToRoles: ["owner", "editor", "member"],
  },
  {
    capability: "approval",
    destinationId: "approval-request",
    hasAppRoute: true,
    label: "Approval Request",
    registerSystemDefaults: true,
    segment: "approval",
    targetType: "approval-request",
    templateFields: [
      titleField,
      optionalText("approver", "Approver"),
      optionalText("amount", "Amount"),
    ],
    visibleToRoles: ["owner", "editor"],
  },
  {
    capability: "purchase",
    destinationId: "purchase-request",
    hasAppRoute: true,
    label: "Purchase Request",
    registerSystemDefaults: true,
    segment: "purchase",
    targetType: "purchase-request",
    templateFields: [
      titleField,
      optionalText("vendor", "Vendor"),
      optionalText("amount", "Amount"),
    ],
    visibleToRoles: ["owner", "editor"],
  },
  {
    capability: "lead",
    destinationId: "lead-request",
    hasAppRoute: true,
    label: "Lead Request",
    registerSystemDefaults: true,
    segment: "lead",
    targetType: "lead-request",
    templateFields: [
      titleField,
      optionalText("contact", "Contact"),
      optionalText("company", "Company"),
    ],
    visibleToRoles: ["owner", "editor"],
  },
  {
    capability: "complaint",
    destinationId: "complaint-request",
    hasAppRoute: true,
    label: "Complaint Request",
    registerSystemDefaults: true,
    segment: "complaint",
    targetType: "complaint-request",
    templateFields: [
      titleField,
      optionalText("category", "Category"),
      optionalText("severity", "Severity"),
    ],
    visibleToRoles: ["owner", "editor"],
  },
  {
    capability: "risk",
    destinationId: "risk-request",
    hasAppRoute: true,
    label: "Risk Request",
    registerSystemDefaults: true,
    segment: "risk",
    targetType: "risk-request",
    templateFields: [
      titleField,
      optionalText("riskLevel", "Risk level"),
      optionalText("owner", "Owner"),
    ],
    visibleToRoles: ["owner", "editor"],
  },
  {
    capability: "project",
    destinationId: "project-request",
    hasAppRoute: true,
    label: "Project Request",
    registerSystemDefaults: true,
    segment: "project",
    targetType: "project-request",
    templateFields: [
      titleField,
      optionalText("startDate", "Start date"),
      optionalText("budget", "Budget"),
    ],
    visibleToRoles: ["owner", "editor"],
  },
  {
    capability: "investigation",
    destinationId: "investigation-request",
    hasAppRoute: true,
    label: "Investigation Request",
    registerSystemDefaults: true,
    segment: "investigation",
    targetType: "investigation-request",
    templateFields: [
      titleField,
      optionalText("subject", "Subject"),
      optionalText("priority", "Priority"),
    ],
    visibleToRoles: ["owner", "editor"],
  },
  {
    capability: "capa",
    destinationId: "capa-request",
    hasAppRoute: true,
    label: "CAPA Request",
    registerSystemDefaults: true,
    segment: "capa",
    targetType: "capa-request",
    templateFields: [
      titleField,
      optionalText("rootCause", "Root cause"),
      optionalText("dueDate", "Due date"),
    ],
    visibleToRoles: ["owner", "editor"],
  },
  {
    capability: "contract-review",
    destinationId: "contract-review-request",
    hasAppRoute: true,
    label: "Contract Review Request",
    registerSystemDefaults: true,
    segment: "contract-review",
    targetType: "contract-review-request",
    templateFields: [
      titleField,
      optionalText("counterparty", "Counterparty"),
      optionalText("expiryDate", "Expiry date"),
    ],
    visibleToRoles: ["owner", "editor"],
  },
] as const satisfies readonly OrbitMorphDestinationSlice[];

export type OrbitMorphManifestSlice =
  (typeof ORBIT_MORPH_DESTINATION_MANIFEST)[number];

export type OrbitMorphSegment = OrbitMorphManifestSlice["segment"];

export type OrbitMorphTargetType =
  (typeof ORBIT_MORPH_DESTINATION_MANIFEST)[number]["targetType"];

export const ORBIT_MORPH_ROUTED_SLICES = ORBIT_MORPH_DESTINATION_MANIFEST.filter(
  (slice) => slice.hasAppRoute
);

export const listRoutedMorphSlices = (): OrbitMorphManifestSlice[] =>
  ORBIT_MORPH_ROUTED_SLICES;

export const ORBIT_BUDGET_REQUEST_TARGET_TYPE = "budget-request" as const;
export const ORBIT_MEETING_REQUEST_TARGET_TYPE = "meeting-request" as const;
export const ORBIT_APPROVAL_REQUEST_TARGET_TYPE = "approval-request" as const;

export const ORBIT_MORPH_DESTINATIONS = ORBIT_MORPH_DESTINATION_MANIFEST.map(
  (slice) => ({
    hasAppRoute: slice.hasAppRoute,
    segment: slice.segment,
    targetType: slice.targetType,
  })
);

export const ORBIT_MORPH_ROUTED_DESTINATIONS = ORBIT_MORPH_ROUTED_SLICES.map(
  (slice) => ({
    hasAppRoute: slice.hasAppRoute,
    segment: slice.segment,
    targetType: slice.targetType,
  })
);

export const resolveMorphSliceByTargetType = (
  targetType: string
): OrbitMorphManifestSlice | null =>
  ORBIT_MORPH_DESTINATION_MANIFEST.find(
    (slice) => slice.targetType === targetType
  ) ?? null;

export const resolveMorphSliceByDestinationId = (
  destinationId: string
): OrbitMorphManifestSlice | null =>
  ORBIT_MORPH_DESTINATION_MANIFEST.find(
    (slice) => slice.destinationId === destinationId
  ) ?? null;

export const listMorphSlicesWithSystemDefaults = (): OrbitMorphManifestSlice[] =>
  ORBIT_MORPH_DESTINATION_MANIFEST.filter((slice) => slice.registerSystemDefaults);
