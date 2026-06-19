# Orbit Case Phase 3 — complete

All eleven morph destinations follow the **Budget slice pattern**:

| Layer | Pattern |
|-------|---------|
| Read engine | `engines/{segment}/{segment}-requests.ts` |
| Push handler | `engines/morph/push-handlers/{destination-id}.ts` |
| Types | `Orbit{Destination}RequestRecord/Dto` in `contract/orbit-case.types.ts` |
| Route loader | `wrapMorphRouteLoader` + `map{Destination}ToMorphRecord` |
| App routes | `/orbit-case/{segment}` + detail page |
| E2E | `orbit-case-push.spec.ts` (table-driven) |

| Segment | Engine module | Push handler |
|---------|---------------|--------------|
| `budget` | `engines/budget/` | `budget-request.ts` |
| `meeting` | `engines/meeting/` | `meeting-request.ts` |
| `approval` | `engines/approval/` | `approval-request.ts` |
| `purchase` | `engines/purchase/` | `purchase-request.ts` |
| `lead` | `engines/lead/` | `lead-request.ts` |
| `complaint` | `engines/complaint/` | `complaint-request.ts` |
| `risk` | `engines/risk/` | `risk-request.ts` |
| `project` | `engines/project/` | `project-request.ts` |
| `investigation` | `engines/investigation/` | `investigation-request.ts` |
| `capa` | `engines/capa/` | `capa-request.ts` |
| `contract-review` | `engines/contract-review/` | `contract-review-request.ts` |

Shared infrastructure:

- Manifest: [`contract/morph-destination-manifest.ts`](../contract/morph-destination-manifest.ts)
- Lifecycle registry: [`engines/morph/morph-lifecycle-registry.ts`](../engines/morph/morph-lifecycle-registry.ts)
- Push handler factory: [`engines/morph/create-two-field-morph-push-handler.ts`](../engines/morph/create-two-field-morph-push-handler.ts)
- Pilot push handler factory: [`engines/morph/create-morph-field-push-handler.ts`](../engines/morph/create-morph-field-push-handler.ts)
- Route loaders: [`engines/morph/morph-route-loaders.ts`](../engines/morph/morph-route-loaders.ts)
- App list/detail: [`OrbitMorphListView`](../../../../apps/app/app/(authenticated)/orbit-case/_components/orbit-morph-list-view.tsx) / [`OrbitMorphDetailView`](../../../../apps/app/app/(authenticated)/orbit-case/_components/orbit-morph-detail-view.tsx)

See [`MORPH-DESTINATION-SLICE.md`](./MORPH-DESTINATION-SLICE.md) for the slice checklist.
