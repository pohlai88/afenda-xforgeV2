"use client";

import { Badge } from "@repo/design-system/components/afenda-ui/badge";
import { Button } from "@repo/design-system/components/afenda-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design-system/components/afenda-ui/popover";
import { ScrollArea } from "@repo/design-system/components/afenda-ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/afenda-ui/tabs";
import { topbarIconActionClass } from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-recipes";
import { cn } from "@repo/design-system/lib/utils";
import { Settings2Icon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { TopbarTooltip } from "./topbar-tooltip";
import type {
  TopbarNotificationItem,
  TopbarNotificationScope,
  TopbarNotificationsProps,
  TopbarUtilityAction,
} from "./topbar-types";

type TopbarNotificationTab = "all" | "following" | "inbox" | "team" | "unread";

const NOTIFICATION_TABS: readonly {
  label: string;
  value: TopbarNotificationTab;
}[] = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Inbox", value: "inbox" },
  { label: "Team", value: "team" },
  { label: "Following", value: "following" },
];

function filterNotifications(
  items: readonly TopbarNotificationItem[],
  tab: TopbarNotificationTab
) {
  switch (tab) {
    case "all":
      return items;
    case "unread":
      return items.filter((item) => item.unread);
    default:
      return items.filter((item) => (item.scope ?? "inbox") === tab);
  }
}

function countNotifications(
  items: readonly TopbarNotificationItem[],
  tab: TopbarNotificationTab
) {
  return filterNotifications(items, tab).length;
}

export function TopbarNotifications({
  action,
  className,
  notifications,
}: {
  readonly action: TopbarUtilityAction;
  readonly className?: string;
  readonly notifications: TopbarNotificationsProps;
}) {
  const {
    description = action.description ?? "Alerts, inbox, and delivery updates.",
    emptyDescription = "You are caught up. New alerts and workflow messages will appear here.",
    emptyTitle = "No notifications",
    items,
    label = action.label,
    menuLabel = `Open ${action.label.toLowerCase()}`,
    onArchiveAll,
    onMarkAllRead,
    onOpenSettings,
    onSelectItem,
  } = notifications;
  const [activeTab, setActiveTab] = useState<TopbarNotificationTab>("all");
  const [localItems, setLocalItems] =
    useState<readonly TopbarNotificationItem[]>(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const unreadCount = useMemo(
    () => localItems.filter((item) => item.unread).length,
    [localItems]
  );
  const _visibleItems = useMemo(
    () => filterNotifications(localItems, activeTab),
    [activeTab, localItems]
  );

  return (
    <Popover>
      <TopbarTooltip description={description} label={label}>
        <PopoverTrigger asChild>
          <Button
            aria-label={menuLabel}
            className={cn(topbarIconActionClass, "relative", className)}
            data-slot={`app-topbar-utility-${action.id}`}
            size="icon-sm"
            type="button"
            variant="quiet"
          >
            {action.icon}
            {unreadCount > 0 ? (
              <span className="absolute top-1.5 right-1.5 flex size-2">
                <span className="size-2 rounded-full bg-brand-primary" />
              </span>
            ) : null}
          </Button>
        </PopoverTrigger>
      </TopbarTooltip>
      <PopoverContent
        align="end"
        className="w-[23rem] p-0"
        data-slot="app-topbar-notifications-content"
        sideOffset={4}
      >
        <div className="flex items-start justify-between gap-3 border-border-default border-b px-4 py-3">
          <div className="min-w-0">
            <p className="font-medium text-[13px] text-text-primary">
              Notifications
            </p>
            <p className="mt-0.5 text-[11px] text-text-tertiary">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </p>
          </div>
          {onOpenSettings ? (
            <Button
              aria-label="Open notification settings"
              className="shrink-0"
              onClick={onOpenSettings}
              size="icon-sm"
              type="button"
              variant="quiet"
            >
              <Settings2Icon aria-hidden="true" className="size-4" />
            </Button>
          ) : null}
        </div>
        <Tabs
          className="gap-0"
          onValueChange={(value) =>
            setActiveTab(value as TopbarNotificationTab)
          }
          value={activeTab}
        >
          <div className="border-border-default border-b px-3 py-2">
            <TabsList className="w-full justify-start overflow-x-auto border-0 bg-transparent p-0 shadow-none">
              {NOTIFICATION_TABS.map((tab) => {
                const count = countNotifications(localItems, tab.value);

                return (
                  <TabsTrigger
                    className="h-7 gap-1 rounded-full px-2.5 text-[11px]"
                    key={tab.value}
                    value={tab.value}
                  >
                    {tab.label}
                    {count > 0 ? (
                      <Badge className="px-1.5 py-0 text-[9px]" tone="neutral">
                        {count}
                      </Badge>
                    ) : null}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
          {NOTIFICATION_TABS.map((tab) => {
            const tabItems = filterNotifications(localItems, tab.value);

            return (
              <TabsContent
                className="mt-0 h-[22rem] data-[state=inactive]:hidden"
                key={tab.value}
                value={tab.value}
              >
                <ScrollArea className="h-full">
                  <div className="px-2 py-2">
                    {tabItems.length === 0 ? (
                      <div className="grid min-h-40 place-items-center px-4 text-center">
                        <div>
                          <p className="font-medium text-[12px] text-text-primary">
                            {emptyTitle}
                          </p>
                          <p className="mt-1 text-[11px] text-text-tertiary">
                            {emptyDescription}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-1">
                        {tabItems.map((item) => (
                          <Button
                            className={cn(
                              "h-auto w-full items-start justify-start gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left",
                              item.unread && "bg-surface-muted/55"
                            )}
                            key={item.id}
                            onClick={() => {
                              setLocalItems((current) =>
                                current.map((entry) =>
                                  entry.id === item.id
                                    ? { ...entry, unread: false }
                                    : entry
                                )
                              );
                              onSelectItem?.(item.id);
                            }}
                            type="button"
                            variant="quiet"
                          >
                            <span
                              className={cn(
                                "mt-1 size-2 shrink-0 rounded-full bg-transparent",
                                item.unread && "bg-brand-primary"
                              )}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="flex items-start justify-between gap-3">
                                <span className="truncate font-medium text-[12px] text-text-primary">
                                  {item.title}
                                </span>
                                <span className="shrink-0 text-[10px] text-text-tertiary">
                                  {item.timeLabel}
                                </span>
                              </span>
                              {item.body ? (
                                <span className="mt-1 line-clamp-2 block text-[11px] text-text-secondary">
                                  {item.body}
                                </span>
                              ) : null}
                              <span className="mt-1 block text-[10px] text-text-tertiary uppercase tracking-[0.08em]">
                                {
                                  (item.scope ??
                                    "inbox") as TopbarNotificationScope
                                }
                              </span>
                            </span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            );
          })}
        </Tabs>
        <div className="flex items-center justify-between gap-2 border-border-default border-t px-3 py-2">
          <Button
            className="h-8 px-2.5 text-[11px]"
            disabled={localItems.length === 0}
            onClick={() => {
              setLocalItems([]);
              onArchiveAll?.();
            }}
            type="button"
            variant="quiet"
          >
            Archive all
          </Button>
          <Button
            className="h-8 px-2.5 text-[11px]"
            disabled={unreadCount === 0}
            onClick={() => {
              setLocalItems((current) =>
                current.map((item) => ({ ...item, unread: false }))
              );
              onMarkAllRead?.();
            }}
            type="button"
            variant="quiet"
          >
            Mark all read
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
