# Architecture Audit

## Structure and dependency graph

The repository is a pnpm/Turborepo monorepo with `apps/web` (Next.js) and `apps/api` (NestJS), plus `packages/db`, `packages/shared`, `packages/types`, and `packages/ui`. This is an appropriate top-level shape, but package boundaries are mostly nominal: the applications use local types and their own Prisma client/schema rather than consuming the shared packages.

```
apps/web  ──HTTP/Clerk token──>  apps/api  ──Prisma──> PostgreSQL
     │                                  │
     └─ local types/hooks/services       └─ local Prisma schema/client
packages/db/shared/types/ui: present, but minimally or not consumed
```

`apps/api/prisma/schema.prisma` and `packages/db/prisma/schema.prisma` are duplicated. API build/generation references the API copy, while `predev` points to the package copy. This is a schema-drift and deployment-risk hotspot. Each workspace also has its own lockfile, despite a root workspace lockfile, undermining deterministic dependency management.

## Architecture quality

| Dimension | Assessment |
|---|---|
| Monorepo | Partial: Turborepo/pnpm are configured, but root scripts are effectively absent and package ownership is unclear. |
| Module organization | Reasonable Nest feature folders and Next App Router grouping. |
| Layering | Weak: controllers pass user-controlled DTOs directly to services and services directly to Prisma. No authorization/policy or repository boundary. |
| DDD / bounded contexts | Basic entity modules exist; no clear aggregates, domain services, commands, or events. This is acceptable for a small CRUD CRM but not yet a durable enterprise architecture. |
| SOLID | Services are short and focused, but authorization and tenancy responsibilities are missing; `CampaignsService` mixes query orchestration and analytics aggregation. |
| Shared contracts | Missing: frontend interfaces duplicate persistence/API shapes and can silently drift. |

## Specific findings

- `OrganizationsService.findAll()` is globally scoped. Its use by the organization provider makes “first organization” arbitrary and unsafe.
- Tenant context from Clerk is synchronized, but then ignored by all resource controllers/services; query and body IDs become the security boundary.
- The `packages/db` Prisma singleton emits query logs in every environment, while the API creates an unrelated Prisma client.
- API `predev` points at `../../packages/db/prisma/schema.prisma`, but API build uses `./prisma/schema.prisma`; this makes local development and production generation potentially different.
- The root `test` command intentionally fails and there are no root build/lint/dev scripts to standardize developer and CI actions.

## Recommendations

1. Select `packages/db` as the single schema/client owner, delete duplication only through a controlled migration, and consume it from the API.
2. Create a request-scoped tenant/actor context and policy layer. Controllers should derive organization and actor from verified authentication, not request body/query parameters.
3. Define versioned shared API contracts (or generate a typed client from OpenAPI) instead of mirroring interfaces manually.
4. Add root Turbo scripts and one lockfile policy; make build/lint/test tasks deterministic and non-mutating.
5. Preserve modular feature directories, but introduce explicit application-service/policy/repository seams as complexity grows.
