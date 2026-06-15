import type { MetadataDataSources } from "../metadata-renderer";
import type { MetadataPage } from "../metadata-schema";

const tenantConfigurationMetadata = {
  blocks: [
    {
      actions: [
        {
          actionId: "requestAccess",
          key: "request-access",
          label: "Request access",
          permission: "tenant.configuration.requestAccess",
          variant: "secondary",
        },
      ],
      blockId: "tenant-config-header",
      description:
        "Configuration metadata fixture for policy setup, permissions, and readonly runtime state.",
      intent: "configuration",
      orchestration: { isReadonly: true },
      status: { label: "Read-only", tone: "warning" },
      title: "Tenant configuration",
      type: "pageHeader",
    },
    {
      activeFilters: [
        { id: "scope", label: "Scope: tenant", tone: "info" },
        { id: "mode", label: "Mode: readonly", tone: "warning" },
      ],
      blockId: "tenant-config-filters",
      resultCount: { path: "summary.total", source: "settings" },
      searchPlaceholder: "Search settings...",
      type: "filterBar",
    },
    {
      blockId: "tenant-config-state",
      description:
        "Current role can inspect policy settings but cannot modify approval rules.",
      state: "readonly",
      title: "Configuration locked",
      type: "runtimeState",
    },
  ],
  pageId: "tenant-configuration",
  version: 1,
} satisfies MetadataPage;

const tenantConfigurationDataSources = {
  settings: {
    summary: {
      total: 24,
    },
  },
} satisfies MetadataDataSources;

export { tenantConfigurationDataSources, tenantConfigurationMetadata };
