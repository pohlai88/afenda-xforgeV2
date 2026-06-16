"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent, RefObject } from "react";
import { useCallback, useState } from "react";
import {
  DEFAULT_CONTENT_LAYOUT_MIN_HEIGHT,
  DEFAULT_CONTENT_LAYOUT_MIN_WIDTH,
} from "./content-layout-constants";
import {
  applyContentLayoutResize,
  geometryToContainerStyle,
} from "./content-layout-helpers";
import type {
  ContentLayoutGeometry,
  ContentLayoutResizeIntent,
  ContentLayoutResizeStartHandler,
} from "./content-layout-types";

interface UseContentLayoutResizeOptions {
  readonly containerRef: RefObject<HTMLDivElement | null>;
  readonly enabled: boolean;
  readonly maxHeight?: number;
  readonly maxWidth?: number;
  readonly minHeight?: number;
  readonly minWidth?: number;
  readonly stageRef: RefObject<HTMLElement | null>;
}

interface UseContentLayoutResizeResult {
  readonly containerStyle: CSSProperties | undefined;
  readonly startResize: ContentLayoutResizeStartHandler;
}

function useContentLayoutResize({
  containerRef,
  enabled,
  maxHeight,
  maxWidth,
  minHeight = DEFAULT_CONTENT_LAYOUT_MIN_HEIGHT,
  minWidth = DEFAULT_CONTENT_LAYOUT_MIN_WIDTH,
  stageRef,
}: UseContentLayoutResizeOptions): UseContentLayoutResizeResult {
  const [geometry, setGeometry] = useState<ContentLayoutGeometry | null>(null);
  const containerStyle = geometry
    ? geometryToContainerStyle(geometry)
    : undefined;

  const startResize = useCallback<ContentLayoutResizeStartHandler>(
    (event, intent) => {
      if (!enabled) {
        return;
      }

      const stage = stageRef.current;
      const container = containerRef.current;

      if (!(stage && container)) {
        return;
      }

      event.preventDefault();

      const captureTarget = event.currentTarget;
      const pointerId = event.pointerId;
      captureTarget.setPointerCapture(pointerId);

      const stageRect = stage.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const startGeometry: ContentLayoutGeometry = {
        height: containerRect.height,
        width: containerRect.width,
        x: containerRect.left - stageRect.left,
        y: containerRect.top - stageRect.top,
      };
      const pointerStart = {
        x: event.clientX,
        y: event.clientY,
      };
      const resolvedMaxWidth = maxWidth ?? stageRect.width;
      const resolvedMaxHeight = maxHeight ?? stageRect.height;

      let frameId: number | null = null;
      let pendingGeometry: ContentLayoutGeometry | null = null;
      let ended = false;

      const flushGeometry = () => {
        frameId = null;

        if (pendingGeometry) {
          setGeometry(pendingGeometry);
          pendingGeometry = null;
        }
      };

      const handlePointerMove = (moveEvent: PointerEvent) => {
        pendingGeometry = applyContentLayoutResize(
          intent,
          startGeometry,
          moveEvent.clientX - pointerStart.x,
          moveEvent.clientY - pointerStart.y,
          minWidth,
          minHeight,
          resolvedMaxWidth,
          resolvedMaxHeight
        );

        if (frameId === null) {
          frameId = requestAnimationFrame(flushGeometry);
        }
      };

      const endResize = () => {
        if (ended) {
          return;
        }

        ended = true;

        if (frameId !== null) {
          cancelAnimationFrame(frameId);
          flushGeometry();
        }

        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", endResize);
        window.removeEventListener("pointercancel", endResize);

        if (captureTarget.hasPointerCapture(pointerId)) {
          captureTarget.releasePointerCapture(pointerId);
        }
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", endResize, { once: true });
      window.addEventListener("pointercancel", endResize, { once: true });
    },
    [
      containerRef,
      enabled,
      maxHeight,
      maxWidth,
      minHeight,
      minWidth,
      stageRef,
    ]
  );

  return {
    containerStyle,
    startResize,
  };
}

export { useContentLayoutResize };
