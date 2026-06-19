const accountSettingsPageMainClass =
  "@container/settings flex flex-1 flex-col gap-0";

const accountSettingsPageLayoutClass =
  "flex flex-1 flex-col gap-0 md:flex-row";

const accountSettingsNavShellClass = [
  "shrink-0 border-b border-border-default bg-surface-muted/30 md:border-b-0 md:border-r",
  "w-full md:w-56",
].join(" ");

const accountSettingsNavInnerClass =
  "flex flex-row gap-1 overflow-x-auto px-3 py-2 md:flex-col md:overflow-x-visible md:px-2 md:py-4";

const accountSettingsNavGroupLabelClass =
  "hidden px-2 pb-1 text-[11px] font-semibold tracking-wider text-text-secondary uppercase md:block";

const accountSettingsNavItemClass = [
  "flex shrink-0 items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] font-medium leading-snug outline-none transition-colors duration-75",
  "text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring/30",
].join(" ");

const accountSettingsNavItemActiveClass = [
  "flex shrink-0 items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] font-medium leading-snug outline-none transition-colors duration-75",
  "bg-brand-primary/10 text-brand-primary",
].join(" ");

const accountSettingsNavItemIconClass = "size-4 shrink-0";

const accountSettingsContentClass =
  "min-w-0 flex-1 overflow-auto px-4 py-6 md:px-6 md:py-8";

const accountSettingsSectionClass = "grid max-w-2xl gap-6";

const accountSettingsPanelClass =
  "rounded-xl border border-border-default bg-surface-raised shadow-panel";

const accountSettingsPanelHeaderClass = "flex flex-col gap-1 px-5 pt-5 pb-4";

const accountSettingsPanelBodyClass = "px-5 pb-5 pt-0";

const accountSettingsPanelTitleClass =
  "text-[length:var(--title-text-size)] font-semibold text-text-primary";

const accountSettingsPanelDescriptionClass =
  "text-[length:var(--xforge-font-caption-size)] leading-[var(--xforge-font-caption-line-height)] text-text-secondary";

const accountSettingsFieldRowClass =
  "grid gap-1.5";

const accountSettingsFieldRowHorizontalClass =
  "flex items-center justify-between gap-4 py-2";

const accountSettingsFieldLabelClass =
  "text-sm font-medium text-text-primary";

const accountSettingsFieldHintClass =
  "text-[length:var(--xforge-font-caption-size)] text-text-secondary";

const accountSettingsAvatarShellClass =
  "flex items-center gap-4 py-2";

const accountSettingsAvatarClass =
  "size-16 rounded-xl border border-border-default";

const accountSettingsAvatarFallbackClass =
  "rounded-xl bg-surface-muted text-xl font-semibold text-text-primary";

const accountSettingsSeparatorClass = "my-4 border-border-subtle";

const accountSettingsFormActionsClass =
  "flex items-center justify-end gap-2 pt-2";

const accountSettingsDestructiveZoneClass =
  "rounded-xl border border-destructive/20 bg-destructive/5 px-5 py-4";

const accountSettingsDestructiveTitleClass =
  "text-sm font-semibold text-destructive";

const accountSettingsDestructiveDescriptionClass =
  "text-[length:var(--xforge-font-caption-size)] text-text-secondary";

const accountSettingsSessionRowClass =
  "flex items-start justify-between gap-3 py-3";

const accountSettingsSessionInfoClass = "grid min-w-0 gap-0.5";

const accountSettingsSessionLabelClass =
  "text-sm font-medium text-text-primary";

const accountSettingsSessionMetaClass =
  "text-[length:var(--xforge-font-caption-size)] text-text-secondary";

export {
  accountSettingsAvatarClass,
  accountSettingsAvatarFallbackClass,
  accountSettingsAvatarShellClass,
  accountSettingsContentClass,
  accountSettingsDestructiveDescriptionClass,
  accountSettingsDestructiveTitleClass,
  accountSettingsDestructiveZoneClass,
  accountSettingsFieldHintClass,
  accountSettingsFieldLabelClass,
  accountSettingsFieldRowClass,
  accountSettingsFieldRowHorizontalClass,
  accountSettingsFormActionsClass,
  accountSettingsNavGroupLabelClass,
  accountSettingsNavInnerClass,
  accountSettingsNavItemActiveClass,
  accountSettingsNavItemClass,
  accountSettingsNavItemIconClass,
  accountSettingsNavShellClass,
  accountSettingsPanelBodyClass,
  accountSettingsPanelClass,
  accountSettingsPanelDescriptionClass,
  accountSettingsPanelHeaderClass,
  accountSettingsPanelTitleClass,
  accountSettingsPageLayoutClass,
  accountSettingsPageMainClass,
  accountSettingsSectionClass,
  accountSettingsSeparatorClass,
  accountSettingsSessionInfoClass,
  accountSettingsSessionLabelClass,
  accountSettingsSessionMetaClass,
  accountSettingsSessionRowClass,
};
