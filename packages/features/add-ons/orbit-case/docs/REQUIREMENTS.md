# Orbit Case — Requirements & Definition of Done

**Package:** `@repo/orbit-case`  
**Last updated:** 2026-06-18

---

## North-star acceptance narrative

A user lands on `/orbit-case`, enters “Need RM50k for production line”, and creates an Orbit Case in under three clicks. No module selection. No form template. No workflow. Later (Phase 2), a manager **Push**es to Budget Request after filling governed fields.

---

## Phase 1 — Orbit Core

### Functional requirements

| ID | Requirement |
|----|-------------|
| OC-1 | Create Orbit Case with title (+ optional description) in ≤3 clicks |
| OC-2 | Edit core fields: owner, assignee, priority, due date, status, tags |
| OC-3 | Delete case (soft-delete default; hard-delete owner-only) |
| OC-4 | Assign / reassign with activity log entry |
| OC-5 | Watch / unwatch case |
| OC-6 | Comments (create, list) |
| OC-7 | Attachments (Phase 1.1 — storage integration) |
| OC-8 | Activity log: every mutation append-only |
| OC-9 | List view with filters |
| OC-10 | Kanban view grouped by status |
| OC-11 | Calendar view by due date (Phase 1.1) |
| OC-12 | Timeline view by due-date buckets (Phase 1.1) |

### Enterprise acceptance criteria

| Area | Criteria |
|------|----------|
| Tenancy | All rows scoped by `organizationId`; RLS + server filters |
| AuthZ | `withOrg` minimum; hard delete `withOwner` |
| Audit | Activity log on create/update/delete/comment |
| Performance | Indexed queries on org + status/assignee/due |
| A11y | Labeled create form; keyboard-reachable actions |
| Observability | Structured logs on case lifecycle |

### Phase 1 DoD

- [x] Drizzle schema + migration `0023_orbit_case_core.sql` + RLS
- [x] `@repo/orbit-case/server` CRUD + board queries
- [x] Unit tests for schemas + push registry rules
- [x] Integration tests for org isolation (`test:integration`)
- [x] App Server Actions under `apps/app/app/actions/orbit-case/`
- [x] `/orbit-case` UI (list + kanban minimum)
- [x] Storybook story for Orbit Case board
- [x] `pnpm --filter @repo/orbit-case typecheck` + `test` green
- [x] `pnpm --filter app typecheck` green
- [x] OC-7 Attachments (Phase 1.1 — `@repo/storage` metadata + blob upload in app)
- [x] Calendar + timeline board views (Phase 1.1)

---

## Phase 2 — Push Engine

| ID | Requirement |
|----|-------------|
| PE-1 | Tenant Push Registry (admin CRUD) |
| PE-2 | Template Registry |
| PE-3 | Push: destination → missing fields → target stub + link |
| PE-4 | Push permission matrix |
| PE-5 | Push audit trail |
| PE-6 | Origin tracking on all targets |

### Phase 2 DoD

- [x] Registry DB tables (`0024`, `0025`) + owner admin UI at `/orbit-case/settings`
- [x] `engines/morph/push-orchestrator.ts` with idempotency
- [x] Integration test: member cannot push Budget; owner can (`orbit-case.push.integration.test.ts`)
- [x] `emit-org-event` for `orbit.case.created` and `orbit.case.pushed`
- [x] E2E lifecycle (`orbit-case.spec.ts`) + push smoke (`orbit-case-push.spec.ts`)
- [x] Webhook delivery integration (`orbit-case-events.integration.test.ts`)

---

## Phase 3 — Enterprise Morphing

Destinations (incremental): Approval, Meeting, Budget, Purchase, Lead, Complaint, Risk, Project, Investigation, CAPA, Contract Review.

### Per-destination DoD (Budget Request)

- [x] Template in registry
- [x] Target owned by destination module (`engines/budget/`)
- [x] Push creates target + `orbit_object_links` (via `push-handlers/budget-request`)
- [x] UI shows linked projection from case detail
- [x] E2E: case → push → open target → origin visible

### Per-destination DoD (Meeting Request)

- [x] Template in manifest + registry
- [x] Target owned by destination module (`engines/meeting/`)
- [x] Push creates target + `orbit_object_links` (via `push-handlers/meeting-request`)
- [x] UI shows linked projection from case detail
- [x] E2E: case → push → open target → origin visible

### Per-destination DoD (Approval Request)

- [x] Template in manifest + registry
- [x] Target owned by destination module (`engines/approval/`)
- [x] Push creates target + `orbit_object_links` (via `push-handlers/approval-request`)
- [x] UI shows linked projection from case detail
- [x] E2E: case → push → open target → origin visible

### Per-destination DoD (Purchase Request)

- [x] Template in manifest + registry
- [x] Target owned by destination module (`engines/purchase/`)
- [x] Push creates target + `orbit_object_links` (via `push-handlers/purchase-request`)
- [x] UI shows linked projection from case detail
- [x] E2E: case → push → open target → origin visible

