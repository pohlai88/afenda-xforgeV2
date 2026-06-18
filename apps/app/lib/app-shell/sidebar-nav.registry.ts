import type {
  AfendaAppSidebarNavIconKeysOf,
  AfendaAppSidebarNavIconRegistry,
} from "@repo/design-system";
import {
  FactoryIcon,
  FolderKanbanIcon,
  HandshakeIcon,
  IdCardIcon,
  LandmarkIcon,
  PackageIcon,
  SettingsIcon,
  ShieldIcon,
  ShoppingCartIcon,
  StoreIcon,
  TrendingUpIcon,
  UserCircleIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";

export const authenticatedAppSidebarNavIconRegistry = {
  factory: FactoryIcon,
  "folder-kanban": FolderKanbanIcon,
  handshake: HandshakeIcon,
  "id-card": IdCardIcon,
  landmark: LandmarkIcon,
  package: PackageIcon,
  settings: SettingsIcon,
  shield: ShieldIcon,
  "shopping-cart": ShoppingCartIcon,
  store: StoreIcon,
  "trending-up": TrendingUpIcon,
  "user-circle": UserCircleIcon,
  users: UsersIcon,
  wallet: WalletIcon,
} satisfies AfendaAppSidebarNavIconRegistry;

export type AuthenticatedAppSidebarNavIconKey =
  AfendaAppSidebarNavIconKeysOf<
    typeof authenticatedAppSidebarNavIconRegistry
  >;
