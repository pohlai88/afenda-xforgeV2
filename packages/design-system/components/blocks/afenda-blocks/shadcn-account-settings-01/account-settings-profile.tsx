"use client";

import { UserIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "../../../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../../../afenda-ui/avatar";
import { Button } from "../../../afenda-ui/button";
import { Input } from "../../../afenda-ui/input";
import { Label } from "../../../afenda-ui/label";
import { Separator } from "../../../afenda-ui/separator";
import { blockRecipe } from "../../block-recipes";
import {
  accountSettingsAvatarClass,
  accountSettingsAvatarFallbackClass,
  accountSettingsAvatarShellClass,
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
} from "./account-settings-recipes";

export interface AccountSettingsProfileData {
  readonly displayName: string;
  readonly email: string;
  readonly avatarUrl: string | null;
}

export interface AccountSettingsProfileProps {
  readonly profile: AccountSettingsProfileData;
  readonly onSave?: (data: Pick<AccountSettingsProfileData, "displayName" | "avatarUrl">) => void | Promise<void>;
  readonly isSaving?: boolean;
}

function getAvatarInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  }
  return displayName.slice(0, 2).toUpperCase();
}

export function AccountSettingsProfile({
  isSaving = false,
  onSave,
  profile,
}: AccountSettingsProfileProps) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");

  const isDirty =
    displayName !== profile.displayName ||
    (avatarUrl || null) !== profile.avatarUrl;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave?.({
      displayName: displayName.trim(),
      avatarUrl: avatarUrl.trim() || null,
    });
  }

  return (
    <div className={cn(blockRecipe("blockShell"), accountSettingsSectionClass)} data-slot="account-settings-profile">
      <form onSubmit={handleSubmit}>
        <div className={cn(accountSettingsPanelClass)}>
          <div className={cn(accountSettingsPanelHeaderClass)}>
            <h2 className={cn(accountSettingsPanelTitleClass)}>Profile</h2>
            <p className={cn(accountSettingsPanelDescriptionClass)}>
              Manage your public display name and avatar.
            </p>
          </div>
          <Separator className={cn(accountSettingsSeparatorClass)} />
          <div className={cn(accountSettingsPanelBodyClass)}>
            <div className={cn(accountSettingsAvatarShellClass)}>
              <Avatar className={cn(accountSettingsAvatarClass)}>
                <AvatarImage alt={displayName} src={profile.avatarUrl ?? ""} />
                <AvatarFallback className={cn(accountSettingsAvatarFallbackClass)}>
                  {displayName.trim()
                    ? getAvatarInitials(displayName)
                    : <UserIcon className="size-6" />}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-0.5">
                <p className={cn(accountSettingsFieldLabelClass)}>
                  {displayName || "Your Name"}
                </p>
                <p className={cn(accountSettingsFieldHintClass)}>
                  {profile.email}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4">
              <div className={cn(accountSettingsFieldRowClass)}>
                <Label
                  className={cn(accountSettingsFieldLabelClass)}
                  htmlFor="display-name"
                >
                  Display name
                </Label>
                <Input
                  id="display-name"
                  maxLength={100}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your display name"
                  required
                  value={displayName}
                />
                <p className={cn(accountSettingsFieldHintClass)}>
                  Visible to other members in your organization.
                </p>
              </div>

              <div className={cn(accountSettingsFieldRowClass)}>
                <Label
                  className={cn(accountSettingsFieldLabelClass)}
                  htmlFor="email"
                >
                  Email address
                </Label>
                <Input
                  disabled
                  id="email"
                  readOnly
                  type="email"
                  value={profile.email}
                />
                <p className={cn(accountSettingsFieldHintClass)}>
                  Email is managed through your authentication provider.
                </p>
              </div>

              <div className={cn(accountSettingsFieldRowClass)}>
                <Label
                  className={cn(accountSettingsFieldLabelClass)}
                  htmlFor="avatar-url"
                >
                  Avatar URL
                </Label>
                <Input
                  id="avatar-url"
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.png"
                  type="url"
                  value={avatarUrl}
                />
                <p className={cn(accountSettingsFieldHintClass)}>
                  Enter a URL for your profile image.
                </p>
              </div>
            </div>

            <div className={cn(accountSettingsFormActionsClass)}>
              <Button
                disabled={!isDirty || isSaving}
                size="sm"
                type="submit"
              >
                {isSaving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
