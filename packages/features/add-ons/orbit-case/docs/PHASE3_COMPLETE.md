# Orbit Case Phase 3 — complete

All eleven morph destinations are routed and push-enabled:

| Segment | Destination | Capability |
|---------|-------------|------------|
| `budget` | Budget Request | `budget` |
| `meeting` | Meeting Request | `meeting` |
| `approval` | Approval Request | `approval` |
| `purchase` | Purchase Request | `purchase` |
| `lead` | Lead Request | `lead` |
| `complaint` | Complaint Request | `complaint` |
| `risk` | Risk Request | `risk` |
| `project` | Project Request | `project` |
| `investigation` | Investigation Request | `investigation` |
| `capa` | CAPA Request | `capa` |
| `contract-review` | Contract Review Request | `contract-review` |

Shared infrastructure:

- Manifest: [`contract/morph-destination-manifest.ts`](../contract/morph-destination-manifest.ts)
- Push handler factory: [`engines/morph/create-two-field-morph-push-handler.ts`](../engines/morph/create-two-field-morph-push-handler.ts)
- Route loaders: [`engines/morph/morph-route-loaders.ts`](../engines/morph/morph-route-loaders.ts)
- App list/detail views: [`apps/app/.../components/orbit-morph-list-view.tsx`](../../../../apps/app/app/(authenticated)/orbit-case/components/orbit-morph-list-view.tsx)

See [`MORPH-DESTINATION-SLICE.md`](./MORPH-DESTINATION-SLICE.md) for the original slice checklist.
