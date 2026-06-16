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

- [ ] Registry DB tables + admin UI
- [ ] `engines/morph/push-orchestrator.ts` with idempotency
- [ ] Integration test: junior cannot push Budget; finance can
- [ ] Optional `emit-org-event` for `orbit.case.pushed`

---

## Phase 3 — Enterprise Morphing

Destinations (incremental): Approval, Meeting, Budget, Purchase, Lead, Complaint, Risk, Project, Investigation, CAPA, Contract Review.

### Per-destination DoD

- [ ] Template in registry
- [ ] Target owned by destination module
- [ ] Push creates target + `orbit_object_links`
- [ ] UI shows linked projection from case detail
- [ ] E2E: case → push → open target → origin visible
