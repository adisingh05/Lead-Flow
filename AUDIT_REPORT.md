# Generated Codebase Audit Report

Date: 2026-06-14

## Executive Summary

The codebase does not currently pass the requested release checks. Prisma validates, and the shared TypeScript packages compile, but the monorepo, backend, and frontend production builds fail. CRM routes are partial rather than full CRUD, runtime DTO validation is absent, Swagger is only minimally wired, and the authentication guard has both a compile error and critical fail-open behavior.

## Verification Results

| Check | Result | Evidence |
| --- | --- | --- |
| Monorepo compiles | FAIL | `npm run build` stops in Turbo because root `package.json` has no `packageManager` field. |
| Prisma schema validates | PASS | `npx prisma validate --schema prisma/schema.prisma` reports the schema is valid. |
| Backend builds | FAIL | `nest build` fails at `apps/api/src/auth/clerk-auth.guard.ts:13`; the namespace import of `jwks-rsa` is not callable. |
| Frontend builds | FAIL | Next.js compiles assets, then type checking fails because `ChevronRight` is used but not imported in `apps/web/src/app/campaigns/page.tsx:504`. |
| All CRM CRUD endpoints exist | FAIL | Controllers provide mostly create/list/get operations. General update and delete routes are absent, and the `Message` model has no controller/module. |
| DTO validation exists | FAIL | Inputs are TypeScript interfaces only. Validation libraries are installed at the monorepo root, but there are no decorated DTO classes or global `ValidationPipe`. |
| Swagger documentation exists | PARTIAL | Swagger UI is mounted at `/docs` and a bearer scheme is declared, but request DTO schemas and operation-level auth metadata are not defined. |
| Authentication middleware works | FAIL | The guard prevents the backend from compiling and contains fail-open/token-verification and tenant-provisioning vulnerabilities. No auth tests exist. |

## Findings

### Critical: Authentication fails open

`apps/api/src/auth/clerk-auth.guard.ts:25-32` permits unauthenticated requests whenever `NODE_ENV` is not `production` **or** `CLERK_JWKS_URL` is missing. This also permits anonymous access in production when the environment variable is accidentally absent.

At `apps/api/src/auth/clerk-auth.guard.ts:39-52`, bearer tokens are decoded but only verified when a JWKS client exists. With no JWKS configuration, any syntactically valid, unsigned/forged token payload can supply its own `sub` and email.

At `apps/api/src/auth/clerk-auth.guard.ts:67-87`, any unknown identity is automatically added to the first organization as `OWNER`. A valid external identity, or a forged identity in fail-open mode, can therefore gain owner access to an existing tenant.

Even when JWKS is configured, verification does not constrain issuer, audience, or allowed algorithms. There are no automated tests covering missing tokens, forged tokens, valid Clerk tokens, invalid signatures, tenant assignment, or production configuration.

### High: Backend build fails

`apps/api/src/auth/clerk-auth.guard.ts:3,13` imports `jwks-rsa` as a namespace and then calls it. TypeScript reports `TS2349: This expression is not callable`. The backend cannot produce a build artifact until the import/API usage is corrected.

### High: CRM API is not full CRUD

Current route coverage:

| Resource | Create | List | Get one | Update | Delete |
| --- | --- | --- | --- | --- | --- |
| Companies | Yes | Yes | Yes | No | No |
| Contacts | Yes | Yes | Yes | No | No |
| Leads | Yes | Yes | Yes | Status only | No |
| Campaigns | Yes | Yes | Yes | Status only | No |
| ICPs | Yes | Yes | Yes | No | No |
| Sequences | Yes | Yes | Yes | No | No |
| Activities | No | Yes | No | No | No |
| Messages | No | No | No | No | No |

The Prisma schema contains `Message`, but `apps/api/src/crm/crm.module.ts` has no message module. None of the CRM controllers declares a `@Delete()` route.

### High: Request validation is absent

Controller bodies use interfaces from `packages/types/src/crm.ts`, for example `CreateCompanyInput`. Interfaces disappear at runtime, so Nest cannot validate or transform incoming data from these declarations. Although `class-validator` and `class-transformer` are installed at the monorepo root, no DTO classes use their decorators and `apps/api/src/main.ts` does not register a `ValidationPipe`.

Consequences include unvalidated enum/status values, malformed UUIDs reaching Prisma, unknown fields being accepted into controller inputs, and inconsistent 500/Prisma errors instead of structured 400 responses.

### Medium: Frontend production build fails

`apps/web/src/app/campaigns/page.tsx:504` renders `ChevronRight`, while the Lucide import at line 7 omits it. Next.js completes bundling but fails its type-check phase.

### Medium: Monorepo build configuration is invalid for installed Turbo

The root uses Turbo 2.9.18, which requires a `packageManager` field in root `package.json`. `npm run build` fails before scheduling workspace builds.

The committed `package-lock.json` also omits the API and web workspace dependency trees. Before a non-locking install, `npm ls --depth=0` reported both workspaces as unmet dependencies. A reproducible `npm ci` environment is therefore not represented by the lockfile.

### Medium: Swagger is present but incomplete

`apps/api/src/main.ts:14-21` creates an OpenAPI document and mounts Swagger UI at `/docs`, so basic Swagger infrastructure exists. However:

- Input types are interfaces, so request-body schemas are not available at runtime.
- No DTO classes use `@ApiProperty` metadata.
- The Nest Swagger compiler plugin is not enabled in `nest-cli.json`.
- Controllers do not use `@ApiBearerAuth`, `@ApiTags`, response decorators, or operation descriptions.

The result is a discoverable route list, not complete API documentation suitable for client generation or contract review.

### Secondary: Dependency audit reports known vulnerabilities

Installing the declared workspace dependencies with `--package-lock=false` reported 27 vulnerabilities: 3 low, 17 moderate, and 7 high. This audit did not apply automated dependency upgrades because they may be breaking and were outside the requested verification scope.

## Commands Run

```text
npm run build
npx prisma validate --schema prisma/schema.prisma
npm run build  (apps/api)
npm run build  (apps/web)
npm run build  (packages/db)
npx tsc -p tsconfig.json  (packages/types)
npx tsc -p tsconfig.json  (packages/shared)
npm ls --depth=0
npm install --package-lock=false
```

The database package, shared package, and types package compiled successfully. No test/spec files were found, so runtime authentication and endpoint behavior could not be verified by an automated test suite.

## Recommended Remediation Order

1. Make authentication fail closed; use Clerk's supported token verification path, validate issuer/audience/algorithm, and replace first-organization owner auto-provisioning with explicit tenant membership.
2. Fix the `jwks-rsa` import and add auth guard tests before exposing the API.
3. Add runtime DTO classes, validation decorators, and a strict global `ValidationPipe`.
4. Complete update/delete routes and add the missing message API, or explicitly document intentionally read-only resources.
5. Fix the frontend icon import, add the root `packageManager` field, regenerate the lockfile, and rerun a clean `npm ci && npm run build`.
6. Add Swagger DTO/operation/auth metadata and API integration tests.
