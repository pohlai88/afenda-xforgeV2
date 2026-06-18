"use client";

import {
  DEFAULT_CONTENT_LAYOUT_MIN_HEIGHT,
  DEFAULT_CONTENT_LAYOUT_MIN_WIDTH,
} from "./content-layout-constants";
import {
  applyContentLayoutResize,
  applyGeometryToElement,
  geometryToContainerStyle,
} from "./content-layout-helpers";
import type { CSSProperties, RefObject } from "react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import type {
  ContentLayoutGeometry,
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
  readonly isResizing: boolean;
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
  const [isResizing, setIsResizing] = useState(false);
  const liveGeometryRef = useRef<ContentLayoutGeometry | null>(null);
  const optionsRef = useRef({
    enabled,
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
  });

  optionsRef.current = {
    enabled,
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
  };

  const containerStyle = useMemo(
    () => (geometry ? geometryToContainerStyle(geometry) : undefined),
    [geometry]
  );

  useLayoutEffect(() => {
    if (!(isResizing && liveGeometryRef.current)) {
      return;
    }

    const container = containerRef.current;

    if (container) {
      applyGeometryToElement(container, liveGeometryRef.current);
    }
  });

  const startResize = useCallback<ContentLayoutResizeStartHandler>(
    (event, intent) => {
      const {
        enabled: isEnabled,
        maxHeight: resolvedMaxHeightOption,
        maxWidth: resolvedMaxWidthOption,
        minHeight: resolvedMinHeight,
        minWidth: resolvedMinWidth,
      } = optionsRef.current;

      if (!isEnabled) {
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
      const resolvedMaxWidth = resolvedMaxWidthOption ?? stageRect.width;
      const resolvedMaxHeight = resolvedMaxHeightOption ?? stageRect.height;

      liveGeometryRef.current = startGeometry;
      setIsResizing(true);
      applyGeometryToElement(container, startGeometry);

      let ended = false;

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const nextGeometry = applyContentLayoutResize(
          intent,
          startGeometry,
          moveEvent.clientX - pointerStart.x,
          moveEvent.clientY - pointerStart.y,
          resolvedMinWidth,
          resolvedMinHeight,
          resolvedMaxWidth,
          resolvedMaxHeight
        );

        liveGeometryRef.current = nextGeometry;
        applyGeometryToElement(container, nextGeometry);
      };

      const endResize = () => {
        if (ended) {
          return;
        }

        ended = true;

        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", endResize);
        window.removeEventListener("pointercancel", endResize);

        if (captureTarget.hasPointerCapture(pointerId)) {
          captureTarget.releasePointerCapture(pointerId);
        }

        const finalGeometry = liveGeometryRef.current;
        liveGeometryRef.current = null;
        setIsResizing(false);

        if (finalGeometry) {
          setGeometry(finalGeometry);
        }
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", endResize, { once: true });
      window.addEventListener("pointercancel", endResize, { once: true });
    },
    [containerRef, stageRef]
  );

  return {
    containerStyle,
    isResizing,
    startResize,
  };
}

export { useContentLayoutResize };
