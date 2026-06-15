import "server-only";

import { keys } from "../keys";

export type CmsReadMode = "local" | "github";

export const getReadMode = (): CmsReadMode => {
  const env = keys();

  if (env.CMS_READ_MODE) {
    return env.CMS_READ_MODE;
  }

  if (env.CMS_WRITE_MODE === "github") {
    return "github";
  }

  return "local";
};
