# Orbit Case — Full-stack integration

**Package:** `@repo/orbit-case`  
**App route:** `apps/app/app/(authenticated)/orbit-case/`

---

## Layer map

| Layer | Path | Role |
|-------|------|------|
| Database | `packages/database/schema.ts`, `drizzle/0023_orbit_case_core.sql` | Persistence, RLS, indexes |
| Domain | `packages/features/add-ons/orbit-case/` | Business logic, contracts, registries |
| Server Actions | `apps/app/app/actions/orbit-case/` | Thin: guard → Zod → server → revalidate |
| UI | `apps/app/app/(authenticated)/orbit-case/` | RSC page + client workspace |
| Events | `apps/app/lib/emit-org-event.ts` | Phase 2: `orbit.case.created`, `orbit.case.pushed` |
| Feature flag | `@repo/feature-flags` | Optional staged rollout |

---

## Request flow (create case)

1. User submits title in `OrbitCaseWorkspace` (client).
2. `createCase` Server Action → `withOrg`.
3. `createOrbitCase(orgId, userId, input)` inserts row + activity.
4. `revalidatePath('/orbit-case')` refreshes RSC data.

---

## Auth matrix (Phase 1)

| Action | Guard | Notes |
|--------|-------|-------|
| Create, update, list, board, comment, watch | `withOrg` | Org member |
| Hard delete | `withOwner` | Owner only |
| Soft delete | `withOrg` | Sets `softDeletedAt` + `cancelled` |

---

## Server Actions

| File | Export |
|------|--------|
| `create.ts` | `createCase` |
| `update.ts` | `updateCase` |
| `delete.ts` | `deleteCase` |
| `list.ts` | `listCases` |
| `board.ts` | `getBoard`, `moveCaseStatus` |
| `watch.ts` | `watchCase` |
| `comment/create.ts` | `addComment` |
| `comment/list.ts` | `listComments` |

---

## Database tables (Phase 1)

- `orbit_cases`
- `orbit_case_watchers`
- `orbit_case_comments`
- `orbit_case_tags`
- `orbit_case_activity`

Phase 2+: `orbit_push_destinations`, `orbit_push_templates`, `orbit_push_events`, `orbit_object_links`.

---

## Cache tags (recommended)

- `orbit-case:list:{orgId}`
- `orbit-case:board:{orgId}`
- `orbit-case:detail:{caseId}`

Use `updateTag` in Server Actions after successful mutations (Next.js 16 cache components).

---

## Testing

| Lane | Path |
|------|------|
| Unit | `packages/features/add-ons/orbit-case/test/` |
| Integration | `packages/features/add-ons/orbit-case/test/integration/` |
| E2E | `apps/app/e2e/orbit-case.spec.ts` (Phase 1.1) |

---

## Add-on registration

Documented in [`packages/features/README.md`](../../../../README.md). New add-ons follow the same workspace + `@repo/*` pattern.
