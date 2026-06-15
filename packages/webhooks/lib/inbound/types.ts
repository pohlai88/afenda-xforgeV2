import type { InboundProvider } from "../registry/events";

export type InboundEvent<TData = unknown> = {
  provider: InboundProvider;
  type: string;
  data: TData;
  raw: unknown;
};

export type InboundHandler<TData = unknown> = (
  event: InboundEvent<TData>
) => Promise<void>;

export type InboundHandlerKey = `${InboundProvider}:${string}`;

export type InboundWebhookResult =
  | { ok: true; type: string }
  | { ok: false; status: number; error: string };
