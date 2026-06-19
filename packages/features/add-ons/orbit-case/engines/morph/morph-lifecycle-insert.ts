import "server-only";

export const morphLifecycleInsertDefaults = (createdAt: Date) => ({
  assigneeId: null,
  status: "submitted" as const,
  updatedAt: createdAt,
});
