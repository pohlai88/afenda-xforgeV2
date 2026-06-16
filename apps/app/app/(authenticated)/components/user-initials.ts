const WHITESPACE_PATTERN = /\s+/;

export function getInitials(
  name?: string | null,
  email?: string | null
): string {
  const source = name?.trim() || email?.trim() || "?";
  const parts = source.split(WHITESPACE_PATTERN).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}
