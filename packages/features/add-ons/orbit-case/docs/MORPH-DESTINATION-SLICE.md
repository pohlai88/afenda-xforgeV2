# Orbit Case — Morph destination slice

**Package:** `@repo/orbit-case`  
**Manifest:** [`contract/morph-destination-manifest.ts`](../contract/morph-destination-manifest.ts)

Use this checklist when shipping a new Phase 3 morph destination. **All eleven destinations are shipped** — Budget, Meeting, and Approval are the first-class reference implementations; Purchase through Contract Review use the shared two-field morph pattern in `engines/morph/remaining-morph-requests.ts` and `OrbitMorphListView` / `OrbitMorphDetailView`.

---

## Checklist

| Step | Layer | Action |
|------|-------|--------|
| 1 | Manifest | Add slice to `ORBIT_MORPH_DESTINATION_MANIFEST` with `registerSystemDefaults: true`, `hasAppRoute: true`, template fields, capability, roles |
| 2 | Database | Drizzle table + migration (`pnpm migrate` only — no manual SQL) with org-scoped RLS (mirror `0024` / `0029`) |
| 3 | Schema | `packages/database/schema.ts` + export in `packages/database/index.ts` |
| 4 | Push handler | `engines/morph/push-handlers/{destination-id}.ts` + register in `push-handlers/index.ts` |
| 5 | Read engine | `engines/{segment}/{segment}-requests.ts` — `getById`, `listForOrg` |
| 6 | Types | `Orbit*RequestRecord/Dto` in `contract/orbit-case.types.ts` |
| 7 | Serializer | `toOrbit*RequestDto` in `contract/serialize.ts`; export from `index.ts` + `server.ts` |
| 8 | Cache | Use `getOrbitCaseMorphCacheTags(segment, orgId)` in app cached list loader |
| 9 | Revalidate | Push success revalidates automatically via `resolveMorphSliceByTargetType` in `executeCasePush` when `hasAppRoute: true` |
| 10 | App routes | `/orbit-case/{segment}/page.tsx` + `/orbit-case/{segment}/[{id}]/page.tsx` using `OrbitMorphDetailLayout` + `OrbitMorphOriginAside` |
| 11 | Nav | Optional link in `orbit-case-workspace.tsx` when listing governed targets |
| 12 | Tests | `revalidate.test.ts`, `link-projection.test.ts`, integration push test, E2E in `orbit-case-push.spec.ts` |
| 13 | Seed | Optional system rows in migration for `orbit_push_destinations` + `orbit_push_templates` (see `0025`, `0029`) |

Link `href` projection is automatic once `hasAppRoute: true` — [`link-projection-registry.ts`](../contract/link-projection-registry.ts) builds `/orbit-case/{segment}/{targetId}` from routed manifest entries.

---

## Suggested template fields (stubs)

| Destination | Suggested fields |
|-------------|------------------|
| Approval | title, approver, amount |
| Purchase | title, vendor, amount |
| Lead | title, contact, company |
| Complaint | title, category, severity |
| Risk | title, riskLevel, owner |
| Project | title, startDate, budget |
| Investigation | title, subject, priority |
| CAPA | title, rootCause, dueDate |
| Contract Review | title, counterparty, expiryDate |

Set `registerSystemDefaults: false` on manifest stubs until the handler and table exist — otherwise the push UI would offer destinations that fail at execution. **All manifest entries now have `registerSystemDefaults: true` and `hasAppRoute: true`.**

---

## Status

Phase 3 complete — see [`PHASE3_COMPLETE.md`](./PHASE3_COMPLETE.md).

---

## Reference files

| Concern | Budget | Meeting | Approval |
|---------|--------|---------|----------|
| Handler | `push-handlers/budget-request.ts` | `push-handlers/meeting-request.ts` | `push-handlers/approval-request.ts` |
| Engine | `engines/budget/budget-requests.ts` | `engines/meeting/meeting-requests.ts` | `engines/approval/approval-requests.ts` |
| Migration | `0024_orbit_case_push.sql` | `0029_orbit_meeting_requests.sql` | `0030_orbit_approval_requests.sql` |
| List page | `apps/app/.../budget/page.tsx` | `apps/app/.../meeting/page.tsx` | `apps/app/.../approval/page.tsx` |
| Detail page | `apps/app/.../budget/[budgetId]/page.tsx` | `apps/app/.../meeting/[meetingId]/page.tsx` | `apps/app/.../approval/[approvalId]/page.tsx` |

See also [`INTEGRATION.md`](./INTEGRATION.md) and [`REQUIREMENTS.md`](./REQUIREMENTS.md).
