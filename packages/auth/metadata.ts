import { z } from "zod";

const userMetadataSchema = z
  .object({
    name: z.string().optional(),
    avatar_url: z.string().optional(),
    activeOrganizationId: z.string().optional(),
  })
  .passthrough();

export type AppUserMetadata = z.infer<typeof userMetadataSchema>;

export const parseUserMetadata = (
  metadata: Record<string, unknown> | undefined
): AppUserMetadata => userMetadataSchema.parse(metadata ?? {});

export const getActiveOrganizationId = (
  metadata: Record<string, unknown> | undefined
): string | null => parseUserMetadata(metadata).activeOrganizationId ?? null;

/**
 * UX preference stored in user_metadata — editable by the user.
 * Always validate with `resolveActiveOrganizationId()` before authorization.
 */
export const getUserDisplayName = (
  metadata: Record<string, unknown> | undefined
): string | null => parseUserMetadata(metadata).name ?? null;

export const getUserAvatarUrl = (
  metadata: Record<string, unknown> | undefined
): string | null => parseUserMetadata(metadata).avatar_url ?? null;

export const withActiveOrganizationId = (
  metadata: Record<string, unknown> | undefined,
  organizationId: string
): AppUserMetadata => ({
  ...parseUserMetadata(metadata),
  activeOrganizationId: organizationId,
});
