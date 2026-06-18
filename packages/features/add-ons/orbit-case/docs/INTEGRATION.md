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
| Blob upload API | `apps/app/app/api/orbit-case/attachments/upload/route.ts` | Vercel `handleUpload` token policy |
| Events | `apps/app/lib/emit-org-event.ts` | Phase 2: `orbit.case.created`, `orbit.case.pushed` |
| Feature flag | `@repo/feature-flags` | Optional staged rollout |

---

## Request flow (create case)

1. User submits title in `OrbitCaseWorkspace` (client).
2. `createCase` Server Action → `withOrg`.
3. `createOrbitCase(orgId, userId, input)` inserts row + activity.
4. `revalidateOrbitCaseMutation` refreshes tagged cache + `/orbit-case` paths.

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
| `board.ts` | `moveCaseStatus`, `getCalendarBoard` |
| `attachment/client-upload.ts` | `prepareAttachmentUpload`, `finalizeAttachmentUpload` |
| `attachment/delete.ts` | `removeAttachment` |
| `push/execute.ts` | `executeCasePush` |
| `watch.ts` | `watchCase` |
| `comment/create.ts` | `addComment` |

Detail reads (case, comments, activity, links, attachments) load via `getCachedOrbitCaseDetailBundle` on `[caseId]/page.tsx` — not separate list actions. Push destinations and templates prefetch on the same page via `resolveOrgPushDestinations` / `getMergedPushTemplate`.

Attachment upload flow:

1. Client calls `prepareAttachmentUpload` for org-scoped pathname.
2. Client uploads via `@repo/storage/client` `upload()` to `POST /api/orbit-case/attachments/upload`.
3. Client calls `finalizeAttachmentUpload` to persist metadata + activity.

---

## App routes (Phase 3)

| Route | Purpose |
|-------|---------|
| `/orbit-case` | Workspace (list, kanban, calendar, timeline) |
| `/orbit-case/[caseId]` | Case detail |
| `/orbit-case/budget` | Budget request index |
| `/orbit-case/budget/[budgetId]` | Budget detail with origin link |
| `/orbit-case/meeting` | Meeting request index |
| `/orbit-case/meeting/[meetingId]` | Meeting detail with origin link |
| `/orbit-case/approval` | Approval request index |
| `/orbit-case/approval/[approvalId]` | Approval detail with origin link |
| `/orbit-case/purchase` | Purchase request index |
| `/orbit-case/purchase/[requestId]` | Purchase detail with origin link |
| `/orbit-case/**` | Lead, Complaint, Risk, Project, Investigation, CAPA, Contract Review — same list + `[requestId]` pattern |
| `/orbit-case/settings` | Push registry admin (owner) |

All eleven morph destinations in `contract/morph-destination-manifest.ts` have `hasAppRoute: true`. Link `href` projection (`contract/link-projection-registry.ts`) emits `/orbit-case/{segment}/{targetId}` for each routed entry.

**Per-slice checklist:** see [`MORPH-DESTINATION-SLICE.md`](./MORPH-DESTINATION-SLICE.md).

---

## Database tables (Phase 1)

- `orbit_cases`
- `orbit_case_watchers`
- `orbit_case_comments`
- `orbit_case_tags`
- `orbit_case_attachments` (Phase 1.1)

Phase 2+: `orbit_push_destinations`, `orbit_push_templates`, `orbit_push_events`, `orbit_object_links`, `orbit_budget_requests`, `orbit_meeting_requests`, `orbit_approval_requests`, plus eight two-field morph tables from migration `0031` (purchase, lead, complaint, risk, project, investigation, capa, contract review).

Admin registry: `/orbit-case/settings` (owner-only).

---

## Database migrations

Apply via repo Drizzle workflow only:

```bash
pnpm migrate
```

Required through **`0028_orbit_push_capabilities_align`** so JWT `orbit_push_capabilities` matches `@repo/orbit-case` `push-role-capabilities.ts`. Runs `db:repair-journal` then `drizzle-kit migrate` on `@repo/database`. Do not apply `packages/database/drizzle/*.sql` manually.

After migration `0025`, push authorization uses live DB role with JWT claims capped to that ceiling. Token refresh (automatic) applies hook-injected claims when present; stale tokens cannot exceed role permissions.

---

## Cache tags (recommended)

- `orbit-case:list:{orgId}`
- `orbit-case:board:{orgId}`
- `orbit-case:detail:{caseId}`
- `orbit-case:budget-list:{orgId}`
- `orbit-case:meeting-list:{orgId}`
- `orbit-case:approval-list:{orgId}`

Use `revalidateTag` in Server Actions after successful mutations. Tag helpers live in `@repo/orbit-case/revalidate` (`orbitCaseMorphListTag`, `getOrbitCaseMorphCacheTags`); app mutations call `revalidateOrbitCaseMutation` and `revalidateOrbitCaseMorphMutation` in `apps/app/lib/orbit-case-revalidate.ts`.

---

## Testing

| Lane | Path |
|------|------|
| Unit | `packages/features/add-ons/orbit-case/test/` |
| Integration | `packages/features/add-ons/orbit-case/test/integration/` |
| Webhooks | `packages/webhooks/test/integration/orbit-case-events.integration.test.ts` |
| E2E lifecycle | `apps/app/e2e/orbit-case.spec.ts` |
| E2E push | `apps/app/e2e/orbit-case-push.spec.ts` |

---

## Add-on registration

Documented in [`packages/features/README.md`](../../../../README.md). New add-ons follow the same workspace + `@repo/*` pattern.
