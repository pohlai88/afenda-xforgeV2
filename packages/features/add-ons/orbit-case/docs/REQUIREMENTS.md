# Orbit Case — Requirements & Definition of Done

**Package:** `@repo/orbit-case`  
**Last updated:** 2026-06-16

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

### Remaining Phase 3 destinations

Approval, Meeting, Purchase, Lead, Complaint, Risk, Project, Investigation, CAPA, Contract Review — repeat the Budget pattern (handler + read engine + routes + origin + E2E).

---

## Database migrations

Apply schema changes **only** via Drizzle:

```bash
pnpm migrate
# equivalent: pnpm --filter @repo/database db:migrate
```

The migrate script repairs `drizzle.__drizzle_migrations` journal drift before running `drizzle-kit migrate`. Manual SQL / Supabase MCP `apply_migration` are blocked by Cursor hook `guard-drizzle-migrate`.

**JWT push capabilities:** migration `0025` installs the access-token hook. Authorization always uses the **live org role from the database** as the capability ceiling; JWT claims are optional hints capped to that ceiling. Missing, empty, invalid, or stale claims fall back to role defaults — **no manual re-sign-in is required for push authorization**. Automatic token refresh will pick up hook-injected claims when present.
