const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "none";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return JSON.stringify(value);
};

export const formatOrbitCaseActivitySummary = (
  action: string,
  payload: Record<string, unknown>
): string => {
  switch (action) {
    case "case.created":
      return "Created this case";
    case "case.updated": {
      const keys = Object.keys(payload);

      if (keys.length === 1 && keys[0] === "status") {
        return `Status changed to ${formatValue(payload.status)}`;
      }

      if (keys.length === 1 && keys[0] === "priority") {
        return `Priority changed to ${formatValue(payload.priority)}`;
      }

      if (keys.length === 1 && keys[0] === "assigneeId") {
        return payload.assigneeId ? "Assignee updated" : "Assignee cleared";
      }

      return keys.length > 0 ? `Updated ${keys.join(", ")}` : "Updated case";
    }
    case "case.deleted":
      return "Case deleted";
    case "case.commented":
      return "Added a comment";
    case "case.pushed":
      return `Pushed to ${formatValue(payload.destinationLabel ?? payload.destinationId)}`;
    default:
      return action.replaceAll(".", " ");
  }
};
