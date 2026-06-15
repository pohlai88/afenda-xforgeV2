import type { MetadataDataSources } from "../metadata-renderer";
import type { MetadataPage } from "../metadata-schema";

const auditEvidenceReviewMetadata = {
  blocks: [
    {
      blockId: "audit-evidence-header",
      description:
        "Evidence review workspace for immutable audit records and failed vendor sync recovery.",
      intent: "audit",
      status: { label: "Evidence required", tone: "warning" },
      title: "Audit evidence review",
      type: "pageHeader",
    },
    {
      blockId: "audit-evidence-empty",
      description:
        "No approved evidence exists for the selected policy exception.",
      intent: "audit",
      title: "Evidence missing",
      tone: "warning",
      type: "emptyPanel",
    },
    {
      actions: [
        {
          actionId: "retrySync",
          auditEvent: "audit.evidence.retry_sync.requested",
          key: "retry-sync",
          label: "Retry sync",
          variant: "secondary",
        },
      ],
      blockId: "audit-evidence-error",
      description:
        "Vendor evidence service failed and requires an operator retry.",
      state: "error",
      title: "Evidence sync failed",
      type: "runtimeState",
    },
  ],
  pageId: "audit-evidence-review",
  version: 1,
} satisfies MetadataPage;

const auditEvidenceReviewDataSources = {
  evidence: {
    summary: {
      missing: 1,
      synced: 0,
    },
  },
} satisfies MetadataDataSources;

export { auditEvidenceReviewDataSources, auditEvidenceReviewMetadata };
