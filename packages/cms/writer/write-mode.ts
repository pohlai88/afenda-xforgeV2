import "server-only";

import { keys } from "../keys";

export type CmsWriteMode = "local" | "github";

export const getWriteMode = (): CmsWriteMode => keys().CMS_WRITE_MODE;
