"use client";

import type { OrbitInAppNotificationDto } from "@repo/orbit-case";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  blockRecipe,
} from "@repo/design-system";
import { cn } from "@repo/design-system/lib/utils";
import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { listOrbitNotifications } from "@/app/actions/orbit-case/notifications/list";
import { markOrbitNotificationRead } from "@/app/actions/orbit-case/notifications/mark-read";

interface OrbitNotificationsPanelProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function OrbitNotificationsPanel({
  onOpenChange,
  open,
}: OrbitNotificationsPanelProps) {
  const [notifications, setNotifications] = useState<
    OrbitInAppNotificationDto[]
  >([]);
  const [isPending, startTransition] = useTransition();

  const loadNotifications = useCallback(() => {
    startTransition(async () => {
      const result = await listOrbitNotifications({ limit: 50 });

      if (result.ok) {
        setNotifications(result.data);
      }
    });
  }, []);

  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  }, [loadNotifications, open]);

  const handleOpenNotification = (notification: OrbitInAppNotificationDto) => {
    startTransition(async () => {
      await markOrbitNotificationRead({ notificationId: notification.id });
      loadNotifications();
    });
    onOpenChange(false);
  };

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent className="flex w-full flex-col sm:max-w-md" side="right">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            Orbit Case updates for your organization.
          </SheetDescription>
        </SheetHeader>
        <div
          className={cn(
            blockRecipe("blockPanel"),
            "mt-4 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2"
          )}
          data-slot="orbit-notifications-panel"
        >
          {isPending && notifications.length === 0 ? (
            <p className="text-muted-foreground text-sm">Loading…</p>
          ) : null}
          {!isPending && notifications.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No notifications yet.
            </p>
          ) : null}
          {notifications.map((notification) => (
            <article
              className={cn(
                blockRecipe("blockPanel", "blockPanelPadding"),
                "grid gap-1 border",
                notification.readAt ? "opacity-70" : "border-primary/30"
              )}
              key={notification.id}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-sm">{notification.title}</h3>
                {!notification.readAt ? (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-primary-foreground text-xs">
                    New
                  </span>
                ) : null}
              </div>
              {notification.body ? (
                <p className="text-muted-foreground text-sm">{notification.body}</p>
              ) : null}
              <Link
                className="text-primary text-sm underline-offset-4 hover:underline"
                href={notification.href}
                onClick={() => {
                  handleOpenNotification(notification);
                }}
              >
                Open
              </Link>
            </article>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
