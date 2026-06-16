# Orbit Case — Architecture

**Version:** 0.1  
**Status:** Phase 1 scaffold + Orbit Core implementation  
**Package:** `@repo/orbit-case`  
**Route:** `/orbit-case`

---

## 1. Purpose

**Orbit Case** is the universal work item for Afenda — not ticketing, helpdesk, CRM case, or ITSM. The primitive is:

> Something needs attention.

Users create work immediately without choosing a module, form, workflow, or SOP. Governed ERP projections are created later through an explicit **Push** (Phase 2+).

---

## 2. Vocabulary

| Term | Meaning |
|------|---------|
| Orbit Case | Smallest operational unit — universal work item |
| Push | Human-initiated morph into a governed destination |
| Template | Field contract for a push destination (not a workflow engine) |
| Origin | Source Orbit Case preserved on every pushed object |

---

## 3. Engine architecture

```txt
Orbit Case
    ├── Work Engine      (CRUD, assign, tags, status)
    ├── Board Engine     (list, kanban — calendar/timeline Phase 1.1)
    ├── Comment Engine
    ├── Attachment Engine (Phase 1.1 — @repo/storage)
    ├── Watch Engine
    ├── Activity Engine  (append-only audit)
    └── Morphing Engine  (Phase 2+)
            │
            ▼
       Push Registry → Templates → ERP Objects
```

| Engine | Phase | Location |
|--------|-------|----------|
| Work | 1 | `engines/work/` |
| Board | 1 | `engines/board/` |
| Activity | 1 | `engines/activity/` |
| Comment | 1 | `engines/work/comments.ts` |
| Link | 2 | `engines/link/` |
| Morph | 2–3 | `engines/morph/` |

---

## 4. Status model (v1)

Fixed set — no custom workflows in Phase 1:

`backlog` · `ready` · `doing` · `waiting` · `done` · `cancelled`

---

## 5. Push governance (Phase 2+)

Three layers:

1. **Push Registry** — tenant admin catalog (`lib/registry/push-destination-registry.ts`)
2. **Permission layer** — role visibility (`visibleToRoles`)
3. **Capability layer** — user capabilities (`requiredCapabilities`)

**Hard rules:**

- No auto-push
- No AI-generated ERP records
- Every push writes audit + preserves `originOrbitCaseId`

---

## 6. Non-goals (v1)

- BPMN / workflow designer
- Auto-routing by AI
- Per-tenant custom status workflows
- Full ERP modules inside `@repo/orbit-case`

---

## 7. Success metric

> Can a user start work without knowing which module, form, workflow, or SOP they need?

If yes → Orbit succeeds. If users still ask “HR or Finance?” → Orbit failed.

See [REQUIREMENTS.md](./REQUIREMENTS.md) for phased DoD.
