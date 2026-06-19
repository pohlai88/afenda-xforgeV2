import {
  ArrowLeftIcon,
  BuildingIcon,
  CreditCardIcon,
  HomeIcon,
  ShieldIcon,
  SlidersIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import type {
  AfendaAppSidebarNavIconKeysOf,
  AfendaAppSidebarNavIconRegistry,
} from "../afenda-appshell/sidebar/sidebar-nav-descriptors";

export const accountSettingsNavIconRegistry = {
  "arrow-left": ArrowLeftIcon,
  building: BuildingIcon,
  "credit-card": CreditCardIcon,
  home: HomeIcon,
  shield: ShieldIcon,
  sliders: SlidersIcon,
  user: UserIcon,
  users: UsersIcon,
} satisfies AfendaAppSidebarNavIconRegistry;

export type AccountSettingsNavIconKey = AfendaAppSidebarNavIconKeysOf<
  typeof accountSettingsNavIconRegistry
>;
