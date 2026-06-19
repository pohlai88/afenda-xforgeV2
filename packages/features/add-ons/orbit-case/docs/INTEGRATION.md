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

### Per-destination checklist (copy from Budget)

For each morph destination, complete all nine items. Source of truth for routing is `contract/morph-destination-manifest.ts` (`hasAppRoute`, `registerSystemDefaults`).

| # | Item | Location |
|---|------|----------|
| 1 | Push handler | `engines/morph/push-handlers/{destination-id}.ts` |
| 2 | Persistence engine + Drizzle table | `engines/{segment}/{segment}-requests.ts` + `packages/database` |
| 3 | Register handler + system defaults | `push-handlers/index.ts` + `lib/registry/system-defaults.ts` (manifest loop) |
| 4 | Routed in manifest | `hasAppRoute: true` in `morph-destination-manifest.ts` |
| 5 | App list/detail routes | `/orbit-case/{segment}/` + detail param |
| 6 | Cache tags + revalidate | `getOrbitCaseMorphCacheTags` + `revalidateOrbitCaseMorphMutation` |
| 7 | Link projection unit test | `test/link-projection.test.ts` (manifest-driven) |
| 8 | Integration push test | `test/integration/orbit-case.push.integration.test.ts` |
| 9 | E2E push flow | `apps/app/e2e/orbit-case-push.spec.ts` (table-driven) |

| Destination | 1–6 | 7 | 8 | 9 |
|-------------|-----|---|---|---|
| Budget | ✓ | ✓ | ✓ | ✓ |
| Meeting | ✓ | ✓ | ✓ | ✓ |
| Approval | ✓ | ✓ | ✓ | ✓ |
| Purchase | ✓ | ✓ | ✓ | ✓ |
| Lead | ✓ | ✓ | ✓ | ✓ |
| Complaint | ✓ | ✓ | ✓ | ✓ |
| Risk | ✓ | ✓ | ✓ | ✓ |
| Project | ✓ | ✓ | ✓ | ✓ |
| Investigation | ✓ | ✓ | ✓ | ✓ |
| CAPA | ✓ | ✓ | ✓ | ✓ |
| Contract Review | ✓ | ✓ | ✓ | ✓ |

Revalidate on push: `apps/app/app/actions/orbit-case/push/execute.ts` resolves the manifest slice by `targetType` and calls `revalidateOrbitCaseMorphMutation(segment, orgId, targetId)` when `hasAppRoute` is true.

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
- `orbit-case:{segment}-list:{orgId}` for each routed morph segment (budget, meeting, approval, purchase, lead, complaint, risk, project, investigation, capa, contract-review)

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
| E2E morph lifecycle | `apps/app/e2e/orbit-case-morph-lifecycle.spec.ts` |
| E2E notifications | `apps/app/e2e/orbit-case-notifications.spec.ts` |

---

## Staged rollout (Phase 5C)

Orbit Case can be gated without removing persisted data.

| Control | Location |
|---------|----------|
| Feature flag | `@repo/feature-flags` → `orbitCaseEnabled` (default **on**) |
| Env override | `ORBIT_CASE_ENABLED=true\|false` validated in `@repo/orbit-case/keys` |
| Access resolver | `apps/app/lib/orbit-case-access.ts` → `resolveOrbitCaseEnabled()` |
| Sidebar nav | `filterAuthenticatedAppSidebarNav()` omits Orbit Case when disabled |
| Route guard | `apps/app/app/(authenticated)/orbit-case/layout.tsx` redirects to `/dashboard` |

### Rollout runbook

1. **Schema** — run `pnpm migrate` through **`0034_orbit_morph_lifecycle_remaining`** before enabling lifecycle UI in an environment.
2. **Preview / pilot** — leave defaults (`ORBIT_CASE_ENABLED` unset, flag on) or set `ORBIT_CASE_ENABLED=true` explicitly on the preview project.
3. **Production hold** — set `ORBIT_CASE_ENABLED=false` on the production Vercel project to hide nav and block routes; existing cases and morph rows remain in the database.
4. **Production enable** — set `ORBIT_CASE_ENABLED=true` (or rely on PostHog `orbitCaseEnabled` when env is unset), redeploy `apps/app`, verify `/orbit-case` loads and sidebar entry appears.
5. **Verify** — push a case to a morph destination, open detail, change status (see `orbit-case-morph-lifecycle.spec.ts`).

Env override wins over PostHog when set to `true` or `false`. When unset, PostHog flag applies.

---

## In-app notifications (Phase 5B)

| Layer | Path |
|-------|------|
| Schema | `orbit_in_app_notifications` (migration `0036_orbit_in_app_notifications.sql`) |
| Engine | `engines/notifications/in-app-notifications.ts`, `notify-orbit-case.ts` |
| Server Actions | `apps/app/app/actions/orbit-case/notifications/list.ts`, `mark-read.ts` |
| UI | `apps/app/app/(authenticated)/_components/orbit-notifications-panel.tsx` wired via `AuthenticatedAppTopbar` |

Kinds: `orbit.case.assigned`, `orbit.case.pushed`, `orbit.morph.assigned`. Watchers receive push notifications; assignees receive case/morph assignment notifications.

---

## ERP handoff (Phase 5E)

Orbit Case emits JSON-safe morph summaries on `orbit.case.pushed` webhooks and org events. Downstream ERP/procurement packages should treat Orbit as the **origin + link** layer.

### Outbound contract (`OrbitMorphTargetSummary`)

| Field | Type | Notes |
|-------|------|-------|
| `segment` | string | Manifest segment (`budget`, `approval`, `purchase`, …) |
| `targetType` | string | Push destination id (`budget-request`, …) |
| `targetId` | string | Morph row id in Orbit database |
| `title` | string | Morph title |
| `status` | morph status | `submitted` … `cancelled` |
| `values` | record | Domain fields (amount, approver, vendor, …) |
| `externalRefId` | string \| null | Optional correlation id for downstream systems |

Built in `apps/app/app/actions/orbit-case/push/execute.ts` via `toOrbitMorphTargetSummaryFromDto` after push completes.

### Inbound sync stub

`syncMorphExternalStatusAction` (`apps/app/app/actions/orbit-case/morph/sync-external.ts`) resolves pilot morph rows by `externalRefId` and applies idempotent status updates. Owner-only guard for Phase 5 — full ERP UI belongs in future `@repo/*` packages.

```typescript
// Example inbound payload
{
  segment: "budget",
  externalRefId: "erp-budget-99",
  status: "approved"
}
```

---

## Add-on registration

Documented in [`packages/features/README.md`](../../../../README.md). New add-ons follow the same workspace + `@repo/*` pattern.
