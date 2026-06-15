# CMS Phase 3A — Acceptance Record

**Date:** 2026-06-15  
**Scope:** FR-12 — Locale-scoped collections (`content/{collection}/{locale}/{slug}.mdx`)

## Static gates

| Gate | Result |
|------|--------|
| `pnpm --filter @repo/cms validate` | Pass (4 MDX files) |
| `pnpm --filter @repo/cms typecheck` | Pass |
| `pnpm --filter app typecheck` | Pass |
| `pnpm --filter web typecheck` | Pass |

## Requirements

| ID | Requirement | Status |
|----|-------------|--------|
| FR-12 | Locale-scoped collections | Accepted |
| FR-12.1 | Path layout `content/{collection}/{locale}/{slug}.mdx` | Accepted |
| FR-12.2 | `ReaderOptions.locale` on Reader API | Accepted |
| FR-12.3 | Fallback to `en` when translation missing (`getPost`) | Accepted |
| FR-12.4 | Locale-aware cache tags (`cms:{collection}:{locale}:{slug}`) | Accepted |
| FR-12.5 | Studio locale routes `/cms/{collection}/{locale}` | Accepted |
| FR-12.6 | `apps/web` passes locale to CMS reads | Accepted |
| FR-12.7 | Preview tokens include locale | Accepted |

## Content migration

Existing files moved to `en/`:

- `content/blog/en/welcome-to-xforge.mdx`
- `content/legal/en/privacy.mdx`
- `content/legal/en/terms.mdx`

## Manual smoke

1. Open `/cms/blog/en` — list shows English posts
2. Create `/cms/blog/es/new`, publish — file at `content/blog/es/{slug}.mdx`
3. Visit `/es/blog` — shows Spanish posts only; `/en/blog` unchanged
4. Visit `/es/blog/{slug}` with no Spanish file but English exists — falls back to English content
5. Publish from studio — `apps/web` updates without redeploy (`WEBHOOK_FIRST_PARTY_*` + outbox delivery)

**Phase 3A verdict: Accepted (static gates)**
