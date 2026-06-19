# Account Settings Integration

## App wiring (planned)

| Layer | Path | Role |
|-------|------|------|
| Server actions | `apps/app/app/actions/account-settings/` | Thin: auth guard → Zod parse → engine → revalidate |
| UI | `apps/app/app/(authenticated)/account/` | Settings pages using `AfendaAppShell` |
| App helpers | `apps/app/lib/account-settings-revalidate.ts` | Cache tag helpers |

## Import rules

```typescript
// Client components
import { updateProfileSchema, type UserProfileDto } from "@repo/account-settings";

// Server actions / RSC loaders
import { readUserProfile, updateUserProfile } from "@repo/account-settings/server";

// Cache tags
import { getAccountSettingsCacheTags } from "@repo/account-settings/revalidate";
```

## Thin action pattern

```typescript
// guard → schema from @repo/account-settings → engine from @repo/account-settings/server
// → toUserProfileDto → revalidate
```

## Shell integration

Account settings UI should compose `AfendaAppShell` from `@repo/design-system` with a sidebar nav descriptor pointing at `/account/organization` and related settings routes.
