import type { InboundProvider } from "../registry/events";

export interface InboundEvent<TData = unknown> {
  data: TData;
  provider: InboundProvider;
  raw: unknown;
  type: string;
}

export type InboundHandler<TData = unknown> = (
  event: InboundEvent<TData>
) => Promise<void>;

export type InboundHandlerKey = `${InboundProvider}:${string}`;

export type InboundWebhookResult =
  | { ok: true; type: string }
  | { ok: false; status: number; error: string };
