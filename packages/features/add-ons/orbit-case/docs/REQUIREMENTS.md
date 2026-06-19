# Orbit Case — Requirements & Definition of Done

**Package:** `@repo/orbit-case`  
**Last updated:** 2026-06-19

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
| H-5 | E2E `orbit-case-blob.spec.ts` green (opt-in blob env) | Done — spec complete; skips without `XFORGE_*` blob keys; run `pnpm test:e2e:orbit-case:blob` |
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

Phase 4 completes v1. Product depth begins in **Phase 5** below.

---

## Phase 5 — Product depth & operational maturity

Phases 1–4 ship the universal work item, push engine, eleven morph stubs, and release gates. Phase 5 makes pushed targets **operational** — editable, triageable, and visible to the people who must act — without turning `@repo/orbit-case` into a full ERP.

### North-star acceptance narrative

A finance lead opens `/orbit-case/budget`, filters **In review**, updates amount and status, and marks **Approved** — all without returning to the origin case. A watcher assigned to the parent case sees an in-app notification that the budget push completed.

---

### 5A — Morph request lifecycle

Apply to all eleven destinations incrementally. **Pilot:** Budget, Approval, Purchase — then roll the pattern to the remaining eight via [`MORPH-DESTINATION-SLICE.md`](./MORPH-DESTINATION-SLICE.md).

| ID | Requirement |
|----|-------------|
| P5-A1 | Morph targets have a fixed v1 status set: `submitted` · `in_review` · `approved` · `rejected` · `cancelled` |
| P5-A2 | Edit governed template fields post-push (owner/editor; audit each change) |
| P5-A3 | Assignee on morph targets (org member picker; activity on reassign) |
| P5-A4 | Append-only activity log on morph create/update/status/assign |
| P5-A5 | Server Actions under `apps/app/app/actions/orbit-case/morph/` + cache revalidate per segment |
| P5-A6 | List views filter by status and assignee |
| P5-A7 | Detail view: editable form (not read-only `<dl>`) for pilot destinations |

#### Per-destination DoD (pilot — Budget Request)

- [x] Drizzle columns: `status`, `assigneeId`, `updatedAt` (+ migration `0032_orbit_budget_lifecycle`)
- [x] `engines/budget/budget-requests.ts` — `updateBudgetRequestFields`, `listForOrg` filters
- [x] Server Actions + app UI edit/status controls on `/orbit-case/budget/[budgetId]`
- [x] Activity entries on morph mutations (`morph.budget.updated` on origin case)
- [x] Unit tests (`test/morph-budget.test.ts`)
- [x] E2E status transition in `orbit-case-morph-lifecycle.spec.ts`

Repeat checklist for **Approval** and **Purchase**, then batch the remaining eight two-field destinations.

#### Per-destination DoD (remaining eight destinations)

- [x] Drizzle columns: `status`, `assigneeId`, `updatedAt` (+ migration `0034_orbit_morph_lifecycle_remaining`)
- [x] Shared two-field lifecycle engine factory + `morph-lifecycle-registry` for all eleven segments
- [x] Unified `updateMorphLifecycleRequestSchema` + `updateMorphPilotRequest` server action
- [x] Shared pilot list/detail UI on `/orbit-case/{segment}` for Meeting, Lead, Complaint, Risk, Project, Investigation, CAPA, Contract Review
- [x] Push handlers set lifecycle defaults (`submitted`, `assigneeId: null`, `updatedAt`)
- [x] Activity entries (`morph.{segment}.updated`) via generic formatter
- [x] E2E status transition in `orbit-case-morph-lifecycle.spec.ts`

#### Per-destination DoD (pilot — Approval Request)

- [x] Drizzle columns: `status`, `assigneeId`, `updatedAt` (+ migration `0033_orbit_approval_purchase_lifecycle`)
- [x] `engines/approval/approval-requests.ts` — lifecycle update + list filters
- [x] Shared pilot UI + `updateMorphPilotRequest` action
- [x] Activity entries (`morph.approval.updated`)

#### Per-destination DoD (pilot — Purchase Request)

- [x] Drizzle columns on `orbit_purchase_requests` (via migration `0033`)
- [x] `engines/purchase/purchase-requests.ts` — lifecycle update + list filters
- [x] Shared pilot UI + `updateMorphPilotRequest` action
- [x] Activity entries (`morph.purchase.updated`)

---

### 5C — Staged rollout

| ID | Requirement |
|----|-------------|
| P5-C1 | Gate `/orbit-case` nav entry and routes with `@repo/feature-flags` |
| P5-C2 | Org-level or environment-level enable documented in `INTEGRATION.md` |
| P5-C3 | Preview deployments can enable for pilot tenants without production blast radius |

#### Phase 5C DoD

