# Account Settings Architecture

`@repo/account-settings` is a first-class add-on package for user profile, preferences, and security settings.

## Layers

| Layer | Path | Role |
|-------|------|------|
| Client barrel | `index.ts` | Zod schemas, DTO types, serializers, cache tags |
| Server barrel | `server.ts` | `server-only` engine exports |
| Contract | `contract/` | Input validation, Record/Dto types, boundary guards |
| Engines | `engines/` | Profile, preferences, and session operations |

## Boundaries

- Client components import `@repo/account-settings` only.
- Server actions and RSC loaders import `@repo/account-settings/server`.
- Cache tags come from `@repo/account-settings/revalidate`.
- Env validation lives in `@repo/account-settings/keys`.

## Persistence

Profile and preferences are stored in Supabase Auth user metadata until dedicated tables are added in `@repo/database`.

Session listing and revocation are scaffolded in `engines/security/sessions-engine.ts` and require Supabase Auth admin API wiring.
