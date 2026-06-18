"use client";

import { cn } from "../../lib/utils";
import {
  type ComponentProps,
  type ComponentType,
  type CSSProperties,
  createContext,
  type ReactNode,
  useContext,
  useId,
  useMemo,
} from "react";
import { Legend, ResponsiveContainer, Tooltip } from "recharts";
import type { LegendPayload } from "recharts/types/component/DefaultLegendContent";
import type {
  Props as DefaultTooltipContentProps,
  Payload as TooltipPayload,
} from "recharts/types/component/DefaultTooltipContent";
import { recipe } from "./recipes";

const THEMES = { light: "", dark: ".dark" } as const;
const CSS_TOKEN_PATTERN = /^[#(),.%\w\s-]+$/;

export type ChartConfig = {
  [k in string]: {
    label?: ReactNode;
    icon?: ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

interface ChartContextProps {
  config: ChartConfig;
}

const ChartContext = createContext<ChartContextProps | null>(null);

function useChart() {
  const context = useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  useResponsiveContainer = true,
  ...props
}: ComponentProps<"div"> & {
  config: ChartConfig;
  children: ReactNode;
  useResponsiveContainer?: boolean;
}) {
  const uniqueId = useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
  const contextValue = useMemo<ChartContextProps>(() => ({ config }), [config]);

  return (
    <ChartContext.Provider value={contextValue}>
      <div
        aria-label={props["aria-label"] ?? "Chart"}
        className={cn(
          "flex min-h-[var(--chart-min-height)] w-full min-w-0 justify-center",
          "[&_.recharts-cartesian-axis-tick_text]:fill-text-secondary",
          "[&_.recharts-cartesian-grid_line]:stroke-border-subtle",
          "[&_.recharts-cartesian-axis-line]:stroke-border-default",
          "[&_.recharts-cartesian-axis-tick-line]:stroke-border-subtle",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border-default",
          "[&_.recharts-layer]:outline-none [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          "[&_.recharts-layer]:focus-visible:ring-2 [&_.recharts-sector]:focus-visible:ring-2 [&_.recharts-surface]:focus-visible:ring-2",
          "[&_.recharts-layer]:focus-visible:ring-ring/30 [&_.recharts-sector]:focus-visible:ring-ring/30 [&_.recharts-surface]:focus-visible:ring-ring/30",
          "[&_.recharts-radial-bar-background-sector]:fill-surface-muted",
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-surface-muted",
          recipe("captionText"),
          className
        )}
        data-chart={chartId}
        data-slot="chart"
        role="img"
        {...props}
      >
        <ChartStyle config={config} id={chartId} />
        {useResponsiveContainer ? (
          <ResponsiveContainer height="100%" minWidth={0} width="100%">
            {children as ComponentProps<typeof ResponsiveContainer>["children"]}
          </ResponsiveContainer>
        ) : (
          children
        )}
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      // biome-ignore lint/security/noDangerouslySetInnerHtml: serialized CSS variables are constrained to chart ids, keys, and color tokens.
      dangerouslySetInnerHTML={{
        __html: serializeChartStyles(id, colorConfig),
      }}
    />
  );
};

function serializeChartStyles(
  id: string,
  colorConfig: [string, ChartConfig[string]][]
) {
  const safeId = serializeCssIdentifier(id);

  return Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const declarations = colorConfig
        .map(([key, itemConfig]) => {
          const color =
            itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
            itemConfig.color;

          if (!color) {
            return null;
          }

          const safeKey = serializeCssIdentifier(key);
          const safeColor = serializeCssToken(color);

          return safeKey && safeColor
            ? `  --color-${safeKey}: ${safeColor};`
            : null;
        })
        .filter(Boolean)
        .join("\n");

      return declarations
        ? `${prefix} [data-chart=${safeId}] {\n${declarations}\n}`
        : null;
    })
    .filter(Boolean)
    .join("\n");
}

function serializeCssIdentifier(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "");
}

function serializeCssToken(value: string) {
  return CSS_TOKEN_PATTERN.test(value) ? value : "";
}

const ChartTooltip = Tooltip;

type ChartTooltipPayload = TooltipPayload<string | number, string>;

type ChartTooltipContentProps = ComponentProps<"div"> &
  DefaultTooltipContentProps<string | number, string> & {
    active?: boolean;
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
    color?: string;
  };

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  const tooltipLabel = useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }

    if (!value) {
      return null;
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>;
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ]);

  if (!(active && payload?.length)) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div
      className={cn(
        "grid min-w-32 items-start gap-1.5 rounded-[var(--card-radius)] border border-border-default bg-surface-overlay px-2.5 py-1.5 text-text-primary shadow-popover",
        recipe("captionText"),
        className
      )}
    >
      {nestLabel ? null : tooltipLabel}
      <div className={cn(recipe("chartTooltipItems"))}>
        {payload
          .filter((item) => item.type !== "none")
          .map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor =
              color || getPayloadValue(item.payload, "fill") || item.color;

            return (
              <div
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:size-2.5 [&>svg]:text-text-secondary",
                  indicator === "dot" && "items-center"
                )}
                key={`${item.dataKey || item.name || index}`}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            recipe("chartTooltipIndicator"),
                            {
                              [recipe("chartTooltipIndicatorDot")]:
                                indicator === "dot",
                              [recipe("chartTooltipIndicatorLine")]:
                                indicator === "line",
                              [recipe("chartTooltipIndicatorDashed")]:
                                indicator === "dashed",
                              [recipe("chartTooltipIndicatorNested")]:
                                nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className={cn(recipe("chartTooltipItems"))}>
                        {nestLabel ? tooltipLabel : null}
                        <span className={cn(recipe("chartTooltipName"))}>
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className={cn(recipe("chartTooltipValue"))}>
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

const ChartLegend = Legend;

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: ComponentProps<"div"> & {
  payload?: LegendPayload[];
  verticalAlign?: "top" | "middle" | "bottom";
  hideIcon?: boolean;
  nameKey?: string;
}) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        recipe("captionText"),
        className
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              className={cn(recipe("chartLegendItem"))}
              key={item.value}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className={cn(recipe("chartLegendSwatch"))}
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
    </div>
  );
}

function getPayloadValue(payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null || !(key in payload)) {
    return undefined;
  }

  const value = payload[key as keyof typeof payload];

  return typeof value === "string" ? value : undefined;
}

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: ChartTooltipPayload | LegendPayload,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
};
