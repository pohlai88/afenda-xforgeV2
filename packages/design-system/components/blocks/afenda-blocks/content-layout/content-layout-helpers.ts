import { DEFAULT_CONTENT_LAYOUT_INSETS } from "./content-layout-constants";
import { blockRecipe } from "../../block-recipes";
import type { CSSProperties } from "react";
import type { BlockDensity } from "../../foundation";
import type {
  ContentLayoutBodyGridInput,
  ContentLayoutGeometry,
  ContentLayoutInsetOverrides,
  ContentLayoutResizeIntent,
} from "./content-layout-types";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

function assertNever(value: never): never {
  throw new Error(`Unhandled content layout resize intent: ${String(value)}`);
}

function applyContentLayoutResize(
  intent: ContentLayoutResizeIntent,
  start: ContentLayoutGeometry,
  deltaX: number,
  deltaY: number,
  minWidth: number,
  minHeight: number,
  maxWidth: number,
  maxHeight: number
): ContentLayoutGeometry {
  switch (intent) {
    case "resize-right": {
      const width = clamp(start.width + deltaX, minWidth, maxWidth - start.x);
      return { ...start, width };
    }
    case "resize-left": {
      const rightEdge = start.x + start.width;
      let x = clamp(start.x + deltaX, 0, rightEdge - minWidth);
      const width = clamp(rightEdge - x, minWidth, maxWidth - x);
      x = rightEdge - width;
      return { ...start, width, x };
    }
    case "resize-bottom": {
      const height = clamp(
        start.height + deltaY,
        minHeight,
        maxHeight - start.y
      );
      return { ...start, height };
    }
    case "resize-top": {
      const bottomEdge = start.y + start.height;
      let y = clamp(start.y + deltaY, 0, bottomEdge - minHeight);
      const height = clamp(bottomEdge - y, minHeight, maxHeight - y);
      y = bottomEdge - height;
      return { ...start, height, y };
    }
    default:
      return assertNever(intent);
  }
}

function geometryToContainerStyle(
  geometry: ContentLayoutGeometry
): CSSProperties {
  return {
    bottom: "auto",
    height: `${geometry.height}px`,
    left: `${geometry.x}px`,
    right: "auto",
    top: `${geometry.y}px`,
    width: `${geometry.width}px`,
  };
}

export function applyGeometryToElement(
  element: HTMLElement,
  geometry: ContentLayoutGeometry
): void {
  element.style.bottom = "auto";
  element.style.height = `${geometry.height}px`;
  element.style.left = `${geometry.x}px`;
  element.style.right = "auto";
  element.style.top = `${geometry.y}px`;
  element.style.width = `${geometry.width}px`;
}

export function resolveContentLayoutInsetStyle(
  geometryStyle: CSSProperties | undefined,
  insets: ContentLayoutInsetOverrides = DEFAULT_CONTENT_LAYOUT_INSETS
): CSSProperties {
  if (geometryStyle) {
    return geometryStyle;
  }

  return {
    bottom: insets.bottom ?? DEFAULT_CONTENT_LAYOUT_INSETS.bottom,
    left: insets.left ?? DEFAULT_CONTENT_LAYOUT_INSETS.left,
    right: insets.right ?? DEFAULT_CONTENT_LAYOUT_INSETS.right,
    top: insets.top ?? DEFAULT_CONTENT_LAYOUT_INSETS.top,
  };
}

const CONTENT_LAYOUT_BODY_GRID_CLASS = {
  both: "grid-cols-[auto_minmax(0,1fr)_auto]",
  left: "grid-cols-[auto_minmax(0,1fr)]",
  none: "grid-cols-1",
  right: "grid-cols-[minmax(0,1fr)_auto]",
} as const;

export function getContentLayoutBodyGridClassName({
  hasLeftSidebar,
  hasRightSidebar,
}: ContentLayoutBodyGridInput): string {
  if (hasLeftSidebar && hasRightSidebar) {
    return CONTENT_LAYOUT_BODY_GRID_CLASS.both;
  }

  if (hasLeftSidebar) {
    return CONTENT_LAYOUT_BODY_GRID_CLASS.left;
  }

  if (hasRightSidebar) {
    return CONTENT_LAYOUT_BODY_GRID_CLASS.right;
  }

  return CONTENT_LAYOUT_BODY_GRID_CLASS.none;
}

export const contentLayoutDensityClassName: Record<BlockDensity, string> = {
  compact: blockRecipe("blockCompact"),
  comfortable: blockRecipe("blockComfortable"),
  default: blockRecipe("blockComfortable"),
};

export { applyContentLayoutResize, geometryToContainerStyle };
