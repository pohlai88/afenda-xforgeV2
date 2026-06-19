import type {
  SidebarNavUserActionMenuItem,
  SidebarNavUserLinkMenuItem,
} from "./sidebar-nav-user-menu.types";

type AssertEqual<T, U> = [T] extends [U]
  ? [U] extends [T]
    ? true
    : never
  : never;

type AssertNotExtends<T, U> = T extends U ? never : true;

const linkItem = {
  id: "account",
  label: "Account",
  href: "/account/organization",
} as const satisfies SidebarNavUserLinkMenuItem;

const actionItem = {
  id: "sign-out",
  label: "Log out",
  destructive: true,
} as const satisfies SidebarNavUserActionMenuItem;

type _LinkItemHasHref = AssertEqual<
  (typeof linkItem)["href"],
  "/account/organization"
>;

type _ActionItemRejectsHref = AssertNotExtends<
  { id: string; label: string; href: string },
  SidebarNavUserActionMenuItem
>;

const _linkItemHasHref: _LinkItemHasHref = true;
const _actionItemRejectsHref: _ActionItemRejectsHref = true;

void _linkItemHasHref;
void _actionItemRejectsHref;
void linkItem;
void actionItem;
