# Security Audit

## Critical

### Cross-tenant IDOR / broken authorization

All CRM controllers require a valid Clerk token, but none use the authenticated context to authorize an organization or record. List endpoints trust `organizationId` query values. Create endpoints accept `organizationId` in bodies. Read/update/delete operate by raw record ID. An authenticated user can enumerate or act on another tenant's data if an ID is known or guessed, including organization deletion. This violates tenant isolation and is a **P0 release blocker**.

Affected areas include organizations, companies, contacts, leads, campaigns, activities, and analytics. Activities are especially unsafe because create accepts arbitrary `userId`, `leadId`, and `contactId`.

## High

- **RBAC is not enforced.** `UserRole` is synced from Clerk but no role/permission guard or policy exists; viewer/member/admin distinctions have no effect.
- **CORS is allow-all.** `app.enableCors()` uses broad defaults; restrict production origins, methods, headers, and credentials explicitly.
- **No rate limiting or security headers.** No Helmet or throttling configuration is present, increasing exposure to abuse and common header-level risks.
- **Organization synchronization is request-time and broad.** Authentication fetches Clerk user, organization and up to 100 memberships, then writes them on every request. This expands availability/cost exposure and only partially syncs large organizations.

## Medium

- No explicit CSRF model/documentation. Bearer-token API usage reduces classic CSRF exposure, but frontend/session/token transport and allowed CORS credentials must be configured as a coherent design.
- Exception filter exposes raw framework validation messages and does not log/correlate unexpected errors. This is not a direct secret leak as written, but it is insufficient incident instrumentation.
- Swagger is available without an environment guard. Do not expose internal API documentation publicly unless intentionally protected.
- No file upload surface was found. XSS risk is currently limited by React escaping, but future rich-note/campaign content needs sanitization and a CSP.
- Secrets are locally ignored by Git (good), but no environment template, secret rotation process, or startup validation is present.

## Low

- Hard-coded user/workspace/billing content creates confusing UI but is not a direct privilege escalation by itself.
- Query logging in the database package should be disabled or redacted in production to avoid sensitive operational data leakage.

## Required controls

Derive tenant identity and actor from verified auth; enforce membership and action policy server-side; scope every Prisma operation; validate relationship tenant ownership; configure narrow CORS, Helmet/CSP, rate limits and request size limits; use Clerk webhooks/event sync with idempotency; add audit logs, secure production error handling, monitoring, and authorization tests.
