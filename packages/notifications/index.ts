import { Novu } from "@novu/api";
import { keys } from "./keys";

const key = keys().NOVU_SECRET_KEY;

export const notifications = new Novu({ secretKey: key });