### Per-destination DoD (Lead Request)

- [x] Template in manifest + registry
- [x] Target owned by destination module (`engines/lead/`)
- [x] Push creates target + `orbit_object_links` (via `push-handlers/lead-request`)
- [x] UI shows linked projection from case detail
- [x] E2E: case → push → open target → origin visible

### Per-destination DoD (Complaint Request)

- [x] Template in manifest + registry
- [x] Target owned by destination module (`engines/complaint/`)
- [x] Push creates target + `orbit_object_links` (via `push-handlers/complaint-request`)
- [x] UI shows linked projection from case detail
- [x] E2E: case → push → open target → origin visible

### Per-destination DoD (Risk Request)

- [x] Template in manifest + registry
- [x] Target owned by destination module (`engines/risk/`)
- [x] Push creates target + `orbit_object_links` (via `push-handlers/risk-request`)
- [x] UI shows linked projection from case detail
- [x] E2E: case → push → open target → origin visible

### Per-destination DoD (Project Request)

- [x] Template in manifest + registry
- [x] Target owned by destination module (`engines/project/`)
- [x] Push creates target + `orbit_object_links` (via `push-handlers/project-request`)
- [x] UI shows linked projection from case detail
- [x] E2E: case → push → open target → origin visible

### Per-destination DoD (Investigation Request)

- [x] Template in manifest + registry
- [x] Target owned by destination module (`engines/investigation/`)
- [x] Push creates target + `orbit_object_links` (via `push-handlers/investigation-request`)
- [x] UI shows linked projection from case detail
- [x] E2E: case → push → open target → origin visible

### Per-destination DoD (CAPA Request)

- [x] Template in manifest + registry
- [x] Target owned by destination module (`engines/capa/`)
- [x] Push creates target + `orbit_object_links` (via `push-handlers/capa-request`)
- [x] UI shows linked projection from case detail
- [x] E2E: case → push → open target → origin visible

### Per-destination DoD (Contract Review Request)

- [x] Template in manifest + registry
- [x] Target owned by destination module (`engines/contract-review/`)
- [x] Push creates target + `orbit_object_links` (via `push-handlers/contract-review-request`)
- [x] UI shows linked projection from case detail
- [x] E2E: case → push → open target → origin visible

### Phase 3 summary

All eleven morph destinations follow the Budget slice pattern. See [`PHASE3_COMPLETE.md`](./PHASE3_COMPLETE.md) and [`MORPH-DESTINATION-SLICE.md`](./MORPH-DESTINATION-SLICE.md).

---

## Phase 4 — Hardening & release

Phase 3 morph destinations are complete in code. Phase 4 is verification, CI, and polish — not new destinations.

### DoD

| ID | Requirement | Status |
|----|-------------|--------|
| H-1 | `pnpm --filter app build` green with Cache Components | Done |
| H-2 | Authenticated layout + morph/case detail routes use Suspense for runtime data | Done |
| H-3 | E2E `orbit-case-push.spec.ts` green (11 destinations + auth setup) | Done |
| H-4 | E2E `orbit-case.spec.ts` lifecycle green | Done (exact label locator for Cache Components UI preservation) |
| H-5 | E2E `orbit-case-blob.spec.ts` green (opt-in blob env) | Pending |
| H-6 | Optional CI workflow (label `e2e`) for Playwright orbit-case tier | Done |
| H-7 | `apps/app/e2e/README.md` documents all 11 push destinations | Done |

### Run E2E locally

```bash
pnpm --filter app build
pnpm --filter app exec next start -p 3000   # terminal 1 — ensure port 3000 is free

cd apps/app/e2e
$env:PLAYWRIGHT_SKIP_WEBSERVER = "1"        # PowerShell
pnpm test:e2e:orbit-case
```

Or let Playwright start dev server (port 3000 must be free):

```bash
pnpm test:e2e:preflight
pnpm test:e2e:orbit-case
```

### Deferred (post-v1 product)

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) non-goals: BPMN, AI auto-routing, per-tenant custom status workflows, full ERP modules inside `@repo/orbit-case`. Richer morph detail UX, notifications, and real ERP handoff are Phase 4+ product work.

---

## Database migrations

Apply schema changes **only** via Drizzle:

```bash
pnpm migrate
# equivalent: pnpm --filter @repo/database db:migrate
```

The migrate script repairs `drizzle.__drizzle_migrations` journal drift before running `drizzle-kit migrate`. Manual SQL / Supabase MCP `apply_migration` are blocked by Cursor hook `guard-drizzle-migrate`.

**JWT push capabilities:** migration `0025` installs the access-token hook. Authorization always uses the **live org role from the database** as the capability ceiling; JWT claims are optional hints capped to that ceiling. Missing, empty, invalid, or stale claims fall back to role defaults — **no manual re-sign-in is required for push authorization**. Automatic token refresh will pick up hook-injected claims when present.
