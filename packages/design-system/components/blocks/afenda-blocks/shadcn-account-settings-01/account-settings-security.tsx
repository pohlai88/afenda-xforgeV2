"use client";

import { LaptopIcon, MonitorSmartphoneIcon, ShieldAlertIcon, SmartphoneIcon } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { Badge } from "../../../afenda-ui/badge";
import { Button } from "../../../afenda-ui/button";
import { Input } from "../../../afenda-ui/input";
import { Label } from "../../../afenda-ui/label";
import { Separator } from "../../../afenda-ui/separator";
import { blockRecipe } from "../../block-recipes";
import {
  accountSettingsDestructiveDescriptionClass,
  accountSettingsDestructiveTitleClass,
  accountSettingsDestructiveZoneClass,
  accountSettingsFieldHintClass,
  accountSettingsFieldLabelClass,
  accountSettingsFieldRowClass,
  accountSettingsFormActionsClass,
  accountSettingsPanelBodyClass,
  accountSettingsPanelClass,
  accountSettingsPanelDescriptionClass,
  accountSettingsPanelHeaderClass,
  accountSettingsPanelTitleClass,
  accountSettingsSectionClass,
  accountSettingsSeparatorClass,
  accountSettingsSessionInfoClass,
  accountSettingsSessionLabelClass,
  accountSettingsSessionMetaClass,
  accountSettingsSessionRowClass,
} from "./account-settings-recipes";

export interface ActiveSessionInfo {
  readonly id: string;
  readonly device: string;
  readonly ip: string | null;
  readonly lastActive: string;
  readonly isCurrent: boolean;
}

export interface AccountSettingsSecurityProps {
  readonly sessions?: readonly ActiveSessionInfo[];
  readonly onChangePassword?: (currentPassword: string, newPassword: string) => void | Promise<void>;
  readonly onRevokeSession?: (sessionId: string) => void | Promise<void>;
  readonly onSignOutAllDevices?: () => void | Promise<void>;
  readonly isSaving?: boolean;
}

function SessionDeviceIcon({ device }: { readonly device: string }) {
  const lower = device.toLowerCase();
  if (lower.includes("mobile") || lower.includes("iphone") || lower.includes("android")) {
    return <SmartphoneIcon className="size-4 shrink-0 text-text-secondary" />;
  }
  if (lower.includes("tablet") || lower.includes("ipad")) {
    return <MonitorSmartphoneIcon className="size-4 shrink-0 text-text-secondary" />;
  }
  return <LaptopIcon className="size-4 shrink-0 text-text-secondary" />;
}

export function AccountSettingsSecurity({
  isSaving = false,
  onChangePassword,
  onRevokeSession,
  onSignOutAllDevices,
  sessions = [],
}: AccountSettingsSecurityProps) {
  function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const current = data.get("current-password") as string;
    const next = data.get("new-password") as string;
    onChangePassword?.(current, next);
    form.reset();
  }

  return (
    <div
      className={cn(blockRecipe("blockShell"), accountSettingsSectionClass)}
      data-slot="account-settings-security"
    >
      <div className={cn(accountSettingsPanelClass)}>
        <div className={cn(accountSettingsPanelHeaderClass)}>
          <h2 className={cn(accountSettingsPanelTitleClass)}>Password</h2>
          <p className={cn(accountSettingsPanelDescriptionClass)}>
            Update your account password. Use a strong, unique password.
          </p>
        </div>
        <Separator className={cn(accountSettingsSeparatorClass)} />
        <div className={cn(accountSettingsPanelBodyClass)}>
          <form className="grid gap-4" onSubmit={handlePasswordSubmit}>
            <div className={cn(accountSettingsFieldRowClass)}>
              <Label
                className={cn(accountSettingsFieldLabelClass)}
                htmlFor="current-password"
              >
                Current password
              </Label>
              <Input
                autoComplete="current-password"
                id="current-password"
                name="current-password"
                required
                type="password"
              />
            </div>
            <div className={cn(accountSettingsFieldRowClass)}>
              <Label
                className={cn(accountSettingsFieldLabelClass)}
                htmlFor="new-password"
              >
                New password
              </Label>
              <Input
                autoComplete="new-password"
                id="new-password"
                minLength={8}
                name="new-password"
                required
                type="password"
              />
              <p className={cn(accountSettingsFieldHintClass)}>
                Minimum 8 characters.
              </p>
            </div>
            <div className={cn(accountSettingsFormActionsClass)}>
              <Button disabled={isSaving} size="sm" type="submit">
                {isSaving ? "Updating…" : "Update password"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {sessions.length > 0 && (
        <div className={cn(accountSettingsPanelClass)}>
          <div className={cn(accountSettingsPanelHeaderClass)}>
            <h2 className={cn(accountSettingsPanelTitleClass)}>Active sessions</h2>
            <p className={cn(accountSettingsPanelDescriptionClass)}>
              Devices currently signed in to your account.
            </p>
          </div>
          <Separator className={cn(accountSettingsSeparatorClass)} />
          <div className={cn(accountSettingsPanelBodyClass)}>
            <div className="grid divide-y divide-border-subtle">
              {sessions.map((session) => (
                <div className={cn(accountSettingsSessionRowClass)} key={session.id}>
                  <div className="flex items-start gap-3">
                    <SessionDeviceIcon device={session.device} />
                    <div className={cn(accountSettingsSessionInfoClass)}>
                      <span className={cn(accountSettingsSessionLabelClass)}>
                        {session.device}
                        {session.isCurrent && (
                          <Badge className="ml-2" tone="neutral" variant="soft">
                            Current
                          </Badge>
                        )}
                      </span>
                      <span className={cn(accountSettingsSessionMetaClass)}>
                        {session.ip ? `${session.ip} · ` : ""}Last active {session.lastActive}
                      </span>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      onClick={() => onRevokeSession?.(session.id)}
                      size="sm"
                      variant="quiet"
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {onSignOutAllDevices && (
              <div className="pt-4">
                <Button
                  onClick={onSignOutAllDevices}
                  size="sm"
                  variant="secondary"
                >
                  Sign out all other devices
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={cn(accountSettingsDestructiveZoneClass)}>
        <div className="flex items-start gap-3">
          <ShieldAlertIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div className="grid gap-1">
            <p className={cn(accountSettingsDestructiveTitleClass)}>
              Danger zone
            </p>
            <p className={cn(accountSettingsDestructiveDescriptionClass)}>
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <div className="pt-2">
              <Button
                className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                size="sm"
                type="button"
                variant="secondary"
              >
                Delete account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
