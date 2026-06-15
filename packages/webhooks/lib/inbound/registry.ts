import type { InboundProvider } from "../registry/events";
import type {
  InboundEvent,
  InboundHandler,
  InboundHandlerKey,
  InboundWebhookResult,
} from "./types";

const handlers = new Map<InboundHandlerKey, InboundHandler>();

const handlerKey = (
  provider: InboundProvider,
  eventType: string
): InboundHandlerKey => `${provider}:${eventType}`;

export const registerInboundHandler = <TData>(
  provider: InboundProvider,
  eventType: string,
  handler: InboundHandler<TData>
): void => {
  handlers.set(handlerKey(provider, eventType), handler as InboundHandler);
};

export const dispatchInboundEvent = async (
  event: InboundEvent
): Promise<InboundWebhookResult> => {
  const handler = handlers.get(handlerKey(event.provider, event.type));

  if (!handler) {
    console.warn(
      `[webhooks] Unhandled inbound event: ${event.provider}:${event.type}`
    );
    return { ok: true, type: event.type };
  }

  await handler(event);

  return { ok: true, type: event.type };
};

export const clearInboundHandlers = (): void => {
  handlers.clear();
};
