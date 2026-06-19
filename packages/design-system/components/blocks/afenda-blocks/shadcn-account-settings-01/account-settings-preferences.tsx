"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { Badge } from "../../../afenda-ui/badge";
import { Button } from "../../../afenda-ui/button";
import { Label } from "../../../afenda-ui/label";
import { Separator } from "../../../afenda-ui/separator";
import { Switch } from "../../../afenda-ui/switch";
import { blockRecipe } from "../../block-recipes";
import {
  accountSettingsFieldHintClass,
  accountSettingsFieldLabelClass,
  accountSettingsFieldRowHorizontalClass,
  accountSettingsFormActionsClass,
  accountSettingsPanelBodyClass,
  accountSettingsPanelClass,
  accountSettingsPanelDescriptionClass,
  accountSettingsPanelHeaderClass,
  accountSettingsPanelTitleClass,
  accountSettingsSectionClass,
  accountSettingsSeparatorClass,
} from "./account-settings-recipes";

export type AccountSettingsTheme = "light" | "dark" | "system";

export interface AccountSettingsPreferencesData {
  readonly emailNotifications: boolean;
  readonly inAppNotifications: boolean;
  readonly theme: AccountSettingsTheme;
}

export interface AccountSettingsPreferencesProps {
  readonly preferences: AccountSettingsPreferencesData;
  readonly onSave?: (data: AccountSettingsPreferencesData) => void | Promise<void>;
  readonly isSaving?: boolean;
}

const THEME_OPTIONS: { label: string; value: AccountSettingsTheme; icon: React.ElementType }[] = [
  { icon: SunIcon, label: "Light", value: "light" },
  { icon: MoonIcon, label: "Dark", value: "dark" },
  { icon: MonitorIcon, label: "System", value: "system" },
];

export function AccountSettingsPreferences({
  isSaving = false,
  onSave,
  preferences,
}: AccountSettingsPreferencesProps) {
  const [emailNotifications, setEmailNotifications] = [
    preferences.emailNotifications,
    (v: boolean) => onSave?.({ ...preferences, emailNotifications: v }),
  ];
  const [inAppNotifications, setInAppNotifications] = [
    preferences.inAppNotifications,
    (v: boolean) => onSave?.({ ...preferences, inAppNotifications: v }),
  ];
  const [theme, setTheme] = [
    preferences.theme,
    (v: AccountSettingsTheme) => onSave?.({ ...preferences, theme: v }),
  ];

  return (
    <div
      className={cn(blockRecipe("blockShell"), accountSettingsSectionClass)}
      data-slot="account-settings-preferences"
    >
      <div className={cn(accountSettingsPanelClass)}>
        <div className={cn(accountSettingsPanelHeaderClass)}>
          <h2 className={cn(accountSettingsPanelTitleClass)}>Appearance</h2>
          <p className={cn(accountSettingsPanelDescriptionClass)}>
            Choose how the application looks on your device.
          </p>
        </div>
        <Separator className={cn(accountSettingsSeparatorClass)} />
        <div className={cn(accountSettingsPanelBodyClass)}>
          <div className="flex gap-2">
            {THEME_OPTIONS.map(({ icon: Icon, label, value }) => (
              <button
                className={cn(
                  "flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-3 text-xs font-medium transition-colors",
                  theme === value
                    ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                    : "border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary"
                )}
                key={value}
                onClick={() => setTheme(value)}
                type="button"
              >
                <Icon className="size-5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={cn(accountSettingsPanelClass)}>
        <div className={cn(accountSettingsPanelHeaderClass)}>
          <h2 className={cn(accountSettingsPanelTitleClass)}>Notifications</h2>
          <p className={cn(accountSettingsPanelDescriptionClass)}>
            Control how you receive updates and alerts.
          </p>
        </div>
        <Separator className={cn(accountSettingsSeparatorClass)} />
        <div className={cn(accountSettingsPanelBodyClass)}>
          <div className="grid divide-y divide-border-subtle">
            <div className={cn(accountSettingsFieldRowHorizontalClass)}>
              <div className="grid gap-0.5">
                <Label
                  className={cn(accountSettingsFieldLabelClass)}
                  htmlFor="email-notifications"
                >
                  Email notifications
                </Label>
                <p className={cn(accountSettingsFieldHintClass)}>
                  Receive activity digests and important alerts by email.
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                disabled={isSaving}
                id="email-notifications"
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className={cn(accountSettingsFieldRowHorizontalClass)}>
              <div className="grid gap-0.5">
                <Label
                  className={cn(accountSettingsFieldLabelClass)}
                  htmlFor="in-app-notifications"
                >
                  In-app notifications
                </Label>
                <p className={cn(accountSettingsFieldHintClass)}>
                  Show real-time notifications inside the application.
                </p>
              </div>
              <Switch
                checked={inAppNotifications}
                disabled={isSaving}
                id="in-app-notifications"
                onCheckedChange={setInAppNotifications}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
