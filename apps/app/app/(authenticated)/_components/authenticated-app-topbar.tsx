"use client";

import { switchActiveOrganization } from "@repo/auth/actions/organizations";
import {
  AfendaAppTopbar,
  TopbarScopeSwitchers,
  type TopbarContextSwitcherProps,
} from "@repo/design-system";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import type { AuthenticatedAppShellOrganization } from "@/lib/app-shell";
import { OrbitNotificationsPanel } from "./orbit-notifications-panel";

interface AuthenticatedAppTopbarProps {
  readonly activeOrganizationId: string | null;
  readonly organizations: readonly AuthenticatedAppShellOrganization[];
  readonly showOrbitNotifications: boolean;
  readonly tenantId?: string;
  readonly userId?: string;
}

export function AuthenticatedAppTopbar({
  activeOrganizationId,
  organizations,
  showOrbitNotifications,
  tenantId,
  userId,
}: AuthenticatedAppTopbarProps) {
  const router = useRouter();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isSwitchingOrganization, startOrganizationSwitch] = useTransition();

  const handleOrganizationChange = useCallback(
    (organizationId: string) => {
      if (organizationId === activeOrganizationId || isSwitchingOrganization) {
        return;
      }

      startOrganizationSwitch(async () => {
        await switchActiveOrganization(organizationId);
        router.refresh();
      });
    },
    [activeOrganizationId, isSwitchingOrganization, router]
  );

  const scopeSwitchers = useMemo((): readonly TopbarContextSwitcherProps[] => {
    if (organizations.length === 0) {
      return [];
    }

    return [
      {
        scope: "organization",
        activeOptionId: activeOrganizationId ?? undefined,
        options: organizations.map((organization) => ({
          id: organization.id,
          name: organization.name,
          subtitle:
            organization.id === activeOrganizationId
              ? "Active workspace"
              : "Switch workspace",
        })),
        onOptionChange: (option) => {
          handleOrganizationChange(option.id);
        },
      },
    ];
  }, [
    activeOrganizationId,
    handleOrganizationChange,
    organizations,
  ]);

  const utilityActionOverrides = useMemo(
    () =>
      showOrbitNotifications
        ? {
            notifications: () => {
              setNotificationsOpen(true);
            },
          }
        : undefined,
    [showOrbitNotifications]
  );

  return (
    <>
      <AfendaAppTopbar
        scopeSwitchers={<TopbarScopeSwitchers switchers={scopeSwitchers} />}
        tenantId={tenantId}
        userId={userId}
        utilityActionOverrides={utilityActionOverrides}
      />
      {showOrbitNotifications ? (
        <OrbitNotificationsPanel
          onOpenChange={setNotificationsOpen}
          open={notificationsOpen}
        />
      ) : null}
    </>
  );
}
