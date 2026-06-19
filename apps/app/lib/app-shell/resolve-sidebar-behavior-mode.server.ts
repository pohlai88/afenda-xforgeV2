import {
  resolveSidebarBehaviorMode,
  SIDEBAR_BEHAVIOR_COOKIE_NAME,
} from "@repo/design-system";
import { cookies } from "next/headers";

/** Read persisted sidebar behavior for SSR/client hydration alignment. */
export async function resolveAuthenticatedSidebarBehaviorMode() {
  const cookieStore = await cookies();

  return resolveSidebarBehaviorMode(
    cookieStore.get(SIDEBAR_BEHAVIOR_COOKIE_NAME)?.value
  );
}
