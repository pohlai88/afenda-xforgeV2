/** Format an ISO due date for compact UI labels (UTC calendar day). */
export const formatOrbitCaseDueDateLabel = (
  dueAt: string | null
): string | null => {
  if (!dueAt) {
    return null;
  }

  const parsed = new Date(dueAt);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  });
};

/** Format attachment size for display. */
export const formatOrbitCaseAttachmentSize = (sizeBytes: number): string => {
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`;
  }

  if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
};