- [x] Flag registered in `@repo/feature-flags` (`orbitCaseEnabled`, default on)
- [x] App shell hides Orbit Case when disabled; `/orbit-case` layout redirects
- [x] Env override `ORBIT_CASE_ENABLED=true|false` in `@repo/orbit-case/keys`
- [x] Rollout runbook in add-on docs (`INTEGRATION.md` — Staged rollout)

---

### 5B — In-app notifications

Webhook events (`orbit.case.created`, `orbit.case.pushed`) exist from Phase 2. Phase 5 adds **in-app** signal for people doing the work.

| ID | Requirement |
|----|-------------|
| P5-B1 | Extend `contract/events.ts` with assign, comment, status-change, morph-update payloads |
| P5-B2 | Persist org-scoped notification rows (Drizzle + RLS) or delegate to a shared `@repo/notifications` package if one exists |
| P5-B3 | Notify case watchers on relevant case mutations |
| P5-B4 | Notify morph assignee on push completion and morph status change |
| P5-B5 | In-app feed UI (authenticated shell bell / panel) with deep links to case or morph detail |
| P5-B6 | Optional email delivery via existing `@repo/email` — feature-flagged |

#### Phase 5B DoD

- [x] Event schemas + emit calls from work/morph engines
- [x] Notification persistence + list/mark-read API
- [x] App UI wired; integration test: assign case → assignee notification row persisted
- [x] E2E: persisted notification renders in the topbar feed, deep-links, and marks read (`orbit-case-notifications.spec.ts`)

---

### 5D — Pilot destination depth

Deepen **Budget**, **Approval**, and **Purchase** before generic two-field stubs. Expand template fields, validation, and list columns per domain — still owned under `engines/{segment}/`, not new ERP packages.

| Destination | Extra fields (indicative) |
|-------------|---------------------------|
| Budget | amount (required), currency, cost center, justification |
| Approval | approver (required), amount, due date, decision notes |
| Purchase | vendor, amount, line items or PO reference |

| ID | Requirement |
|----|-------------|
| P5-D1 | Template fields in manifest + registry match persisted columns |
| P5-D2 | Push form validates required pilot fields |
| P5-D3 | List view shows domain columns (not title-only) |

#### Phase 5D DoD

- [x] Budget, Approval, Purchase migrations + schema alignment (`0035_orbit_pilot_depth_erp.sql`)
- [x] Push handlers persist extended fields
- [x] E2E push fills required pilot fields and asserts on detail page (`orbit-case-morph-lifecycle.spec.ts`)

---

### 5E — ERP handoff (integration boundary)

Orbit Case remains the **origin and link** layer — not a replacement for finance, procurement, or CRM systems.

| ID | Requirement |
|----|-------------|
| P5-E1 | Webhook / org-event payloads include morph target summary (type, id, status, key fields) |
| P5-E2 | Optional `externalRefId` on morph tables for downstream system correlation |
| P5-E3 | Document outbound contract in [`INTEGRATION.md`](./INTEGRATION.md) for future `@repo/*` ERP packages |
| P5-E4 | Idempotent inbound sync hook stub (accept external status update by `externalRefId`) — no full ERP UI in Phase 5 |

#### Phase 5E DoD

- [x] Extended event payloads + webhook integration test
- [x] `externalRefId` column on pilot morph tables
- [x] Integration doc section for ERP consumers
- [x] Idempotent inbound sync stub (`syncMorphExternalStatus`)

---

### Phase 5 summary DoD

| Slice | Scope | Status |
|-------|--------|--------|
| 5A | Morph lifecycle (all 11 destinations) | Done |
| 5B | In-app notifications | Done |
| 5C | Feature-flag rollout | Done |
| 5D | Pilot field depth (Budget, Approval, Purchase) | Done |
| 5E | ERP handoff boundary | Done |

Recommended build order: **5C** (safe rollout) → **5A + 5D** (pilot morphs) → **5B** (notify people acting on morphs) → **5E** (external sync).

---

### Still deferred (Phase 6+)

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) non-goals:

- BPMN / workflow designer
- AI auto-routing
- Per-tenant **case** status workflows (morph status in 5A is a separate, fixed set)
- Full ERP modules inside `@repo/orbit-case`

---

## Database migrations

Apply schema changes **only** via Drizzle:

```bash
pnpm migrate
# equivalent: pnpm --filter @repo/database db:migrate
```

The migrate script repairs `drizzle.__drizzle_migrations` journal drift before running `drizzle-kit migrate`. Manual SQL / Supabase MCP `apply_migration` are blocked by Cursor hook `guard-drizzle-migrate`.

**JWT push capabilities:** migration `0025` installs the access-token hook. Authorization always uses the **live org role from the database** as the capability ceiling; JWT claims are optional hints capped to that ceiling. Missing, empty, invalid, or stale claims fall back to role defaults — **no manual re-sign-in is required for push authorization**. Automatic token refresh will pick up hook-injected claims when present.
